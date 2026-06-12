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
