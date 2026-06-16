/** Expected content per museum for the known home-page items.
 *
 * These assert against live API data — if an upstream record changes,
 * this is the one file to update. Slugs are the `slugify()` output for
 * each title (covered by src/app/library/slug.test.ts). */
export const museums = {
	ash: {
		id: "ash-object-312375",
		indexable: true,
		slug: "tin-glazed-tile-in-italian-style",
		h1: "Tin-glazed tile in Italian style",
		pageTitle: "Tin-glazed tile in Italian style",
		origin: "https://co-ash.vercel.app",
		legacyHref: "https://www.ashmolean.org/collections-online#/item/ash-object-312375",
		simpleSearchHref: "https://www.ashmolean.org/collections-online#/search/simple-search",
		legacySearchReturn:
			"https://www.ashmolean.org/collections-online#/search/simple-search/object.objectType:tile",
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
		furtherItemsHeading: "Further items to explore",
		furtherItemsMore: false,
	},
	oum: {
		id: "oum-catalogue-36916",
		indexable: true,
		slug: "topaz-single-colourless-crystal",
		h1: "Topaz (single colourless crystal)",
		pageTitle: "Topaz (single colourless crystal)",
		origin: "https://co-oum.vercel.app",
		legacyHref: "https://www.oumnh.ox.ac.uk/collections-online#/item/oum-catalogue-36916",
		simpleSearchHref: "https://www.oumnh.ox.ac.uk/collections-online#/search/simple-search",
		legacySearchReturn:
			"https://www.oumnh.ox.ac.uk/collections-online#/search/simple-search/test/%257B%257D/1/12/_score/desc/catalogue",
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
		furtherItemsHeading: "Related Items",
		furtherItemsMore: true,
	},
	// the prm record title is the accession number; the description becomes
	// the page title (via generateMetadata) and the rendered subtitle
	prm: {
		id: "prm-object-79439",
		indexable: false,
		slug: "headdress-mask-representing-abam-a-predatory-fish",
		h1: "1938.15.69",
		pageTitle: "Headdress mask representing Abam, a predatory fish.",
		origin: "https://co-prm.vercel.app",
		legacyHref: "https://www.prm.ox.ac.uk/collections-online#/item/prm-object-79439",
		simpleSearchHref: "https://www.prm.ox.ac.uk/collections-online#/search/simple-search",
		legacySearchReturn:
			"https://www.prm.ox.ac.uk/collections-online#/search/simple-search/culturalGroups.culturalGroupHierarchy:Africa",
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
		furtherItemsHeading: "Further items to explore",
		furtherItemsMore: false,
	},
	hsm: {
		id: "hsm-catalogue-29715",
		indexable: true,
		slug: "two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs-new-jersey-usa-early-21st-century",
		h1: "Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century",
		pageTitle:
			"Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century",
		origin: "https://co-hsm.vercel.app",
		legacyHref: "https://www.hsm.ox.ac.uk/collections-online#/item/hsm-catalogue-29715",
		simpleSearchHref: "https://www.hsm.ox.ac.uk/collections-online#/search/simple-search",
		legacySearchReturn:
			"https://www.hsm.ox.ac.uk/collections-online#/search/simple-search/physical.material:Cardboard",
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
		furtherItemsHeading: "Related Items",
		furtherItemsMore: true,
	},
} as const

export type MuseumExpectations = (typeof museums)[keyof typeof museums]
