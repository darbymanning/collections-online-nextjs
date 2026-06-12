import { museum } from "./config"
import { furtherItemsQueries } from "./further-items"
import type { CollectionObject, IIIFManifest, SearchResults } from "./types"

export const api = {
	async getCollectionObject(id: CollectionObject["id"]): Promise<CollectionObject> {
		const url = new URL(`https://prd-online.glamdigital.io/v2/item/${id}/full`)

		const response = await fetch(url)

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
	/** Records for the related-items section: random similarity matches for
	 * ash/prm, relevance-ranked more-like-this results for oum/hsm. Queries can
	 * return overlapping records — or the object itself — so results are
	 * deduplicated. */
	async getFurtherItems(object: CollectionObject): Promise<Array<CollectionObject>> {
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

		if (museum.ref !== "oum") return related

		// search-related strips oum multimedia — refetch those records so teasers get images
		return Promise.all(
			related.map(async (item) => {
				if (item.multimedia?.length) return item

				try {
					return await api.getCollectionObject(item.id)
				} catch {
					return item
				}
			}),
		)
	},
}
