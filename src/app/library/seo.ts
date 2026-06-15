import type { Metadata } from "next"
import { museum } from "./config"
import type { Props } from "../item/[id]/[[...slug]]/page"

/** Site-wide robots policy, driven by the museum's `indexable` flag.
 *
 * Opted-in museums get the rich Googlebot directives that unlock large image
 * previews and full-length snippets in search and AI results. Opted-out museums
 * (Pitt Rivers) emit `noindex, nofollow` everywhere — the authoritative signal
 * that keeps pages out of the index even though they stay reachable directly. */
export const robotsMetadata: Metadata["robots"] = museum.indexable
	? {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		}
	: {
			index: false,
			follow: false,
			nocache: true,
			googleBot: { index: false, follow: false, noimageindex: true },
		}

/** Open Graph fields shared by every page. Per-page metadata spreads these and
 * adds `title`, `description`, `url`, and `images` (Next.js replaces nested
 * metadata objects wholesale rather than deep-merging them). */
export const openGraphDefaults: Metadata["openGraph"] = {
	type: "website",
	siteName: museum.name,
	locale: "en_GB",
}

/** The best available prose for a meta description / OG description, stripped of
 * markup and clamped to a snippet-friendly length. */
export function metaDescription(props: Props): string | undefined {
	const text =
		props.briefDescription || props.longDescription || props.description || props.subTitle

	if (!text) return undefined

	const clean = text
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim()

	if (!clean) return undefined

	return clean.length > 300 ? `${clean.slice(0, 297).trimEnd()}…` : clean
}

/** Absolute image URLs for OG tags and structured data. The DAMs are IIIF
 * level 0 — they only serve pre-generated derivatives, so we ask for the full
 * (`max`) rendition (the same URL the manifest paints onto the canvas) rather
 * than an arbitrary size, which would 404. Museums without a DAMs already carry
 * absolute S3 URLs. */
export function imageUrls(props: Props): Array<string> {
	return (props.images ?? []).flatMap((image) => {
		if ("service" in image && image.service) return [`${image.service}/full/max/0/default.jpg`]
		if ("url" in image && image.url) return [image.url]
		return []
	})
}

type JsonLd = Record<string, unknown>

/** Drops nullish, empty-string, and empty-array values so the emitted JSON-LD
 * carries only the fields we actually have. */
function compact<T extends JsonLd>(object: T): T {
	return Object.fromEntries(
		Object.entries(object).filter(([, value]) => {
			if (value == null) return false
			if (typeof value === "string") return value.trim() !== ""
			if (Array.isArray(value)) return value.length > 0
			return true
		}),
	) as T
}

function uniqueStrings(values: Array<string | undefined>): Array<string> {
	return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

/** Material/medium/technique terms, however the museum happens to express them. */
function materials(props: Props): Array<string> {
	const values: Array<string | undefined> = []

	for (const entry of props.materialAndProcess ?? [])
		values.push(entry.links?.length ? entry.links.at(-1)?.label : entry.text)
	for (const entry of props.materialsList ?? []) values.push(entry.label)
	for (const entry of props.physicalMaterial ?? []) values.push(entry.label)
	for (const entry of props.physicalMedium ?? []) values.push(entry.label)
	for (const entry of props.physicalTechnique ?? []) values.push(entry.label)

	return uniqueStrings(values)
}

/** Subjects, cultural groups, and object types, as flat keyword/topic terms. */
function topics(props: Props): Array<string> {
	const values: Array<string | undefined> = []

	for (const entry of props.subject ?? []) values.push(entry.label)
	for (const entry of props.culturalGroups ?? []) values.push(entry.label)
	for (const entry of props.objectType ?? []) {
		if ("links" in entry) values.push(...entry.links.map((link) => link.label))
		else values.push(entry.text)
	}

	return uniqueStrings(values)
}

/** Specific place names from the geographical provenance trail, plus locality. */
function places(props: Props): Array<string> {
	const values: Array<string | undefined> = []

	for (const entry of props.geographicalProvenance ?? []) {
		if (!entry) continue
		if ("region" in entry) values.push(entry.region)
		else if (entry.links?.length) values.push(entry.links.at(-1)?.label)
	}
	for (const locality of props.locality ?? []) values.push(locality)

	return uniqueStrings(values)
}

function dateCreated(props: Props): string | undefined {
	if (props.datePeriodText) return props.datePeriodText

	const date = props.datePeriod?.[0]
	if (!date) return undefined

	return "period" in date ? date.period : "from" in date ? date.from : undefined
}

/** schema.org JSON-LD for a catalogue object page: the object itself (typed per
 * museum), the museum as its holding institution, and a breadcrumb trail. Built
 * from the already-normalised page props, with `canonical` as the absolute page
 * URL. */
export function collectionObjectJsonLd(props: Props, canonical: string): JsonLd {
	const objectId = `${canonical}#object`
	const organizationId = `${museum.url.origin}/#organization`

	const description =
		props.briefDescription || props.longDescription || props.description || props.subTitle
	const materialTerms = materials(props)
	const topicTerms = topics(props)
	const placeNames = places(props)

	const work = compact({
		"@type": museum.schema,
		"@id": objectId,
		name: props.title,
		alternateName: props.subTitle && props.subTitle !== props.title ? props.subTitle : undefined,
		description,
		url: canonical,
		mainEntityOfPage: canonical,
		image: imageUrls(props),
		identifier: props.objectNumber || props.accessionNumbers?.[0] || props.inventoryNumber,
		creator: (props.persons ?? []).map((person) =>
			compact({ "@type": "Person", name: person.name }),
		),
		dateCreated: dateCreated(props),
		// VisualArtwork carries materials as artMedium; CreativeWork as material
		artMedium: museum.schema === "VisualArtwork" ? materialTerms : undefined,
		material: museum.schema === "CreativeWork" ? materialTerms : undefined,
		keywords: topicTerms.length ? topicTerms.join(", ") : undefined,
		about: topicTerms.map((name) => ({ "@type": "Thing", name })),
		contentLocation: placeNames.map((name) => ({ "@type": "Place", name })),
		isPartOf: props.collectionType
			? { "@type": "Collection", name: props.collectionType }
			: undefined,
		creditText: props.creditLine,
		copyrightNotice: props.imageCopyright,
		inLanguage: "en-GB",
		isAccessibleForFree: true,
		// the holding museum, referenced rather than repeated
		maintainer: { "@id": organizationId },
		provider: { "@id": organizationId },
	})

	const organization = compact({
		"@type": ["Museum", "Organization"],
		"@id": organizationId,
		name: museum.name,
		url: museum.url.toString(),
	})

	const crumbs = [
		{ name: museum.name, item: museum.urls.self.toString() },
		props.collectionType ? { name: props.collectionType } : undefined,
		{ name: props.title, item: canonical },
	].filter((crumb): crumb is { name: string; item?: string } => Boolean(crumb))

	const breadcrumb = {
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) =>
			compact({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: crumb.item,
			}),
		),
	}

	return {
		"@context": "https://schema.org",
		"@graph": [work, organization, breadcrumb],
	}
}
