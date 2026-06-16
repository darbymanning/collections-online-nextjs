/** Scrape each GLAM museum's live navigation and regenerate its
 * `src/app/library/scraped.{ref}.ts` module.
 *
 * The museum sites all run the University of Oxford "Mosaic" Drupal theme, so the
 * primary navigation tree lives in one `.menu-block-top_nav` block and the header
 * utility links in the `.view-header-links` view (separate from social icons,
 * which sit in `.view-social-media-links`). We drive a real browser so the
 * extraction is plain DOM querying rather than brittle regex.
 *
 * Run explicitly — it is never part of the build:
 *
 *   bun run scrape                  # all museums
 *   bun run scrape --museums=ash,prm
 *
 * Each generated file is written read-only; this script restores write access
 * before regenerating, so there is no need to chmod it back by hand.
 */
import { chromium } from "@playwright/test"
import { $ } from "bun"

/** Museum ref → display name + live site. Mirrors `museumDirectory` in
 * `config.ts`, kept standalone so the scraper never imports `config.ts` (which
 * imports the very files this script generates). */
const MUSEUMS = {
	ash: { name: "Ashmolean Museum", url: "https://www.ashmolean.org" },
	oum: { name: "Oxford University Museum of Natural History", url: "https://www.oumnh.ox.ac.uk" },
	prm: { name: "Pitt Rivers Museum", url: "https://www.prm.ox.ac.uk" },
	hsm: { name: "History of Science Museum", url: "https://www.hsm.ox.ac.uk" },
} as const

type Ref = keyof typeof MUSEUMS
const allRefs = Object.keys(MUSEUMS) as Array<Ref>

/** A node in the scraped menu tree — mirrors `MenuItem` in `config.ts`. */
type MenuItem = { label: string; href?: string; children?: Array<MenuItem> }
type TopLink = { label: string; href: string }
type Scraped = { topLinks: Array<TopLink>; nav: Array<MenuItem> }

/** Acronyms to keep intact when sentence-casing an all-caps label (only the
 * Ashmolean ships its menu in caps). Deliberately excludes anything that is also
 * a common word — e.g. "US"/"UK" would wreck "Working for us". */
const ACRONYMS: Record<string, string> = {}
for (const a of ["PDF", "FAQ", "FAQs", "KS1", "KS2", "KS3", "KS4", "KS5", "STEM", "EFL", "DNA"]) {
	ACRONYMS[a.toUpperCase()] = a
}

/** Sentence-case one all-caps label, restoring known acronyms. */
function sentenceCase(label: string): string {
	let firstWord = true
	return label
		.split(/(\s+)/)
		.map((token) => {
			if (/^\s*$/.test(token)) return token
			const core = token.replace(/[^\p{L}\p{N}]/gu, "")
			const canonical = ACRONYMS[core.toUpperCase()]
			if (canonical) {
				firstWord = false
				return token.replace(core, canonical)
			}
			const cased = firstWord
				? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
				: token.toLowerCase()
			firstWord = false
			return cased
		})
		.join("")
}

/** Collapse whitespace, and sentence-case labels that arrive fully upper-case
 * (the others — already mixed-case — pass through untouched). */
function normalizeLabel(label: string): string {
	const trimmed = label.replace(/\s+/g, " ").trim()
	const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed !== trimmed.toLowerCase()
	return isAllCaps ? sentenceCase(trimmed) : trimmed
}

/** Relativise links that point back at the museum's own site (matching the
 * `/path` style `config.ts` uses), and leave genuinely off-site links absolute. */
function normalizeHref(href: string, base: string, sameSite: Set<string>): string {
	try {
		const url = new URL(href, base)
		if (sameSite.has(url.host)) return `${url.pathname}${url.search}${url.hash}` || "/"
		return url.toString()
	} catch {
		return href
	}
}

/** Pull the nav tree and header links out of a loaded Mosaic page. Runs in the
 * browser, so it returns only plain serialisable data. */
function extractFromPage(): Scraped {
	const clean = (el: Element): string => {
		const clone = el.cloneNode(true) as Element
		clone.querySelectorAll(".icon, .sr-only, .mobile-expand").forEach((n) => n.remove())
		return (clone.textContent ?? "").replace(/\s+/g, " ").trim()
	}

	const walk = (ul: Element): Array<MenuItem> => {
		const items: Array<MenuItem> = []
		for (const li of Array.from(ul.children).filter((c) => c.tagName === "LI")) {
			const container = li.querySelector(":scope > .item-container") ?? li
			const link = container.querySelector<HTMLAnchorElement>(":scope > a:not(.mobile-expand)")
			const labelEl = link ?? container.querySelector(":scope > div")
			const label = labelEl ? clean(labelEl) : ""
			if (!label) continue
			const node: MenuItem = { label }
			const href = link?.getAttribute("href")
			if (href) node.href = href
			const childUl = li.querySelector(":scope > ul")
			if (childUl) {
				const children = walk(childUl)
				if (children.length) node.children = children
			}
			items.push(node)
		}
		return items
	}

	const wrapper = document.querySelector(".menu-block-top_nav > ul")
	const nav = wrapper ? walk(wrapper) : []

	const topLinks: Array<TopLink> = []
	const seen = new Set<string>()
	for (const view of document.querySelectorAll(".view-header-links")) {
		for (const a of view.querySelectorAll<HTMLAnchorElement>("a[href]")) {
			const href = a.getAttribute("href") ?? ""
			const label = clean(a)
			const key = `${label}|${href}`
			if (!href || !label || seen.has(key)) continue
			seen.add(key)
			topLinks.push({ label, href })
		}
	}

	return { topLinks, nav }
}

function normalizeTree(
	items: Array<MenuItem>,
	base: string,
	sameSite: Set<string>,
): Array<MenuItem> {
	return items.map((item) => {
		const node: MenuItem = { label: normalizeLabel(item.label) }
		if (item.href) node.href = normalizeHref(item.href, base, sameSite)
		if (item.children) node.children = normalizeTree(item.children, base, sameSite)
		return node
	})
}

/** Serialise a menu tree as indented TypeScript object literals. oxfmt has the
 * final say on formatting, but readable input keeps diffs sane. */
function serializeItems(items: Array<MenuItem>, depth: number): string {
	if (items.length === 0) return "[]"
	const pad = "\t".repeat(depth)
	const inner = "\t".repeat(depth + 1)
	const lines = items.map((node) => {
		const parts = [`label: ${JSON.stringify(node.label)}`]
		if (node.href != null) parts.push(`href: ${JSON.stringify(node.href)}`)
		if (node.children?.length) parts.push(`children: ${serializeItems(node.children, depth + 1)}`)
		return `${inner}{ ${parts.join(", ")} }`
	})
	return `[\n${lines.join(",\n")},\n${pad}]`
}

function serializeTopLinks(links: Array<TopLink>): string {
	if (links.length === 0) return "[]"
	const lines = links.map(
		(l) => `\t{ label: ${JSON.stringify(l.label)}, href: ${JSON.stringify(l.href)} }`,
	)
	return `[\n${lines.join(",\n")},\n]`
}

function generateModule(ref: Ref, scraped: Scraped): string {
	const { name, url } = MUSEUMS[ref]
	return `/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * ${name}'s navigation, scraped from ${url}
 * on ${new Date().toISOString()} by \`bun run scrape\`.
 *
 * Regenerate with: bun run scrape --museums=${ref}
 *
 * Written read-only; the scrape script restores write access before each
 * regeneration, so there is no need to chmod it back yourself.
 */
import type { MenuItem } from "./config"

/** Utility links across the top of ${name}'s header. */
export const topLinks: Array<{ label: string; href: string }> = ${serializeTopLinks(scraped.topLinks)}

/** ${name}'s primary navigation (the burger-menu drill-down). */
export const nav: Array<MenuItem> = ${serializeItems(scraped.nav, 0)}
`
}

/** Resolve the `--museums=a,b` / `--museums a,b` argument (default: all). */
function parseTargets(argv: Array<string>): Array<Ref> {
	const flag = argv.findIndex((a) => a === "--museums")
	const raw = argv.find((a) => a.startsWith("--museums="))?.slice("--museums=".length)
	const value = raw ?? (flag !== -1 ? argv[flag + 1] : undefined)
	if (!value) return allRefs

	const requested = value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
	const unknown = requested.filter((s) => !allRefs.includes(s as Ref))
	if (unknown.length) {
		console.error(`Unknown museum(s): ${unknown.join(", ")}. Valid: ${allRefs.join(", ")}`)
		process.exit(1)
	}
	return requested as Array<Ref>
}

const targets = parseTargets(process.argv.slice(2))
const browser = await chromium.launch()
const page = await browser.newPage()
const written: Array<string> = []
let failed = false

for (const ref of targets) {
	const { url } = MUSEUMS[ref]
	const outPath = `src/app/library/scraped.${ref}.ts`
	try {
		await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
		const scraped = await page.evaluate(extractFromPage)

		if (scraped.nav.length === 0) throw new Error("no navigation found — has the markup changed?")

		const host = new URL(url).host
		const sameSite = new Set([host, host.replace(/^www\./, "")])
		const normalized: Scraped = {
			topLinks: scraped.topLinks.map((l) => ({
				label: normalizeLabel(l.label),
				href: normalizeHref(l.href, url, sameSite),
			})),
			nav: normalizeTree(scraped.nav, url, sameSite),
		}

		// the previous run left the file read-only; reopen it for writing
		await $`chmod u+w ${outPath}`.nothrow().quiet()
		await Bun.write(outPath, generateModule(ref, normalized))
		written.push(outPath)
		console.log(
			`${ref}: ${normalized.topLinks.length} top links, ${normalized.nav.length} nav sections → ${outPath}`,
		)
	} catch (error) {
		failed = true
		console.error(`${ref}: failed — ${error instanceof Error ? error.message : error}`)
	}
}

await browser.close()

if (written.length) {
	// JSON.stringify and oxfmt disagree on layout — let oxfmt have the last word
	await $`bunx oxfmt ${written}`.quiet()
	// re-lock so the generated files aren't edited by hand
	for (const path of written) await $`chmod 444 ${path}`
}

if (failed) process.exit(1)
