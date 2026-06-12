/** Expected content per museum for the known home-page items.
 *
 * These assert against live API data — if an upstream record changes,
 * this is the one file to update. Slugs are the `slugify()` output for
 * each title (covered by src/app/library/slug.test.ts). */
export const museums = {
	ash: {
		id: "ash-object-312375",
		slug: "tin-glazed-tile-in-italian-style",
		h1: "Tin-glazed tile in Italian style",
		pageTitle: "Tin-glazed tile in Italian style",
		origin: "https://collections-online-nextjs.ashmolean.org",
		legacyHref: "https://www.ashmolean.org/collections-online#/item/ash-object-312375",
		detailLabels: [
			"Title",
			"Associated place",
			"Material and technique",
			"Object type",
			"Accession no.",
			"Credit line",
		],
		onDisplay: false,
		imageCount: 2,
		expectHierarchy: true,
	},
	oum: {
		id: "oum-catalogue-36916",
		slug: "topaz-single-colourless-crystal",
		h1: "Topaz (single colourless crystal)",
		pageTitle: "Topaz (single colourless crystal)",
		origin: "https://collections-online-nextjs.oumnh.ox.ac.uk",
		legacyHref: "https://www.oumnh.ox.ac.uk/collections-online#/item/oum-catalogue-36916",
		detailLabels: [
			"Collection",
			"Subcollection",
			"Brief Description",
			"Object Type",
			"Object Number",
			"Number (Other Numbers)",
			"Locality",
		],
		onDisplay: false,
		imageCount: 1,
		expectHierarchy: false,
	},
	// the prm record title is the accession number; the description becomes
	// the page title (via generateMetadata) and the rendered subtitle
	prm: {
		id: "prm-object-79439",
		slug: "headdress-mask-representing-abam-a-predatory-fish",
		h1: "1938.15.69",
		pageTitle: "Headdress mask representing Abam, a predatory fish.",
		origin: "https://collections-online-nextjs.prm.ox.ac.uk",
		legacyHref: "https://www.prm.ox.ac.uk/collections-online#/item/prm-object-79439",
		detailLabels: [
			"Long description",
			"Geographical reference",
			"Cultural groups",
			"Person",
			"Date / Period",
			"Materials and processes",
			"Object numbers",
			"Research and responses",
		],
		onDisplay: true,
		imageCount: 6,
		expectHierarchy: true,
	},
	hsm: {
		id: "hsm-catalogue-29715",
		slug: "two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs-new-jersey-usa-early-21st-century",
		h1: "Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century",
		pageTitle:
			"Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century",
		origin: "https://collections-online-nextjs.hsm.ox.ac.uk",
		legacyHref: "https://www.hsm.ox.ac.uk/collections-online#/item/hsm-catalogue-29715",
		detailLabels: [
			"Item type",
			"Provenance",
			"Primary inscriptions",
			"Physical material",
			"Dimensions",
			"Makers",
			"Inventory No",
			"Accession Number",
		],
		onDisplay: false,
		imageCount: 1,
		expectHierarchy: false,
	},
} as const

export type MuseumExpectations = (typeof museums)[keyof typeof museums]
