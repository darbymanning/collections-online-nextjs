"use client"
import { museum, type MenuItem } from "$library/config"
import { cn } from "$library/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useHeaderScrollHide } from "$hooks/use-scroll-hide"
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button } from "$components/button"
import { SearchFields, searchUrl, type SearchScope } from "$components/site-search"

/** Which overlay panel is open, if any. The two panels are mutually exclusive —
 * opening one closes the other — so a single union beats two booleans. */
type Panel = "search" | "menu"

/** A flattened drill-down layer: `items` are the rows it shows, `id` is the
 * `/`-joined path of labels that selects it (root is `""`), and `parentId` is the
 * layer "Go back" returns to (`null` at the root). `title`/`href` are the section
 * this layer belongs to, shown as a heading above its children (a link when the
 * section has its own page; `null`/plain text otherwise, and absent at the root). */
type MenuPanelDef = {
	id: string
	parentId: string | null
	title: string | null
	href: string | null
	items: Array<MenuItem>
}

/** Flatten the museum's nav tree into one layer per node-with-children (root
 * included), keyed by path, so every layer is rendered up front and we just
 * toggle which is active — keeping each layer's enter animation independent. */
function buildMenuPanels(nav: Array<MenuItem>): Array<MenuPanelDef> {
	const panels: Array<MenuPanelDef> = []
	function walk(
		items: Array<MenuItem>,
		id: string,
		parentId: string | null,
		title: string | null,
		href: string | null,
	) {
		panels.push({ id, parentId, title, href, items })
		for (const item of items) {
			if (item.children?.length) {
				walk(
					item.children,
					id ? `${id}/${item.label}` : item.label,
					id,
					item.label,
					item.href ?? null,
				)
			}
		}
	}
	walk(nav, "", null, null, null)
	return panels
}

const menuPanels = buildMenuPanels(museum.header.nav)

/** The layer one level up from `path` (root is `""`). */
function parentPath(path: string): string {
	const index = path.lastIndexOf("/")
	return index === -1 ? "" : path.slice(0, index)
}

/** Off-site links keep their absolute URL; everything else resolves against the
 * museum's main website. */
function resolveHref(href: string): string {
	return href.startsWith("http") ? href : `${museum.urls.parent.origin}${href}`
}

/** Per-item stagger: a transition-delay that grows with the row index, so menu
 * items fade and slide in one after another (cf. the payload-test menu). */
function delay(index: number): React.CSSProperties {
	return { "--delay": `${120 + index * 45}ms` } as React.CSSProperties
}

/** Shared enter animation — items rest hidden (shifted + transparent) and, once
 * their panel is active, slide to place and fade in on the staggered delay.
 * Motion is dropped for visitors who prefer reduced motion. */
const enter =
	"translate-x-4 opacity-0 transition-[opacity,translate] duration-500 group-data-active/panel:translate-x-0 group-data-active/panel:opacity-100 group-data-active/panel:delay-(--delay) motion-reduce:transition-none"

/** Same idea as `enter`, but the feature panel's copy reacts to the menu opening
 * (not a layer activating), so it keys off the nav-level `group/menu`. */
const featureEnter =
	"translate-x-4 opacity-0 transition-[opacity,translate] duration-700 ease-out group-data-open/menu:translate-x-0 group-data-open/menu:opacity-100 group-data-open/menu:delay-(--delay) motion-reduce:transition-none"

const rowClass = cn(
	"group/item flex w-full items-center justify-between gap-4 border-b border-current/10 py-4 text-left font-medium",
	enter,
)

/** One sliding layer of the menu's left column. Only the active layer is visible
 * and interactive; the rest sit transparent and inert beneath it, so the primary
 * list and each submenu cross-fade in place. */
function MenuPanel({ active, children }: { active: boolean; children: ReactNode }) {
	return (
		<div
			data-active={active || undefined}
			inert={!active}
			className="group/panel pointer-events-none absolute inset-0 overflow-y-auto overscroll-contain px-[5vw] py-8 data-active:pointer-events-auto"
		>
			{children}
		</div>
	)
}

export function Header() {
	const hidden = useHeaderScrollHide()
	const [open, setOpen] = useState<Panel | null>(null)
	const [path, setPath] = useState("")
	const [scope, setScope] = useState<SearchScope>("collections-online")
	const [phrase, setPhrase] = useState("")
	const headerRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLElement>(null)
	const menuButtonRef = useRef<HTMLButtonElement>(null)
	const searchButtonRef = useRef<HTMLButtonElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const lastOpen = useRef<Panel | null>(null)

	const searchOpen = open === "search"
	const menuOpen = open === "menu"

	// publish the header's height so the overlays can clear it; track it live
	// (the logo settles after mount, and it changes across breakpoints)
	useEffect(() => {
		const header = headerRef.current
		if (!header) return
		function publishHeight() {
			const el = headerRef.current
			if (el) document.body.style.setProperty("--header-height", `${el.offsetHeight}px`)
		}
		publishHeight()
		const observer = new ResizeObserver(publishHeight)
		observer.observe(header)
		return () => observer.disconnect()
	}, [])

	// leaving the menu resets it back to the primary list
	useEffect(() => {
		if (open !== "menu") setPath("")
	}, [open])

	// Escape steps back: up one menu layer first, then closes the panel entirely
	useEffect(() => {
		if (!open) return
		function onKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape") return
			if (open === "menu" && path) setPath(parentPath(path))
			else setOpen(null)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [open, path])

	// move focus into a panel as it opens (and on each menu drill) and back to its
	// trigger when it closes, so keyboard focus never lands on the now-inert overlay
	useEffect(() => {
		const previous = lastOpen.current
		lastOpen.current = open
		if (open === "search") searchInputRef.current?.focus({ preventScroll: true })
		else if (open === "menu") {
			const target = menuRef.current?.querySelector<HTMLElement>(
				"[data-active] a, [data-active] button",
			)
			target?.focus({ preventScroll: true })
		} else if (previous === "search") searchButtonRef.current?.focus({ preventScroll: true })
		else if (previous === "menu") menuButtonRef.current?.focus({ preventScroll: true })
	}, [open, path])

	// while an overlay is open, take the page behind it (the main content and
	// footer it covers) out of the tab order and the a11y tree, so focus can't
	// reach what's sitting under the overlay. The header stays interactive — it's
	// above the overlay and holds the controls that close it.
	useEffect(() => {
		const behind = [document.getElementById("main-content"), document.querySelector("footer")]
		for (const el of behind) el?.toggleAttribute("inert", open !== null)
		return () => {
			for (const el of behind) el?.removeAttribute("inert")
		}
	}, [open])

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const trimmed = phrase.trim()
		if (!trimmed) return
		window.location.assign(searchUrl(scope, trimmed))
	}

	return (
		<>
			<header
				ref={headerRef}
				// keep the header pinned while a panel is open, even mid-scroll
				data-hidden={(hidden && !open) || undefined}
				className="sticky top-0 z-20 flex items-center justify-between border-b border-current/10 accented px-[5vw] py-4 transition-[translate,opacity] duration-500 data-hidden:pointer-events-none data-hidden:-translate-y-full data-hidden:opacity-0"
			>
				<a className="rounded" href={museum.url.toString()}>
					<Image
						src={museum.header.logo}
						alt={museum.name}
						width={museum.header.logoWidth}
						loading="eager"
					/>
				</a>
				<div className="flex items-center gap-2">
					<div className="flex gap-4 border-r border-r-current/20 pr-5 text-sm max-lg:hidden">
						{museum.header.topLinks.map((link) => (
							<Link
								key={link.href}
								className="rounded animated-underline hover:[--underline-w:100%]"
								href={resolveHref(link.href)}
							>
								{link.label}
							</Link>
						))}
					</div>
					<button
						ref={searchButtonRef}
						className="flex size-10 items-center justify-center rounded-full p-2"
						data-open={searchOpen || undefined}
						aria-label={searchOpen ? "Close search" : "Search"}
						aria-expanded={searchOpen}
						aria-controls="site-search"
						onClick={() => setOpen(searchOpen ? null : "search")}
					>
						<span className="search-icon text-base"></span>
					</button>
					<button
						ref={menuButtonRef}
						className="group flex size-10 items-center justify-center rounded-full p-2"
						data-open={menuOpen || undefined}
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						aria-controls="main-menu"
						onClick={() => setOpen(menuOpen ? null : "menu")}
					>
						{/* three-bar burger that folds into an X when open (cf. the
						 * payload-test header): the middle bar collapses while the outer
						 * bars slide to centre and cross */}
						<span className="grid w-5 gap-1.25 [&>span]:h-0.5 [&>span]:w-full [&>span]:rounded-full [&>span]:bg-current [&>span]:transition [&>span]:duration-300">
							<span className="origin-center group-data-open:translate-y-1.75 group-data-open:rotate-45" />
							<span className="group-data-open:scale-x-0" />
							<span className="origin-center group-data-open:-translate-y-1.75 group-data-open:-rotate-45" />
						</span>
					</button>
				</div>
			</header>
			<form
				id="site-search"
				role="search"
				aria-label="Site search"
				onSubmit={handleSubmit}
				data-open={searchOpen || undefined}
				className="fixed z-10 flex w-full -translate-y-full items-center justify-center overflow-auto rounded-b-4xl accented pt-(--header-height) transition-[translate,box-shadow] duration-500 data-open:translate-none data-open:shadow-2xl"
				inert={!searchOpen}
			>
				<div className="grid w-full gap-4 p-[5vw] text-sm">
					<h2 className="text-4xl max-md:hidden">Search</h2>
					<SearchFields
						scope={scope}
						setScope={setScope}
						phrase={phrase}
						setPhrase={setPhrase}
						inputRef={searchInputRef}
					/>
				</div>
			</form>
			<nav
				id="main-menu"
				ref={menuRef}
				aria-label="Main menu"
				data-open={menuOpen || undefined}
				// full-height overlay that slides down from behind the still-visible
				// sticky header (cf. ox.ac.uk's menu): links on the left, feature image
				// on the right. Locked to the viewport (`inset-0` + `overflow-hidden`)
				// with `grid-rows-[1fr]` stretching both columns, so the image fills the
				// height and each column scrolls internally rather than the page.
				className="group/menu fixed inset-0 z-10 grid -translate-y-full grid-rows-[1fr] overflow-hidden accented pt-(--header-height) transition-[translate,box-shadow] duration-500 data-open:translate-none data-open:shadow-2xl md:grid-cols-2"
				inert={!menuOpen}
			>
				<div className="relative min-h-0 overflow-hidden">
					{/* every layer is rendered up front; only the one matching `path` is
					 * active, so drilling in and out is a cross-fade between layers */}
					{menuPanels.map((panel) => (
						<MenuPanel key={panel.id || "root"} active={menuOpen && path === panel.id}>
							{panel.parentId !== null && (
								<button
									type="button"
									onClick={() => setPath(panel.parentId ?? "")}
									className={cn(
										"group/item mb-6 inline-flex items-center gap-2 rounded text-lg font-medium",
										enter,
									)}
									style={delay(0)}
								>
									<ArrowLeft
										aria-hidden
										className="text-xl transition-transform duration-300 group-hover/item:-translate-x-1"
									/>
									Go back
								</button>
							)}
							{panel.title !== null && (
								<h2
									className={cn(
										"mb-1 border-b border-current/10 pb-4 text-4xl font-semibold",
										enter,
									)}
									style={delay(1)}
								>
									{panel.href !== null ? (
										<a href={resolveHref(panel.href)} className="group/item inline-block">
											<span className="animated-underline group-hover/item:[--underline-w:100%]">
												{panel.title}
											</span>
										</a>
									) : (
										panel.title
									)}
								</h2>
							)}
							<ol className="grid">
								{panel.items.map((item, index) => {
									const hasChildren = !!item.children?.length
									const childId = panel.id ? `${panel.id}/${item.label}` : item.label
									// deeper layers offset the stagger past the "Go back" + heading rows
									const style = delay(panel.parentId === null ? index : index + 2)
									const className = cn(
										rowClass,
										panel.parentId === null ? "text-4xl" : "text-2xl",
										"rounded",
									)
									const label = (
										<span className="animated-underline group-hover/item:[--underline-w:100%]">
											{item.label}
										</span>
									)
									return (
										<li key={item.label + index}>
											{hasChildren ? (
												<button
													type="button"
													onClick={() => setPath(childId)}
													className={className}
													style={style}
												>
													{label}
													<ArrowRight
														aria-hidden
														className="shrink-0 text-2xl transition-transform duration-300 group-hover/item:translate-x-1"
													/>
												</button>
											) : item.href ? (
												<a
													href={resolveHref(item.href)}
													className={className}
													style={style}
												>
													{label}
												</a>
											) : (
												<span className={className} style={style}>
													{label}
												</span>
											)}
										</li>
									)
								})}
							</ol>
						</MenuPanel>
					))}
				</div>
				<aside className="relative hidden overflow-hidden md:block">
					{/* slow ken-burns: rests zoomed in and eases back to 1:1 as the menu opens */}
					<Image
						src={museum.header.hero}
						alt={museum.header.heroAlt}
						fill
						sizes="(min-width: 768px) 50vw, 0px"
						placeholder="blur"
						className="scale-[1.2] object-cover transition-transform duration-1500 ease-out group-data-open/menu:scale-100 motion-reduce:transition-none"
					/>
					{/* darken the lower image so the feature copy stays legible */}
					<span
						className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"
						aria-hidden
					/>
					<div className="relative grid h-full content-end gap-4 p-[5vw] text-white md:p-10">
						<h2 className={cn("text-4xl font-semibold", featureEnter)} style={delay(0)}>
							{museum.header.feature.title}
						</h2>
						<p
							className={cn("max-w-prose text-pretty text-white/85", featureEnter)}
							style={delay(1)}
						>
							{museum.header.feature.text}
						</p>
						<div className={cn("mt-2 justify-self-start", featureEnter)} style={delay(2)}>
							<Button
								href={resolveHref(museum.header.feature.href)}
								fill="var(--color-secondary)"
								onFill="var(--color-on-secondary)"
								outline="var(--color-cta-rest)"
								revealIcon
								className="font-bold"
							>
								{museum.header.feature.label}
								<ArrowRight aria-hidden />
							</Button>
						</div>
					</div>
				</aside>
			</nav>
		</>
	)
}
