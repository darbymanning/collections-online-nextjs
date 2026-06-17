import { expect, test } from "@playwright/test"

/** The active museum's own label in the Gardens, Libraries & Museums strip,
 * keyed by the playwright project name (the museum ref). */
const ownGlamLabel = {
	ash: "Ashmolean Museum",
	oum: "Museum of Natural History",
	prm: "Pitt Rivers Museum",
	hsm: "History of Science Museum",
} as const

test("renders the site footer with its shared affiliations", async ({ page }) => {
	await page.goto("/")
	const footer = page.getByRole("contentinfo")
	await expect(footer).toBeVisible()

	// the Gardens, Libraries & Museums family strip
	await expect(
		footer.getByRole("heading", { name: "Part of Gardens, Libraries & Museums" }),
	).toBeVisible()

	// newsletter sign-up + a social link (every museum links to Facebook)
	await expect(footer.getByRole("link", { name: "Sign up to our newsletter" })).toBeVisible()
	await expect(footer.getByRole("link", { name: "Facebook" })).toBeVisible()

	// affiliations every deployment carries: a Research England funder logo and the
	// University of Oxford crest (exact — "University of Oxford IT Services" also
	// carries the funder name)
	await expect(footer.getByRole("link", { name: "Research England" })).toBeVisible()
	await expect(
		footer.getByRole("link", { name: "University of Oxford", exact: true }),
	).toBeVisible()

	// at least one scraped legal link
	await expect(footer.getByRole("link", { name: "Privacy policy" })).toBeVisible()
})

test("omits the current museum from its own sibling strip", async ({ page }) => {
	await page.goto("/")
	const footer = page.getByRole("contentinfo")

	const label = ownGlamLabel[test.info().project.name as keyof typeof ownGlamLabel]
	// the family strip lists the five *other* institutions, never the current one
	await expect(footer.getByRole("link", { name: label, exact: true })).toHaveCount(0)
})
