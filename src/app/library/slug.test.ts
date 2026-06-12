import { describe, expect, test } from "bun:test"
import { slugify } from "./slug"

describe("slugify", () => {
	test("lowercases and hyphenates words", () => {
		expect(slugify("Tin-glazed tile in Italian style")).toBe("tin-glazed-tile-in-italian-style")
	})

	test("strips diacritics via NFKD normalisation", () => {
		expect(slugify("Café déjà vu")).toBe("cafe-deja-vu")
	})

	test("collapses runs of punctuation into single hyphens", () => {
		expect(slugify("Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs")).toBe(
			"two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs",
		)
	})

	test("trims leading and trailing separators", () => {
		expect(slugify("...A predatory fish.")).toBe("a-predatory-fish")
	})

	// e2e expectations in test/e2e/museums.ts rely on these exact values
	test("matches the slugs used in item page URLs", () => {
		expect(slugify("Headdress mask representing Abam, a predatory fish.")).toBe(
			"headdress-mask-representing-abam-a-predatory-fish",
		)
		expect(slugify("Topaz (single colourless crystal)")).toBe("topaz-single-colourless-crystal")
	})

	test("returns an empty string when nothing survives", () => {
		expect(slugify("...")).toBe("")
	})
})
