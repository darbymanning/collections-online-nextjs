import { CollectionObject } from "./types"

const base = "https://prd-online.glamdigital.io"

export const api = {
	async getCollectionObject(id: string): Promise<CollectionObject> {
		const url = new URL(base)
		url.pathname = `/v2/item/${id}/full`

		const response = await fetch(url)

		if (!response.ok) throw new Error(`Failed to load collection object: ${response.status}`)

		return response.json()
	},
}
