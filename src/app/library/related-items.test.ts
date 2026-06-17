import { describe, expect, test } from "bun:test"
import ashObjectFixture from "$fixtures/ash-object-312375.json"
import hsmObjectFixture from "$fixtures/hsm-catalogue-29715.json"
import oumObjectFixture from "$fixtures/oum-catalogue-36916.json"
import prmObjectFixture from "$fixtures/prm-object-79439.json"
import { museum } from "./config"
import { furtherItems } from "./further-items"
import { relatedItemsQuery, relatedItemsSection } from "./related-items"
import type { CollectionObject } from "./types"

const fixtures = {
	ash: ashObjectFixture as unknown as CollectionObject,
	oum: oumObjectFixture as unknown as CollectionObject,
	prm: prmObjectFixture as unknown as CollectionObject,
	hsm: hsmObjectFixture as unknown as CollectionObject,
} as const

// The suite runs once per museum (scripts/test-unit.ts); each process asserts
// the query and section for the museum it was started with.
const object = fixtures[museum.ref]

const onlyFor = (...refs: Array<(typeof museum)["ref"]>) =>
	refs.includes(museum.ref) ? describe : describe.skip

const partial = (object: Partial<CollectionObject>) => object as CollectionObject

onlyFor("prm")("relatedItemsQuery (prm)", () => {
	test("combines objectLinks + objectLinks2 into one deduped irn search", () => {
		const url = relatedItemsQuery(
			partial({
				...object,
				objectLinks: [{ irn: "451094" }],
				objectLinks2: [{ irn: "575642" }, { irn: "451094" }],
			}),
		)!

		expect(url.origin + url.pathname).toBe(
			"https://prd-online.glamdigital.io/v2/search/prm/catalogue",
		)
		expect(url.searchParams.get("q")).toBe("irn:(451094 OR 575642)")
		expect(url.searchParams.get("size")).toBe("2")
	})

	test("reads links authored on either end of the relationship", () => {
		const fromLinks2 = relatedItemsQuery(
			partial({ ...object, objectLinks: [], objectLinks2: [{ irn: "281341" }] }),
		)!

		expect(fromLinks2.searchParams.get("q")).toBe("irn:(281341)")
	})

	test("returns undefined when the record has no links", () => {
		expect(
			relatedItemsQuery(partial({ ...object, objectLinks: [], objectLinks2: [] })),
		).toBeUndefined()
	})
})

onlyFor(
	"ash",
	"oum",
	"hsm",
)("relatedItemsQuery (museums without curated links)", () => {
	test("has no curated related section even when links are present", () => {
		expect(relatedItemsQuery(partial({ objectLinks: [{ irn: "1" }] }))).toBeUndefined()
	})
})

describe("relatedItemsSection (all museums)", () => {
	test("titles the curated section 'Related' with cards only", () => {
		expect(relatedItemsSection([object])).toEqual({
			title: "Related",
			items: furtherItems([object]),
		})
	})

	test("returns undefined without items", () => {
		expect(relatedItemsSection([])).toBeUndefined()
	})
})
