/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Pitt Rivers Museum's navigation and footer, scraped from https://www.prm.ox.ac.uk
 * on 2026-06-17T13:16:38.157Z by `bun run scrape`.
 *
 * Regenerate with: bun run scrape --museums=prm
 *
 * Written read-only; the scrape script restores write access before each
 * regeneration, so there is no need to chmod it back yourself.
 */
import type { FooterData, MenuItem } from "./config"

/** Utility links across the top of Pitt Rivers Museum's header. */
export const topLinks: Array<{ label: string; href: string }> = [
	{ label: "About", href: "/about-us-0" },
	{ label: "Hire the Museum", href: "/hire-museum-0" },
	{ label: "Newsletter", href: "/newsletter" },
	{ label: "University of Oxford", href: "http://www.ox.ac.uk/" },
]

/** Pitt Rivers Museum's primary navigation (the burger-menu drill-down). */
export const nav: Array<MenuItem> = [
	{
		label: "Visit us",
		href: "/visit-us",
		children: [
			{ label: "Plan your visit", href: "/visit-us" },
			{ label: "Accessibility", href: "/access" },
			{
				label: "Families",
				href: "/families",
				children: [{ label: "Family trails & crafts", href: "/family-trails-and-crafts" }],
			},
			{ label: "Visiting as a group", href: "/visiting-group" },
			{ label: "Highlights", href: "/highlights" },
		],
	},
	{
		label: "What's on",
		href: "/events",
		children: [
			{
				label: "Exhibitions",
				href: "/exhibitions-and-case-displays",
				children: [{ label: "Past exhibitions", href: "/past-exhibitions" }],
			},
			{
				label: "Events",
				href: "/events",
				children: [{ label: "Late Nights", href: "/late-nights" }],
			},
			{
				label: "Past exhibitions",
				href: "https://prm.web.ox.ac.uk/past-exhibitions?295821_filter1559401=17641&submit-559401=Apply",
			},
		],
	},
	{
		label: "Collections",
		href: "/collections",
		children: [
			{
				label: "Collections overview",
				href: "/collections",
				children: [
					{ label: "Highlights", href: "/highlights" },
					{ label: "Ethnography and Archaeology", href: "/ethnography-archaeology" },
					{
						label: "Photographs, archives, sounds, and films",
						href: "/photograph-collections",
					},
					{ label: "Library", href: "/library" },
				],
			},
			{ label: "Collections online", href: "/collections-online" },
			{ label: "Conservation", href: "/conservation" },
			{
				label: "Using our collections",
				href: "/using-our-collections",
				children: [
					{ label: "Photographic services", href: "/photographic-services" },
					{ label: "Balfour Library", href: "/library" },
				],
			},
			{ label: "Returns", href: "/returns" },
			{ label: "Human Remains", href: "/human-remains-pitt-rivers-museum-university-oxford" },
			{
				label: "Collections projects",
				href: "/collections-projects-0",
				children: [
					{ label: "Changing Curatorial Legacies", href: "/changing-curatorial-legacies" },
					{ label: "Rethinking Relationships", href: "/rethinking-relationships-0" },
				],
			},
			{ label: "Collections staff", href: "https://prm.web.ox.ac.uk/collections-staff" },
		],
	},
	{
		label: "Research",
		href: "/research",
		children: [
			{ label: "Research overview", href: "/research" },
			{ label: "Research team", href: "https://prm.web.ox.ac.uk/research-staff" },
			{ label: "Research community", href: "/research-community" },
			{ label: "Projects", href: "/research-projects-0" },
			{ label: "Partnerships", href: "/featured-research-partnerships" },
			{ label: "Publications", href: "https://prm.web.ox.ac.uk/featured-publications" },
			{ label: "Public Engagement with Research", href: "/public-engagement-research" },
			{ label: "Research project websites", href: "/collections-research-sites" },
		],
	},
	{
		label: "Learn",
		href: "/learn",
		children: [
			{
				label: "Primary schools",
				href: "/primary-schools",
				children: [
					{ label: "Key stage 1", href: "/primary-schools/key-stage-1" },
					{ label: "Key stage 2", href: "/primary-schools/key-stage-2" },
				],
			},
			{
				label: "Secondary schools & FE",
				href: "/secondary-schools-and-further-learning",
				children: [{ label: "Art visits & resources", href: "/art-learning-resources" }],
			},
			{ label: "Families", href: "/families" },
			{ label: "Community partnerships", href: "/community-partnerships" },
			{ label: "Higher education", href: "/higher-education" },
			{ label: "Learning resources", href: "/learning-resources" },
			{ label: "Visiting as a group", href: "/visiting-group" },
		],
	},
	{
		label: "Join & support",
		href: "/join-support",
		children: [
			{ label: "Newsletter", href: "/newsletter" },
			{
				label: "Members",
				href: "/membership",
				children: [{ label: "Members' Magazine", href: "/members-magazine" }],
			},
			{
				label: "Donate",
				href: "https://prm.web.ox.ac.uk/make-donation",
				children: [
					{
						label: "Donating objects or collections",
						href: "/donating-objects-or-collections",
					},
				],
			},
			{ label: "Volunteering", href: "https://www.glam.ox.ac.uk/volunteering" },
			{ label: "Working for us", href: "/working-for-us" },
		],
	},
	{
		label: "Shop",
		href: "https://shop.ashmolean.org/collections/pitt-rivers-museum",
		children: [
			{ label: "Gift shop", href: "https://shop.ashmolean.org/brand/pitt-rivers-museum.html" },
			{ label: "Prints and images", href: "https://www.prmprints.com/" },
		],
	},
]

/** Pitt Rivers Museum's footer: link columns, social, legal links and partner-logo keys. */
export const footer: FooterData = {
	social: [
		{ platform: "x", href: "http://twitter.com/Pitt_Rivers" },
		{ platform: "facebook", href: "https://www.facebook.com/pittriversmuseum/" },
		{
			platform: "youtube",
			href: "https://www.youtube.com/channel/UChrusltscFV9mzri-FUGdAw/featured",
		},
		{ platform: "instagram", href: "https://www.instagram.com/pittriversmuseum/" },
		{ platform: "bluesky", href: "https://bsky.app/profile/pittriversmuseum.bsky.social" },
	],
	legal: [
		{ label: "Privacy policy", href: "/privacy-policy" },
		{ label: "Accessibility", href: "/accessibility" },
	],
	partners: ["research-england", "arts-council-england", "heritage-fund"],
	newsletter: "/newsletter",
}
