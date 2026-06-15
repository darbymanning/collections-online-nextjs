import { describe, expect, test } from "bun:test"
import ashObjectFixture from "$fixtures/ash-object-312375.json"
import hsmObjectFixture from "$fixtures/hsm-catalogue-29715.json"
import oumObjectFixture from "$fixtures/oum-catalogue-36916.json"
import prmObjectFixture from "$fixtures/prm-object-79439.json"
import { museum } from "./config"
import { furtherItems, furtherItemsQueries, furtherItemsSection } from "./further-items"
import type { CollectionObject } from "./types"

const fixtures = {
	ash: ashObjectFixture as unknown as CollectionObject,
	oum: oumObjectFixture as unknown as CollectionObject,
	prm: prmObjectFixture as unknown as CollectionObject,
	hsm: hsmObjectFixture as unknown as CollectionObject,
} as const

// The suite runs once per museum (scripts/test-unit.ts); each process asserts
// the queries and teasers for the museum it was started with.
const object = fixtures[museum.ref]

const onlyFor = (...refs: Array<(typeof museum)["ref"]>) =>
	refs.includes(museum.ref) ? describe : describe.skip

const partial = (object: Partial<CollectionObject>) => object as CollectionObject

const params = (url: URL) => Object.fromEntries(url.searchParams)

onlyFor("ash")("furtherItemsQueries (ash)", () => {
	const queries = furtherItemsQueries(object)
	const place =
		"Europe > United Kingdom > England > Oxfordshire > Cherwell District > Bicester parish > " +
		"Bicester town > Sheep Street > St John the Baptist's Chapel"

	test("builds one random single-result query per similarity rule", () => {
		expect(queries).toHaveLength(3)

		for (const url of queries) {
			expect(url.origin + url.pathname).toBe(
				"https://prd-online.glamdigital.io/v2/search-fields/ash/catalogue",
			)
			expect(params(url)).toMatchObject({
				contentWarning: "!*",
				from: "0",
				size: "1",
				sortBy: "random",
				sortDirection: "desc",
			})
		}
	})

	test("drops the datePeriod.preview term the record has no value for", () => {
		expect(params(queries[0]!)).toEqual({
			"geographicalProvenance.place": `!("${place}")`,
			webCategory: '!("ceramics")',
			contentWarning: "!*",
			from: "0",
			size: "1",
			sortBy: "random",
			sortDirection: "desc",
		})
	})

	test("matches the place while excluding the web category, and vice versa", () => {
		expect(params(queries[1]!)).toMatchObject({
			"geographicalProvenance.place": `"${place}"`,
			webCategory: '!("ceramics")',
		})
		expect(params(queries[2]!)).toMatchObject({
			webCategory: '"ceramics"',
			"geographicalProvenance.place": `!("${place}")`,
		})
	})
})

onlyFor("prm")("furtherItemsQueries (prm)", () => {
	const queries = furtherItemsQueries(object)

	test("builds the Object-collection queries with the sensitivities filter", () => {
		expect(queries).toHaveLength(2)

		expect(params(queries[0]!)).toEqual({
			collection: '"Object"',
			"keywords.keyword": '"Headdress"',
			"sensitivities.sensitivities": "!*",
			from: "0",
			size: "4",
			sortBy: "random",
			sortDirection: "desc",
		})
		expect(params(queries[1]!)).toMatchObject({
			collection: '"Object"',
			"geographicalProvenance.place": '"Africa > Western Africa > Nigeria"',
		})
	})
})

onlyFor("oum", "hsm")("furtherItemsQueries (oum/hsm)", () => {
	test("builds a single more-like-this query", () => {
		const queries = furtherItemsQueries(object)

		expect(queries).toHaveLength(1)
		expect(String(queries[0])).toBe(
			`https://prd-online.glamdigital.io/v2/search-related/${object.id}/catalogue/${museum.ref}?size=4`,
		)
	})
})

onlyFor("ash", "prm")("furtherItemsSection (ash/prm)", () => {
	test("titles the section with cards only", () => {
		expect(furtherItemsSection(object, [object])).toEqual({
			title: "Further items to explore",
			items: furtherItems([object]),
		})
	})
})

onlyFor("oum", "hsm")("furtherItemsSection (oum/hsm)", () => {
	test("uses the legacy related-items heading and more link", () => {
		const section = furtherItemsSection(object, [object])

		expect(section?.title).toBe("Related Items")
		expect(section?.more).toEqual({
			label: "More related items",
			href: `${museum.urls.legacy.collectionsOnline}#/related-to/${object.id}/catalogue`,
		})
	})
})

describe("furtherItemsSection (all museums)", () => {
	test("returns undefined without items", () => {
		expect(furtherItemsSection(object, [])).toBeUndefined()
	})

	test("titles narrative pages 'Find out more' with cards only", () => {
		const narrative = partial({ ...object, type: "narrative" })

		expect(furtherItemsSection(narrative, [object])).toEqual({
			title: "Find out more",
			items: furtherItems([object]),
		})
	})
})

onlyFor("ash")("furtherItems (ash)", () => {
	test("links the canonical slugged URL with the assets-bucket thumbnail", () => {
		expect(furtherItems([object])).toEqual([
			{
				id: "ash-object-312375",
				href: "/item/ash-object-312375/tin-glazed-tile-in-italian-style",
				title: "Tin-glazed tile in Italian style",
				subTitle: "Medieval period (Britain) (CE 1066 - 1500)\nAN1921.320",
				objectNumber: "AN1921.320",
				image: "https://ash-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/assets/ASH_RS12973_AN1921.00320.jpg",
			},
		])
	})

	test("omits the image for assets without a published thumbnail derivative", () => {
		const item = partial({
			...object,
			multimedia: object.multimedia.map((media) => ({ ...media, thumbnail: "false" })),
		})

		expect(furtherItems([item])[0]?.image).toBeUndefined()
	})
})

onlyFor("prm")("furtherItems (prm)", () => {
	test("slugs from the subtitle when the record title is the accession number", () => {
		const [teaser] = furtherItems([object])

		expect(teaser).toMatchObject({
			href: "/item/prm-object-79439/headdress-mask-representing-abam-a-predatory-fish",
			title: "1938.15.69",
			image: "https://prm-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/assets/PRM_RS265206_1938.0015.69.jpg",
		})
	})
})

onlyFor("oum")("furtherItems (oum)", () => {
	test("builds the 1000x1000 derivative from the multimedia path", () => {
		expect(furtherItems([object])[0]?.image).toBe(
			"https://mhn-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/data/oumnh/multimedia/10/077/MIN.28380_001.1000x1000.jpg",
		)
	})
})
