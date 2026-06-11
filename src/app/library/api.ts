import type { CollectionObject, IIIFManifest } from "./types"

export const api = {
	async getCollectionObject(irn: CollectionObject["irn"]): Promise<CollectionObject> {
		const url = new URL(`https://prd-online.glamdigital.io/v2/item/${irn}/full`)

		const response = await fetch(url)

		if (!response.ok) throw new Error(`Failed to load collection object: ${response.status}`)

		return response.json()
	},
	async getDamsIiif(irn: CollectionObject["irn"]): Promise<IIIFManifest> {
		const id = irn.split("-object-").pop()
		const url = new URL(`https://dams.ashmus.ox.ac.uk/iiif/${id}/manifest`)

		const response = await fetch(url)

		if (!response.ok) throw new Error(`Failed to load Dams IIIF manifest: ${response.status}`)

		return response.json()
	},
}
