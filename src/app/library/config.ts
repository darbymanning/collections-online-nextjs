import type { StaticImageData } from "next/image"
import prmLogo from "$assets/prm-logo.svg"
import ashLogo from "$assets/ash-logo.svg"
import oumLogo from "$assets/oum-logo.svg"
import hsmLogo from "$assets/hsm-logo.svg"
import prmHero from "$assets/prm-hero.jpg"
import ashHero from "$assets/ash-hero.jpg"
import oumHero from "$assets/oum-hero.jpg"
import hsmHero from "$assets/hsm-hero.jpg"
// `topLinks` and `nav` are scraped from each museum's live site — regenerate with
// `bun run scrape` (see scripts/scrape.ts). Everything else here is hand-authored.
import { footer as ashFooter, nav as ashNav, topLinks as ashTopLinks } from "./scraped.ash"
import { footer as oumFooter, nav as oumNav, topLinks as oumTopLinks } from "./scraped.oum"
import { footer as prmFooter, nav as prmNav, topLinks as prmTopLinks } from "./scraped.prm"
import { footer as hsmFooter, nav as hsmNav, topLinks as hsmTopLinks } from "./scraped.hsm"

/** A node in a museum's burger-menu tree. A node with `children` drills into a
 * deeper layer (and its `href`, when present, becomes that layer's heading link);
 * a leaf links out via `href`. Mirrors each museum's own primary navigation. */
export type MenuItem = { label: string; href?: string; children?: Array<MenuItem> }

/** Social platforms a museum links to in its footer. Mapped to brand icons +
 * accessible labels in `footer.tsx`. */
export type SocialPlatform = "facebook" | "instagram" | "x" | "youtube" | "bluesky"

/** Funder / accreditation / platform logos a museum carries in its footer. The
 * key selects a local logo asset + label + link in `footer.tsx`; the scrape only
 * records which ones each museum actually shows. */
export type FooterPartner =
	| "research-england"
	| "athena-swan"
	| "arts-council-england"
	| "heritage-fund"
	| "it-services"
	| "oxford-mosaic"

/** A museum's scraped footer content. The sitemap columns are derived from `nav`
 * (the museums' own footer link-lists are messy and inconsistent), and the Oxford
 * + GLAM-sibling logo strip is the same everywhere — both live in `footer.tsx`.
 * Only these reliably-scrapeable, per-museum bits come from the live footer. */
export type FooterData = {
	social: Array<{ platform: SocialPlatform; href: string }>
	legal: Array<{ label: string; href: string }>
	partners: Array<FooterPartner>
	newsletter?: string
}

/** Shared shape every museum entry must satisfy. Listing it explicitly means
 * adding a new museum is a type error until it declares its SEO policy —
 * `indexable` and `schema` can't be forgotten. */
type MuseumConfig = {
	ref: string
	name: string
	/** Public Collections Online host for this deployment. Phase 0 POC: the
	 * per-museum Vercel deployment (`co-<ref>.vercel.app`), which becomes the real
	 * `co.*` subdomain later. Drives canonical URLs, OG/JSON-LD, and the sitemap —
	 * so it must equal the host the pages are actually served from. */
	self: URL
	/** Full URL of this museum's externally generated sitemap index, advertised in
	 * `robots.txt`. The per-museum sitemap app (`co-<ref>-sitemap.vercel.app`),
	 * generated outside this repo — see docs/seo-options.md. Omitted for museums
	 * that opt out of indexing (Pitt Rivers), which advertise no sitemap. */
	sitemap?: URL
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
		self: new URL("https://co-ash.vercel.app"),
		sitemap: new URL("https://co-ash-sitemap.vercel.app/sitemap.xml"),
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
		self: new URL("https://co-oum.vercel.app"),
		sitemap: new URL("https://co-oum-sitemap.vercel.app/sitemap.xml"),
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
		self: new URL("https://co-prm.vercel.app"),
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
		self: new URL("https://co-hsm.vercel.app"),
		sitemap: new URL("https://co-hsm-sitemap.vercel.app/sitemap.xml"),
		url: new URL("https://www.hsm.ox.ac.uk"),
		// no DAMs/IIIF — images are served straight from S3 via `multimedia` paths
		multimedia: new URL(
			"https://hsm-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/emumultimedia/multimedia/",
		),
		indexable: true,
		schema: "CreativeWork",
	},
} as const satisfies Record<string, MuseumConfig>

/** Everything the shared header renders for a museum: branding, the utility links
 * across the top, the feature panel's image + copy, and the burger-menu tree.
 * Sourced from each museum's own website. */
type HeaderConfig = {
	logo: StaticImageData
	/** rendered logo width in px — logos differ in aspect ratio, so each museum
	 * picks its own to land on a comparable header height */
	logoWidth: number
	hero: StaticImageData
	heroAlt: string
	topLinks: Array<{ label: string; href: string }>
	feature: { title: string; text: string; href: string; label: string }
	nav: Array<MenuItem>
}

const headers = {
	prm: {
		logo: prmLogo,
		logoWidth: 150,
		hero: prmHero,
		heroAlt: "The Pitt Rivers Museum court, filled with display cases",
		topLinks: prmTopLinks,
		feature: {
			title: "Plan your visit",
			text: "Free entry, no booking required. Discover over half a million objects from cultures around the world.",
			href: "/visit-us",
			label: "Plan your visit",
		},
		nav: prmNav,
	},
	ash: {
		logo: ashLogo,
		logoWidth: 200,
		hero: ashHero,
		heroAlt: "The neoclassical façade of the Ashmolean Museum",
		topLinks: ashTopLinks,
		feature: {
			title: "Plan your visit",
			text: "Free entry to Britain's first public museum — art and archaeology from across the world.",
			href: "/plan-your-visit",
			label: "Plan your visit",
		},
		nav: ashNav,
	},
	oum: {
		logo: oumLogo,
		logoWidth: 56,
		hero: oumHero,
		heroAlt: "The neo-Gothic main court of the Museum of Natural History",
		topLinks: oumTopLinks,
		feature: {
			title: "Plan your visit",
			text: "Free entry, no booking required. Meet dinosaurs, dodos and the wonders of the natural world.",
			href: "/visit-us",
			label: "Plan your visit",
		},
		nav: oumNav,
	},
	hsm: {
		logo: hsmLogo,
		logoWidth: 150,
		hero: hsmHero,
		heroAlt: "Historic instruments in the gallery of the History of Science Museum",
		topLinks: hsmTopLinks,
		feature: {
			title: "Plan your visit",
			text: "Free entry to the world's finest collection of historic scientific instruments.",
			href: "/plan-your-visit",
			label: "Plan your visit",
		},
		nav: hsmNav,
	},
} satisfies Record<string, HeaderConfig>

const footers = {
	ash: ashFooter,
	oum: oumFooter,
	prm: prmFooter,
	hsm: hsmFooter,
} satisfies Record<string, FooterData>

const current = museumDirectory[process.env.NEXT_PUBLIC_MUSEUM]
const self = current.self
const parent = new URL(current.url.origin)
const collectionsOnline = new URL("/collections-online", parent)
const simpleSearch = new URL("#/search/simple-search", collectionsOnline)

export const museum = {
	...current,
	header: headers[process.env.NEXT_PUBLIC_MUSEUM],
	footer: footers[process.env.NEXT_PUBLIC_MUSEUM],
	urls: {
		self,
		parent,
		legacy: {
			collectionsOnline,
			simpleSearch,
		},
	},
}
