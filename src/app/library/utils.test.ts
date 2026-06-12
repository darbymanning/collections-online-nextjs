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

	test("defaults to simple search when there is no referrer", () => {
		expect(legacyBackLink(null)).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})

	test("returns the referrer when it points at legacy Collections Online", () => {
		const referrer = `${collectionsOnline}#/search/simple-search/object.objectType:tile`

		expect(legacyBackLink(referrer)).toEqual({
			href: referrer,
			label: "Back to search results",
		})
	})

	test("defaults to simple search for referrers outside legacy Collections Online", () => {
		expect(legacyBackLink("https://www.google.com/")).toEqual({
			href: simpleSearch,
			label: "Back to search",
		})
	})
})
