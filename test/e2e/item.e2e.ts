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

test("shows the default back link without a return URL", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const backLink = page.getByTestId("back-link")
	await expect(backLink).toHaveText("Back to search")
	await expect(backLink).toHaveAttribute("href", museum.simpleSearchHref)
})

test("shows the legacy search results back link when a return URL is provided", async ({
	page,
}) => {
	const museum = currentMuseum()
	const returnParam = encodeURIComponent(museum.legacySearchReturn)

	await page.goto(`/item/${museum.id}/${museum.slug}?return=${returnParam}`)

	const backLink = page.getByTestId("back-link")
	await expect(backLink).toHaveText("Back to search results")
	await expect(backLink).toHaveAttribute("href", museum.legacySearchReturn)
})

test("shows the default back link for untrusted return URLs", async ({ page }) => {
	const museum = currentMuseum()
	const returnParam = encodeURIComponent("https://www.google.com/")

	await page.goto(`/item/${museum.id}/${museum.slug}?return=${returnParam}`)

	const backLink = page.getByTestId("back-link")
	await expect(backLink).toHaveText("Back to search")
	await expect(backLink).toHaveAttribute("href", museum.simpleSearchHref)
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

	if (museum.onDisplay) await expect(page.getByText("On display")).toHaveText("On display")
})

test("initialises the zoomable image viewer", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(!museum.imageCount, "no digitised images for this item")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	// OpenSeadragon mounts canvases (viewer + navigator) once it initialises
	const canvas = page
		.getByLabel(/^Zoomable image of/)
		.locator("canvas")
		.first()
	await expect(canvas).toBeVisible({ timeout: 30_000 })

	await page.getByRole("button", { name: "Zoom in" }).click()
	await page.getByRole("button", { name: "Reset view" }).click()
	await expect(canvas).toBeVisible()
})

test("pages through images with the thumbnails", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(museum.imageCount < 2, "single image — no thumbnail strip")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const thumbnails = page.getByRole("button", { name: /^View image \d+ of \d+$/ })
	await expect(thumbnails).toHaveCount(museum.imageCount)
	await expect(thumbnails.first()).toHaveAttribute("aria-current", "true")

	await thumbnails.nth(1).click()

	await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true")
	await expect(thumbnails.first()).toHaveAttribute("aria-current", "false")
})

test("suggests related items to explore", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	await expect(page.getByRole("heading", { name: museum.furtherItemsHeading })).toBeVisible()

	// the queries decide how many cards appear, but the known items always match something
	expect(
		await page.getByTestId("further-items").locator('a[href^="/item/"]').count(),
	).toBeGreaterThan(0)

	if (museum.furtherItemsMore) {
		const more = page.getByRole("link", { name: "More related items" })
		await expect(more).toHaveAttribute("href", /#\/related-to\/.+\/catalogue$/)
	}
})

test("expands and collapses hierarchy trails", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(!museum.expectHierarchy, "no hierarchy trails for this item")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	// scope to one trail so the toggle and its expanded view stay paired
	const trail = page
		.getByTestId("list")
		.filter({ has: page.locator("button[aria-expanded]") })
		.first()
	const toggle = trail.locator("button[aria-expanded]")
	const opened = trail.getByTestId("list-expanded")

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
