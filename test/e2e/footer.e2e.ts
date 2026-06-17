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
	// University of Oxford crest in the logo column (exact match keeps it off any
	// other "Oxford …" labels)
	await expect(footer.getByRole("link", { name: "Research England" })).toBeVisible()
	await expect(
		footer.getByRole("link", { name: "University of Oxford", exact: true }),
	).toBeVisible()

	// at least one scraped legal link
	await expect(footer.getByRole("link", { name: "Privacy policy" })).toBeVisible()
})

test("includes the current museum in its own family strip", async ({ page }) => {
	await page.goto("/")
	const footer = page.getByRole("contentinfo")

	const label = ownGlamLabel[test.info().project.name as keyof typeof ownGlamLabel]
	// the family strip lists all six institutions, the current one included, so the
	// 2-col mobile grid fills evenly rather than orphaning a fifth card
	await expect(footer.getByRole("link", { name: label, exact: true })).toHaveCount(1)
})
