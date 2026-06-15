import { expect, test } from "@playwright/test"
import { museums, type MuseumExpectations } from "./museums"

function currentMuseum(): MuseumExpectations {
	return museums[test.info().project.name as keyof typeof museums]
}

test("applies the museum's indexing policy to item pages", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const content = await page.locator('head > meta[name="robots"]').getAttribute("content")

	if (museum.indexable) {
		expect(content).toContain("index")
		expect(content).not.toContain("noindex")
	} else {
		// Pitt Rivers: kept out of search even though the page still resolves
		expect(content).toContain("noindex")
	}
})

test("emits schema.org structured data for the object", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const raw = await page.locator('script[type="application/ld+json"]').first().textContent()

	const data = JSON.parse(raw ?? "{}")
	expect(data["@context"]).toBe("https://schema.org")

	const graph: Array<Record<string, unknown>> = data["@graph"]

	// the object node, named after the record (the page's <h1>)
	const work = graph.find((node) => node.name === museum.h1)
	expect(work).toBeDefined()
	expect(["VisualArtwork", "CreativeWork"]).toContain(work?.["@type"])

	// a breadcrumb trail ending on this item
	const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList")
	expect(breadcrumb).toBeDefined()
})

test("serves a per-museum robots.txt", async ({ page }) => {
	const museum = currentMuseum()

	const response = await page.goto("/robots.txt")
	expect(response?.ok()).toBe(true)

	const body = await response!.text()

	// content scrapers are always turned away
	expect(body).toContain("AhrefsBot")
	expect(body).toContain("User-Agent: *")

	if (museum.indexable) {
		// AI answer engines are explicitly welcomed (AGO)
		expect(body).toContain("OAI-SearchBot")
	} else {
		// opted-out museums don't advertise an AI allowlist
		expect(body).not.toContain("OAI-SearchBot")
	}
})
