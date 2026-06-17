import { describe, expect, test } from "bun:test"
import { museum } from "./config"
import { collectionsOnlineHref, list } from "./utils"

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

describe("collectionsOnlineHref", () => {
	const collectionsOnline = String(museum.urls.legacy.collectionsOnline)

	test("defaults to the Collections Online landing when there is no return URL", () => {
		expect(collectionsOnlineHref(null)).toBe(collectionsOnline)
	})

	test("uses a validated legacy search results URL", () => {
		const returnUrl = `${collectionsOnline}#/search/simple-search/object.objectType:tile`

		expect(collectionsOnlineHref(returnUrl)).toBe(returnUrl)
	})

	test("falls back to the landing for return URLs outside legacy Collections Online", () => {
		expect(collectionsOnlineHref("https://www.google.com/")).toBe(collectionsOnline)
	})

	test("falls back to the landing for other pages on the museum site", () => {
		expect(collectionsOnlineHref(`${museum.urls.parent}/visit`)).toBe(collectionsOnline)
	})

	test("rejects non-https return URLs", () => {
		expect(collectionsOnlineHref("http://www.example.com/collections-online")).toBe(
			collectionsOnline,
		)
	})
})
