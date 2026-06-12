import { museum } from "./config"
import type { CollectionObject, IIIFManifest } from "./types"

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
				id = object.irn
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
}
