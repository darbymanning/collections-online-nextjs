import { expect, test } from "@playwright/test"
import { museums, type MuseumExpectations } from "./museums"

function currentMuseum(): MuseumExpectations {
	return museums[test.info().project.name as keyof typeof museums]
}

test("links to the new item page and the legacy site", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto("/")

	await expect(page.getByRole("link", { name: "New" })).toHaveAttribute(
		"href",
		`/item/${museum.id}/${museum.slug}`,
	)
	await expect(page.getByRole("link", { name: "Existing" })).toHaveAttribute(
		"href",
		museum.legacyHref,
	)
})

test("navigates to the item page", async ({ page }) => {
	const museum = currentMuseum()

	await page.goto("/")
	await page.getByRole("link", { name: "New" }).click()

	await expect(page).toHaveURL(`/item/${museum.id}/${museum.slug}`)
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(museum.h1)
})
