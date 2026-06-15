import { afterEach, describe, expect, mock, spyOn, test } from "bun:test"
import { api } from "./api"
import { museum } from "./config"
import type { CollectionObject } from "./types"

// The suite runs once per museum (scripts/test-unit.ts); museum-specific
// branches only assert in the process started with their museum.
const onlyFor = (...refs: Array<(typeof museum)["ref"]>) =>
	refs.includes(museum.ref) ? describe : describe.skip

const partial = (object: Partial<CollectionObject>) => object as CollectionObject

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

function mockFetch(...responses: Array<Response>) {
	const spy = spyOn(globalThis, "fetch")
	for (const response of responses) spy.mockResolvedValueOnce(response)
	return spy
}

afterEach(() => {
	mock.restore()
})

describe("api.getCollectionObject", () => {
	test("fetches the full item from the GLAM API", async () => {
		const fetchSpy = mockFetch(json({ id: "ash-object-312375" }))

		const object = await api.getCollectionObject("ash-object-312375")

		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			"https://prd-online.glamdigital.io/v2/item/ash-object-312375/full",
		)
		expect(object).toEqual(partial({ id: "ash-object-312375" }))
	})

	test("throws on a non-ok response", async () => {
		mockFetch(json(null, 404))

		expect(api.getCollectionObject("ash-object-0")).rejects.toThrow(
			"Failed to load collection object: 404",
		)
	})
})

onlyFor("ash")("api.getDamsIiif (ash)", () => {
	test("fetches the manifest by irn", async () => {
		const manifest = { id: "https://dams.ashmus.ox.ac.uk/iiif/312375/manifest" }
		const fetchSpy = mockFetch(json(manifest))

		const result = await api.getDamsIiif(partial({ irn: "312375" }))

		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			"https://dams.ashmus.ox.ac.uk/iiif/312375/manifest",
		)
		expect(result).toEqual(manifest as never)
	})

	test("returns null for objects without a manifest", async () => {
		mockFetch(json(null, 404))

		expect(await api.getDamsIiif(partial({ irn: "312375" }))).toBeNull()
	})
})

onlyFor("prm")("api.getDamsIiif (prm)", () => {
	test("fetches the manifest by sortable object number", async () => {
		const fetchSpy = mockFetch(json({}))

		await api.getDamsIiif(partial({ objectNumberSorting1: "1938.15.69" }))

		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			"https://dams.prm.ox.ac.uk/iiif/1938.15.69/manifest",
		)
	})

	test("returns null without fetching when the object number is missing", async () => {
		const fetchSpy = spyOn(globalThis, "fetch")

		expect(await api.getDamsIiif(partial({}))).toBeNull()
		expect(fetchSpy).not.toHaveBeenCalled()
	})
})

onlyFor("oum", "hsm")("api.getDamsIiif (no DAMs)", () => {
	test("returns null without fetching", async () => {
		const fetchSpy = spyOn(globalThis, "fetch")

		expect(await api.getDamsIiif(partial({ irn: 36916 }))).toBeNull()
		expect(fetchSpy).not.toHaveBeenCalled()
	})
})

onlyFor("ash")("api.getFurtherItems (ash)", () => {
	const self = partial({ id: "ash-object-0", collection: "ash collection" })

	test("merges the rule queries, deduplicating and dropping the object itself", async () => {
		mockFetch(
			json({ results: [{ item: { id: "ash-object-1" } }] }),
			json({ results: [{ item: { id: "ash-object-1" } }] }),
			json({ results: [{ item: { id: "ash-object-0" } }, { item: { id: "ash-object-2" } }] }),
			// each surviving record is refetched in full for the teaser cards
			json({ id: "ash-object-1" }),
			json({ id: "ash-object-2" }),
		)

		const items = await api.getFurtherItems(self)

		expect(items.map((item) => item.id)).toEqual(["ash-object-1", "ash-object-2"])
	})

	test("failed queries just yield fewer items", async () => {
		const fetchSpy = spyOn(globalThis, "fetch")
		fetchSpy.mockRejectedValueOnce(new Error("network down"))
		fetchSpy.mockResolvedValueOnce(json({ results: [{ item: { id: "ash-object-1" } }] }))
		fetchSpy.mockResolvedValueOnce(json(null, 500))
		fetchSpy.mockResolvedValueOnce(json({ id: "ash-object-1" }))

		const items = await api.getFurtherItems(self)

		expect(items.map((item) => item.id)).toEqual(["ash-object-1"])
	})
})

onlyFor("hsm")("api.getFurtherItems (hsm)", () => {
	test("fetches more-like-this results in one query", async () => {
		const item = { id: "hsm-catalogue-1", multimedia: [{ identifier: "a.jpg" }] }
		const fetchSpy = mockFetch(json({ results: [{ item }] }), json(item))

		const items = await api.getFurtherItems(partial({ id: "hsm-catalogue-0" }))

		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			"https://prd-online.glamdigital.io/v2/search-related/hsm-catalogue-0/catalogue/hsm?size=4",
		)
		expect(items.map((i) => i.id)).toEqual(["hsm-catalogue-1"])
	})
})

onlyFor("oum")("api.getFurtherItems (oum)", () => {
	test("refetches full records for the teaser cards", async () => {
		const slim = { id: "oum-catalogue-1", multimedia: [{ identifier: "slim.jpg" }] }
		const full = {
			id: "oum-catalogue-1",
			objectNumber: "MIN.1",
			multimedia: [{ identifier: "a.jpg" }],
		}
		const fetchSpy = mockFetch(json({ results: [{ item: slim }] }), json(full))

		const items = await api.getFurtherItems(partial({ id: "oum-catalogue-0" }))

		expect(String(fetchSpy.mock.calls[1]?.[0])).toBe(
			"https://prd-online.glamdigital.io/v2/item/oum-catalogue-1/full",
		)
		expect(items).toEqual([full] as never)
	})

	test("keeps the slim record when the full fetch fails", async () => {
		const slim = { id: "oum-catalogue-1", multimedia: [] }
		mockFetch(json({ results: [{ item: slim }] }), json(null, 500))

		expect(await api.getFurtherItems(partial({ id: "oum-catalogue-0" }))).toEqual([slim] as never)
	})
})

onlyFor("oum")("api.getFurtherItems (narrative)", () => {
	const full = (id: string) => ({ id, multimedia: [{ identifier: `${id}.jpg` }] })

	test("refetches the curated relatedObjects, deduplicating and dropping the page itself", async () => {
		const fetchSpy = mockFetch(json(full("oum-catalogue-1")), json(full("oum-catalogue-2")))

		const items = await api.getFurtherItems(
			partial({
				id: "oum-narrative-0",
				type: "narrative",
				relatedObjects: [
					{ id: "oum-catalogue-1" },
					{ id: "oum-catalogue-1" },
					{ id: "oum-narrative-0" },
					{ id: "oum-catalogue-2" },
				],
			}),
		)

		expect(items.map((item) => item.id)).toEqual(["oum-catalogue-1", "oum-catalogue-2"])
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			"https://prd-online.glamdigital.io/v2/item/oum-catalogue-1/full",
		)
	})

	test("keeps the partial record when the full fetch fails", async () => {
		mockFetch(json(null, 500))

		const items = await api.getFurtherItems(
			partial({
				id: "oum-narrative-0",
				type: "narrative",
				relatedObjects: [{ id: "oum-catalogue-1" }],
			}),
		)

		expect(items).toEqual([{ id: "oum-catalogue-1" }] as never)
	})
})
