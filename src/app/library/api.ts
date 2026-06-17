import { museum } from "./config"
import { furtherItemsQueries } from "./further-items"
import { relatedItemsQuery } from "./related-items"
import type { CollectionObject, IIIFManifest, SearchResults } from "./types"

/** The upstream has no record for this id (HTTP 404), as opposed to a transient
 * failure. Lets pages render a proper Not Found for genuine misses while real
 * errors still propagate. */
export class RecordNotFoundError extends Error {
	constructor(id: CollectionObject["id"]) {
		super(`Collection object not found: ${id}`)
		this.name = "RecordNotFoundError"
	}
}

export const api = {
	async getCollectionObject(id: CollectionObject["id"]): Promise<CollectionObject> {
		const url = new URL(`https://prd-online.glamdigital.io/v2/item/${id}/full`)

		const response = await fetch(url)

		// a missing record is distinct from a transient error: the former should
		// render a 404 (and let ISR cache it), the latter should keep the last good
		// page and retry rather than caching a not-found
		if (response.status === 404) throw new RecordNotFoundError(id)
		if (!response.ok) throw new Error(`Failed to load collection object: ${response.status}`)

		return response.json()
	},
	async getDamsIiif(object: CollectionObject): Promise<IIIFManifest | null> {
		// If the museum does not have a DAMs URL, return null
		if (!("dams" in museum)) return null

		let id: string | undefined

		switch (museum.ref) {
			case "ash":
				id = String(object.irn)
				break

			case "prm":
				id = object.objectNumberSorting1
				break
		}

		if (!id) return null

		const url = new URL(`${museum.dams}${id}/manifest`)

		const response = await fetch(url)

		// Objects without digitised assets have no manifest
		if (!response.ok) return null

		return response.json()
	},
	/** Records for the related-items section: a curated list for narrative pages,
	 * random similarity matches for ash/prm, relevance-ranked more-like-this
	 * results for oum/hsm. Queries can return overlapping records — or the object
	 * itself — so results are deduplicated. */
	async getFurtherItems(object: CollectionObject): Promise<Array<CollectionObject>> {
		// Narrative records carry their related items directly (the legacy "Find
		// out more" section), so skip the similarity queries. The entries are
		// partial — no titles — so refetch each full record for the teaser cards.
		if (object.type === "narrative") {
			const related = (object.relatedObjects ?? []).filter(
				(item, index, items) =>
					item.id !== object.id && items.findIndex((other) => other.id === item.id) === index,
			)

			return Promise.all(
				related.map(async (item) => {
					try {
						return await api.getCollectionObject(item.id)
					} catch {
						// keep the partial record so a failed fetch just yields a sparser card
						return item as CollectionObject
					}
				}),
			)
		}

		const responses = await Promise.all(
			furtherItemsQueries(object).map(async (url) => {
				try {
					const response = await fetch(url)

					if (!response.ok) return []

					const search: SearchResults = await response.json()

					return search.results.map((result) => result.item)
				} catch {
					// the section is decorative — a failed query just means fewer cards
					return []
				}
			}),
		)

		const related = responses
			.flat()
			.filter(
				(item, index, items) =>
					item.id !== object.id && items.findIndex((other) => other.id === item.id) === index,
			)

		// search results carry trimmed records (no object number, and oum drops
		// multimedia), so refetch each full record for the teaser cards; a failed
		// fetch just falls back to the sparser search record.
		return Promise.all(
			related.map(async (item) => {
				try {
					return await api.getCollectionObject(item.id)
				} catch {
					return item
				}
			}),
		)
	},
	/** Records for the curated "Related" section (prm only): the catalogue
	 * objects the museum has explicitly linked via `objectLinks`/`objectLinks2`.
	 * One irn search resolves them all, then each full record is refetched for the
	 * teaser cards (search results omit the object number). */
	async getRelatedItems(object: CollectionObject): Promise<Array<CollectionObject>> {
		const url = relatedItemsQuery(object)
		if (!url) return []

		try {
			const response = await fetch(url)

			if (!response.ok) return []

			const search: SearchResults = await response.json()

			// drop the object itself and any duplicate (links can point both ways)
			const related = search.results
				.map((result) => result.item)
				.filter(
					(item, index, items) =>
						item.id !== object.id &&
						items.findIndex((other) => other.id === item.id) === index,
				)

			return Promise.all(
				related.map(async (item) => {
					try {
						return await api.getCollectionObject(item.id)
					} catch {
						return item
					}
				}),
			)
		} catch {
			// the section is decorative — a failed query just means no related records
			return []
		}
	},
}
