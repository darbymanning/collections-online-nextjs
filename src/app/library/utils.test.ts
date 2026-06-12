import { describe, expect, test } from "bun:test"
import { museum } from "./config"
import { legacyBackLink, list } from "./utils"

describe("list.readable", () => {
	test("returns an empty string for an empty list", () => {
		expect(list.readable([])).toBe("")
	})

	test("returns a single item unchanged", () => {
		expect(list.readable(["wood"])).toBe("wood")
	})

	test("joins two items with 'and'", () => {
		expect(list.readable(["wood", "glass"])).toBe("wood and glass")
	})

	test("joins three or more items en-GB style, without an Oxford comma", () => {
		expect(list.readable(["wood", "glass", "metal"])).toBe("wood, glass and metal")
	})
})

describe("legacyBackLink", () => {
	const simpleSearch = String(museum.urls.legacy.simpleSearch)
	const collectionsOnline = String(museum.urls.legacy.collectionsOnline)

	test("defaults to simple search when there is no return URL", () => {
		expect(legacyBackLink(null)).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})

	test("uses a validated legacy search results URL", () => {
		const returnUrl = `${collectionsOnline}#/search/simple-search/object.objectType:tile`

		expect(legacyBackLink(returnUrl)).toEqual({
			href: returnUrl,
			label: "Back to search results",
		})
	})

	test("defaults to simple search for return URLs outside legacy Collections Online", () => {
		expect(legacyBackLink("https://www.google.com/")).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})

	test("defaults to simple search for other pages on the museum site", () => {
		expect(legacyBackLink(`${museum.urls.parent}/visit`)).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})

	test("rejects non-https return URLs", () => {
		expect(legacyBackLink("http://www.example.com/collections-online")).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})
})
