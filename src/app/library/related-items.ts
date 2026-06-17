import { museum } from "./config"
import { furtherItems, type FurtherItemsSection } from "./further-items"
import type { CollectionObject } from "./types"

/** The query behind the curated "Related" section (prm only). PRM links
 * are bidirectional and authored on either end, so a record carries its related
 * irns in `objectLinks`, `objectLinks2`, or both; combine and dedupe them, then
 * resolve every irn in one search — mirroring the legacy `catalogue?q=irn:(…)`.
 * Other museums have no equivalent field, so they get no section. */
export function relatedItemsQuery(object: CollectionObject): URL | undefined {
	if (museum.ref !== "prm") return undefined

	const irns = [...(object.objectLinks ?? []), ...(object.objectLinks2 ?? [])]
		.map((link) => link.irn)
		.filter((irn): irn is string => Boolean(irn))

	const unique = [...new Set(irns)]
	if (!unique.length) return undefined

	const url = new URL(`https://prd-online.glamdigital.io/v2/search/${museum.ref}/catalogue`)
	url.searchParams.set("q", `irn:(${unique.join(" OR ")})`)
	url.searchParams.set("size", String(unique.length))

	return url
}

/** The curated related-records section — objects the museum has explicitly
 * linked, distinct from the algorithmic "Further items to explore". Reuses the
 * same teaser props as that section; the layout renders it as a static grid. */
export function relatedItemsSection(
	items: Array<CollectionObject>,
): FurtherItemsSection | undefined {
	if (!items.length) return undefined

	return { title: "Related", items: furtherItems(items) }
}
