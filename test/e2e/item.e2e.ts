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

// The "Collections Online" breadcrumb doubles as the back link — it points at the
// stable landing page by default and at the visitor's search results when they
// arrive with a `?return=` deep link.
function collectionsOnlineCrumb(page: import("@playwright/test").Page) {
	return page
		.getByRole("navigation", { name: "Breadcrumb" })
		.getByRole("link", { name: "Collections Online" })
}

test("links the Collections Online breadcrumb to the landing without a return URL", async ({
	page,
}) => {
	const museum = currentMuseum()

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	const crumb = collectionsOnlineCrumb(page)
	// the Suspense fallback and the resolved client crumb briefly coexist in the
	// streamed HTML — wait for hydration to settle on the single link first
	await expect(crumb).toHaveCount(1)
	await expect(crumb).toHaveAttribute("href", museum.collectionsOnlineHref)
})

test("points the Collections Online breadcrumb at the search results when a return URL is provided", async ({
	page,
}) => {
	const museum = currentMuseum()
	const returnParam = encodeURIComponent(museum.legacySearchReturn)

	await page.goto(`/item/${museum.id}/${museum.slug}?return=${returnParam}`)

	const crumb = collectionsOnlineCrumb(page)
	await expect(crumb).toHaveCount(1)
	await expect(crumb).toHaveAttribute("href", museum.legacySearchReturn)
})

test("ignores untrusted return URLs for the Collections Online breadcrumb", async ({ page }) => {
	const museum = currentMuseum()
	const returnParam = encodeURIComponent("https://www.google.com/")

	await page.goto(`/item/${museum.id}/${museum.slug}?return=${returnParam}`)

	const crumb = collectionsOnlineCrumb(page)
	await expect(crumb).toHaveCount(1)
	await expect(crumb).toHaveAttribute("href", museum.collectionsOnlineHref)
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
	// only Pitt Rivers keeps the collapsed-trail toggle — see the full-trail test below
	test.skip(test.info().project.name !== "prm", "museum shows the full trail outright")

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

test("shows hierarchy trails in full", async ({ page }) => {
	const museum = currentMuseum()
	test.skip(!museum.expectHierarchy, "no hierarchy trails for this item")
	test.skip(test.info().project.name === "prm", "Pitt Rivers collapses trails behind a toggle")

	await page.goto(`/item/${museum.id}/${museum.slug}`)

	// at least one trail renders every level as a link, with no expand toggle
	const trails = page.getByTestId("list")
	const counts = await trails.evaluateAll((els) =>
		els.map((el) => el.querySelectorAll("a").length),
	)
	expect(Math.max(...counts)).toBeGreaterThan(1)
	await expect(trails.locator("button[aria-expanded]")).toHaveCount(0)
})
