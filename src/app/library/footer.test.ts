import { describe, expect, test } from "bun:test"
import { museum } from "./config"

// kept in sync with the SocialPlatform / FooterPartner unions in config.ts — the
// scrape can only ever emit these, so anything else is a regression.
const socialPlatforms = ["facebook", "instagram", "x", "youtube", "bluesky"]
const partnerKeys = ["research-england", "athena-swan", "arts-council-england", "heritage-fund"]

describe(`footer data (${museum.ref})`, () => {
	const { footer } = museum

	test("social links are known platforms with absolute URLs, no duplicates", () => {
		const platforms = footer.social.map((s) => s.platform)
		expect(new Set(platforms).size).toBe(platforms.length)
		for (const { platform, href } of footer.social) {
			expect(socialPlatforms).toContain(platform)
			expect(href).toMatch(/^https?:\/\//)
		}
	})

	test("partners are known keys with no duplicates, and always include the shared ones", () => {
		expect(new Set(footer.partners).size).toBe(footer.partners.length)
		for (const partner of footer.partners) expect(partnerKeys).toContain(partner)
		// every GLAM site is funded by Research England + Arts Council England
		expect(footer.partners).toContain("research-england")
		expect(footer.partners).toContain("arts-council-england")
	})

	test("legal links each have a label and href, including a privacy policy", () => {
		expect(footer.legal.length).toBeGreaterThan(0)
		for (const { label, href } of footer.legal) {
			expect(label).toBeTruthy()
			expect(href).toBeTruthy()
		}
		expect(footer.legal.some((link) => /privacy/i.test(link.label))).toBe(true)
	})

	test("offers a newsletter sign-up", () => {
		expect(footer.newsletter).toBeTruthy()
	})
})
