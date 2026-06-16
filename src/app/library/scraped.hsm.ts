/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * History of Science Museum's navigation, scraped from https://www.hsm.ox.ac.uk
 * on 2026-06-16T11:16:20.541Z by `bun run scrape`.
 *
 * Regenerate with: bun run scrape --museums=hsm
 *
 * Written read-only; the scrape script restores write access before each
 * regeneration, so there is no need to chmod it back yourself.
 */
import type { MenuItem } from "./config"

/** Utility links across the top of History of Science Museum's header. */
export const topLinks: Array<{ label: string; href: string }> = [
	{ label: "Hire the Museum for filming", href: "/museum-filming-enquiry-form" },
]

/** History of Science Museum's primary navigation (the burger-menu drill-down). */
export const nav: Array<MenuItem> = [
	{
		label: "Visit us",
		href: "/plan-your-visit",
		children: [
			{
				label: "Plan your visit",
				href: "/plan-your-visit",
				children: [
					{ label: "Opening hours", href: "/plan-your-visit#widget-id-3225831" },
					{ label: "How to get here", href: "/plan-your-visit#widget-id-3225831" },
					{ label: "Information & FAQs", href: "/your-questions-answered-faqs" },
					{ label: "Contact us", href: "/contact" },
				],
			},
			{ label: "Visiting as a group", href: "/visiting-group" },
			{ label: "Access to the Museum", href: "/access" },
		],
	},
	{
		label: "What's on",
		href: "/whats-on",
		children: [
			{ label: "Events", href: "/whats-on" },
			{ label: "Displays in the galleries", href: "/current-exhibitions-and-displays" },
			{ label: "Online displays and exhibitions", href: "/past-exhibitions-and-displays" },
		],
	},
	{
		label: "Collections",
		href: "/collections",
		children: [
			{
				label: "Search the collections",
				href: "/collections-databases",
				children: [
					{ label: "Collections Online database", href: "/collections-online" },
					{
						label: "Astrolabe catalogue",
						href: "https://www.mhs.ox.ac.uk/astrolabe/catalogue/",
					},
					{
						label: "Epact: Scientific Instruments of Medieval and Renaissance Europe",
						href: "https://www.mhs.ox.ac.uk/epact/",
					},
					{ label: "Marconi catalogue", href: "https://www.mhs.ox.ac.uk/marconi/collection/" },
				],
			},
			{
				label: "About the Collections",
				href: "/collections",
				children: [
					{ label: "Highlights", href: "/highlights" },
					{ label: "Collections areas", href: "/collections-areas" },
					{ label: "Library and archives", href: "/library-and-archives" },
					{ label: "Conservation", href: "/conservation" },
				],
			},
			{ label: "Order images", href: "/ordering-images" },
			{
				label: "Blog",
				href: "/meeting-points",
				children: [
					{ label: "Meeting Points (HSM Blog)", href: "/meeting-points" },
					{
						label: "Inside the Museum (archived blogs and stories)",
						href: "http://blogs.mhs.ox.ac.uk/insidemhs/",
					},
					{ label: "More archived blogs", href: "/archive-blogs" },
				],
			},
			{ label: "Join the mailing list (Rete)", href: "/mailing-list" },
		],
	},
	{
		label: "Research",
		href: "/research",
		children: [
			{ label: "Overview", href: "/research" },
			{ label: "Meet the team", href: "/research-projects#widget-id-5198136" },
			{ label: "Projects", href: "/research-projects#widget-id-5198166" },
			{ label: "Partnerships", href: "/research-projects#widget-id-5198176" },
			{
				label: "Public & Community Engagement with Research",
				href: "/research-projects#widget-id-5198186",
			},
		],
	},
	{
		label: "Learning",
		href: "/learning",
		children: [
			{
				label: "Schools: Early Years to KS5",
				href: "/learning",
				children: [
					{ label: "Primary schools", href: "/primary-schools" },
					{ label: "Secondary and post-16", href: "/secondary-and-post-16" },
					{ label: "Study Days", href: "/study-days" },
					{ label: "Learning resources", href: "/learning-resources" },
					{ label: "Language schools", href: "/efl" },
				],
			},
			{ label: "Adults and young people", href: "/adults" },
			{ label: "Families", href: "/families" },
			{ label: "Community and outreach", href: "/community-outreach" },
			{ label: "Collaborations & projects", href: "/projects" },
		],
	},
	{
		label: "Get involved",
		href: "/get-involved",
		children: [
			{ label: "Volunteering", href: "https://www.glam.ox.ac.uk/volunteering" },
			{
				label: "Supporting the Museum",
				href: "https://www.development.ox.ac.uk/history-of-science-museum",
				children: [
					{
						label: "Make a donation",
						href: "https://www.development.ox.ac.uk/mag?id=fb8a1f52-0f43-4075-9948-06f608887c71",
					},
				],
			},
			{ label: "Sign up for the Newsletter", href: "/newsletter" },
		],
	},
	{
		label: "About us",
		href: "/about",
		children: [
			{ label: "Introducing the Museum", href: "/about" },
			{ label: "Annual Reviews", href: "/about#widget-id-5198611" },
			{ label: "Press releases", href: "/press" },
			{ label: "Contact us", href: "/contact" },
		],
	},
]
