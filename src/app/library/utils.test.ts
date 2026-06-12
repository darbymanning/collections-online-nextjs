import { describe, expect, test } from "bun:test"
import { list } from "./utils"

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
