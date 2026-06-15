/** Shared shape every museum entry must satisfy. Listing it explicitly means
 * adding a new museum is a type error until it declares its SEO policy —
 * `indexable` and `schema` can't be forgotten. */
type MuseumConfig = {
	ref: string
	name: string
	/** Public Collections Online host for this deployment (the `co.*` subdomain). */
	self: URL
	/** The museum's main public website. */
	url: URL
	/** IIIF DAMs base, for museums that have one (ash, prm). */
	dams?: URL
	/** S3 multimedia base, for museums without a DAMs (oum, hsm). */
	multimedia?: URL
	/** S3 assets base for teaser thumbnails (ash, prm). */
	assets?: URL
	/** Whether this museum's catalogue pages may be indexed by search engines and
	 * surfaced to AI answer engines.
	 *
	 * Set `false` to opt out entirely: pages still resolve for people arriving from
	 * Collections Online, but they emit `noindex` (meta + `X-Robots-Tag`) and are
	 * kept out of sitemaps, search results, and AI answers. Pitt Rivers opt out;
	 * every other museum opts in. New museums must choose explicitly. */
	indexable: boolean
	/** schema.org type for a catalogue object's JSON-LD structured data: art and
	 * ethnographic objects are `VisualArtwork`; specimens and instruments are the
	 * broader `CreativeWork`. */
	schema: "VisualArtwork" | "CreativeWork"
}

/** GLAM Oxford museum sites, keyed by the identifier used in IRNs and `NEXT_PUBLIC_MUSEUM`. */
export const museumDirectory = {
	/** Ashmolean Museum
	 * @see {@link https://www.ashmolean.org} */
	ash: {
		ref: "ash",
		name: "Ashmolean Museum",
		self: new URL("https://collections-online-nextjs.ashmolean.org"),
		url: new URL("https://www.ashmolean.org"),
		dams: new URL("https://dams.ashmus.ox.ac.uk/iiif/"),
		// teaser thumbnails come straight from this S3 bucket, not the DAMs
		assets: new URL(
			"https://ash-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/assets/",
		),
		indexable: true,
		schema: "VisualArtwork",
	},
	/** Oxford University Museum of Natural History
	 * @see {@link https://www.oumnh.ox.ac.uk} */
	oum: {
		ref: "oum",
		name: "Oxford University Museum of Natural History",
		self: new URL("https://collections-online-nextjs.oumnh.ox.ac.uk"),
		url: new URL("https://www.oumnh.ox.ac.uk"),
		// no DAMs/IIIF — images are served straight from S3 via `multimedia` paths
		multimedia: new URL(
			"https://mhn-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/data/oumnh/multimedia/",
		),
		indexable: true,
		schema: "CreativeWork",
	},
	/** Pitt Rivers Museum
	 * @see {@link https://www.prm.ox.ac.uk} */
	prm: {
		ref: "prm",
		name: "Pitt Rivers Museum",
		self: new URL("https://collections-online-nextjs.prm.ox.ac.uk"),
		url: new URL("https://www.prm.ox.ac.uk"),
		dams: new URL("https://dams.prm.ox.ac.uk/iiif/"),
		// teaser thumbnails come straight from this S3 bucket, not the DAMs
		assets: new URL(
			"https://prm-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/assets/",
		),
		// Pitt Rivers do not want their records indexed anywhere — pages stay live
		// for direct visitors but are kept out of search and AI results.
		indexable: false,
		schema: "VisualArtwork",
	},
	/** History of Science Museum
	 * @see {@link https://hsm.ox.ac.uk} */
	hsm: {
		ref: "hsm",
		name: "History of Science Museum",
		self: new URL("https://collections-online-nextjs.hsm.ox.ac.uk"),
		url: new URL("https://www.hsm.ox.ac.uk"),
		// no DAMs/IIIF — images are served straight from S3 via `multimedia` paths
		multimedia: new URL(
			"https://hsm-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/emumultimedia/multimedia/",
		),
		indexable: true,
		schema: "CreativeWork",
	},
} as const satisfies Record<string, MuseumConfig>

const current = museumDirectory[process.env.NEXT_PUBLIC_MUSEUM]
const self = current.self
const parent = new URL(current.url.origin)
const collectionsOnline = new URL("/collections-online", parent)
const simpleSearch = new URL("#/search/simple-search", collectionsOnline)

export const museum = {
	...current,
	urls: {
		self,
		parent,
		legacy: {
			collectionsOnline,
			simpleSearch,
		},
	},
}
