import { museum } from "./config"
import { slugify } from "./slug"
import type { CollectionObject, Museum } from "./types"
import { derivative } from "./utils"

type SimilarityRule = {
	/** field paths whose values must match the current object's */
	similar: Array<string>
	/** field paths whose values must differ from the current object's */
	different: Array<string>
}

/** Field combinations behind the legacy "Further items to explore" section
 * (the legacy webapp's `similarityFields`), keyed by museum and the object's
 * `collection` value. Museums and collections without rules show no section.
 *
 * Note ash records carry no `datePeriod.preview`, so the first ash rule
 * degenerates to "different place and category" — faithfully kept. */
const similarityRules: Partial<Record<Museum, Record<string, Array<SimilarityRule>>>> = {
	ash: {
		"ash collection": [
			{
				similar: ["datePeriod.preview"],
				different: ["geographicalProvenance.place", "webCategory"],
			},
			{
				similar: ["geographicalProvenance.place"],
				different: ["datePeriod.preview", "webCategory"],
			},
			{
				similar: ["webCategory"],
				different: ["datePeriod.preview", "geographicalProvenance.place"],
			},
		],
	},
	prm: {
		Photograph: [
			{
				similar: ["collection", "_nested.persons.primaryName", "_nested.persons.role"],
				different: [],
			},
			{ similar: ["collection", "geographicalProvenance.place"], different: [] },
		],
		Object: [
			{ similar: ["collection", "keywords.keyword"], different: [] },
			{ similar: ["collection", "geographicalProvenance.place"], different: [] },
		],
	},
}

/** Reads a dotted field path the way the legacy webapp does: arrays resolve to
 * their first entry, e.g. "geographicalProvenance.place" →
 * `geographicalProvenance[0].place`. Missing values resolve to undefined. */
function fieldValue(object: CollectionObject, path: string): string | undefined {
	let value: unknown = object

	for (const key of path.split(".")) {
		if (Array.isArray(value)) value = value[0]
		if (value == null || typeof value !== "object") return undefined
		value = (value as Record<string, unknown>)[key]
	}

	return typeof value === "string" && value ? value : undefined
}

/** The queries behind the related-items section, mirroring the legacy site.
 *
 * oum/hsm relevance-rank "Related Items" with a single more-like-this query
 * (the legacy `SingleItemRelated`). ash/prm run one query per similarity rule,
 * filtering on `field="value"` (must match) and `field=!("value")` (must
 * differ); fields the object has no value for are dropped, and `sortBy=random`
 * rotates the section on every page load. */
export function furtherItemsQueries(object: CollectionObject): Array<URL> {
	if (museum.ref === "oum" || museum.ref === "hsm") {
		const url = new URL(
			`https://prd-online.glamdigital.io/v2/search-related/${object.id}/catalogue/${museum.ref}`,
		)
		url.searchParams.set("size", "4")

		return [url]
	}

	const rules = similarityRules[museum.ref]?.[object.collection] ?? []

	return rules.map((rule) => {
		const url = new URL(
			`https://prd-online.glamdigital.io/v2/search-fields/${museum.ref}/catalogue`,
		)

		for (const field of rule.similar) {
			const value = fieldValue(object, field)
			if (value) url.searchParams.set(field, `"${value}"`)
		}

		for (const field of rule.different) {
			const value = fieldValue(object, field)
			if (value) url.searchParams.set(field, `!("${value}")`)
		}

		// never surface records flagged as sensitive
		if (museum.ref === "ash") url.searchParams.set("contentWarning", "!*")
		if (museum.ref === "prm") url.searchParams.set("sensitivities.sensitivities", "!*")

		url.searchParams.set("from", "0")
		url.searchParams.set("size", museum.ref === "ash" ? "1" : "4")
		url.searchParams.set("sortBy", "random")
		url.searchParams.set("sortDirection", "desc")

		return url
	})
}

/** First displayable thumbnail, mirroring the legacy teaser rules: ash/prm
 * serve originals from the assets bucket (ash only for published thumbnail
 * derivatives), oum/hsm use the 1000x1000 S3 derivative. Tiffs are skipped. */
function thumbnail(item: CollectionObject): string | undefined {
	for (const media of item.multimedia ?? []) {
		if (media.mimeType !== "image" || !media.identifier) continue
		if (media.mimeFormat === "tiff" || /\.tiff?$/.test(media.identifier)) continue

		if ("assets" in museum) {
			if (
				museum.ref === "ash" &&
				(media.thumbnail !== "true" || media.isPublished === "No" || !media.resourceSpaceId)
			)
				continue

			return derivative(`${museum.assets}${media.path}${media.identifier}`, "")
		}

		if (media.path)
			return derivative(`${museum.multimedia}${media.path}${media.identifier}`, ".1000x1000")
	}
}

export type FurtherItem = {
	id: CollectionObject["id"]
	href: string
	title: string
	subTitle?: string
	objectNumber?: string
	image?: string
}

export type FurtherItemsSection = {
	title: string
	more?: { label: string; href: string }
	items: Array<FurtherItem>
}

/** The related-items section content, mirroring the legacy headings: narrative
 * pages use "Find out more"; oum/hsm catalogue pages title theirs "Related Items"
 * with a "More related items" link into the legacy related-results page; ash/prm
 * use "Further items to explore". */
export function furtherItemsSection(
	object: CollectionObject,
	items: Array<CollectionObject>,
): FurtherItemsSection | undefined {
	if (!items.length) return undefined

	// Narrative pages list their related items under the legacy "Find out more"
	// heading — cards only, no more-items link.
	if (object.type === "narrative") return { title: "Find out more", items: furtherItems(items) }

	if (museum.ref === "oum" || museum.ref === "hsm")
		return {
			title: "Related Items",
			more: {
				label: "More related items",
				href: `${museum.urls.legacy.collectionsOnline}#/related-to/${object.id}/catalogue`,
			},
			items: furtherItems(items),
		}

	return { title: "Further items to explore", items: furtherItems(items) }
}

/** Teaser props for the related-items cards. */
export function furtherItems(items: Array<CollectionObject>): Array<FurtherItem> {
	return items.map((item) => {
		// mirror generateMetadata's title choice so links point at canonical URLs
		const slugTitle =
			item.recordTitle !== item.objectNumberSorting1 ? item.recordTitle : item.recordSubtitle

		return {
			id: item.id,
			href: `/item/${item.id}/${slugify(slugTitle)}`,
			title: item.recordTitle,
			subTitle: item.recordSubtitle || undefined,
			// mirror the detail page's choice of identifier
			objectNumber: item.objectNumberSorting1 ?? item.objectNumber,
			image: thumbnail(item),
		}
	})
}
