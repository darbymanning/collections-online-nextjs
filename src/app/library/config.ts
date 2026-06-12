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
	},
} as const

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
