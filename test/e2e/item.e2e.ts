import { expect, test } from "@playwright/test"
import { museums, type MuseumExpectations } from "./museums"

function currentMuseum(): MuseumExpectations {
	return museums[test.info().project.name as keyof typeof museums]
}

// any uncaught error in the page (e.g. OpenSeadragon blowing up) fails the test
let pageErrors: Array<Error> = []

test.beforeEach(({ page }) => {
	pageErrors = []
	page.on("pageerror", (error) => pageErrors.push(error))
})

test.afterEach(() => {
	expect(pageErrors).toEqual([])
})

test("renders the record with canonical metadata", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	await expect(page.getByRole("heading", { level: 1 })).toHaveText(museum.h1)
	await expect(page).toHaveTitle(museum.pageTitle)
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		`${museum.origin}/item/${museum.id}/${museum.slug}`,
	)
})

test("shows the museum's detail fields", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	for (const label of museum.detailLabels) {
		await expect(page.locator(`dt:text-is("${label}")`)).toBeVisible()
	}

	if (museum.onDisplay) await expect(page.locator(".on-display")).toHaveText("On display")
})

test("initialises the zoomable image viewer", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(!museum.imageCount, "no digitised images for this item")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	// OpenSeadragon mounts canvases (viewer + navigator) once it initialises
	const canvas = page.locator(".frame canvas").first()
	await expect(canvas).toBeVisible({ timeout: 30_000 })

	await page.getByRole("button", { name: "Zoom in" }).click()
	await page.getByRole("button", { name: "Reset view" }).click()
	await expect(canvas).toBeVisible()
})

test("pages through images with the thumbnails", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(museum.imageCount < 2, "single image — no thumbnail strip")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const thumbnails = page.locator(".thumbnails button")
	await expect(thumbnails).toHaveCount(museum.imageCount)
	await expect(thumbnails.first()).toHaveAttribute("aria-current", "true")

	await thumbnails.nth(1).click()

	await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true")
	await expect(thumbnails.first()).toHaveAttribute("aria-current", "false")
})

test("expands and collapses hierarchy trails", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(!museum.expectHierarchy, "no hierarchy trails for this item")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	// scope to one trail so the toggle and its expanded view stay paired
	const row = page.locator(".row", { has: page.locator("button[aria-expanded]") }).first()
	const toggle = row.locator("button[aria-expanded]")
	const opened = row.locator(".opened")

	await expect(toggle).toHaveAttribute("aria-expanded", "false")
	await expect(opened).toHaveAttribute("inert", "")

	await toggle.click()

	await expect(toggle).toHaveAttribute("aria-expanded", "true")
	await expect(toggle).toHaveAccessibleName("Collapse hierarchy")
	await expect(opened).not.toHaveAttribute("inert", "")
	expect(await opened.locator("a").count()).toBeGreaterThan(1)

	await toggle.click()

	await expect(toggle).toHaveAttribute("aria-expanded", "false")
})
