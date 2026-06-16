/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Ashmolean Museum's navigation, scraped from https://www.ashmolean.org
 * on 2026-06-16T11:21:32.114Z by `bun run scrape`.
 *
 * Regenerate with: bun run scrape --museums=ash
 *
 * Written read-only; the scrape script restores write access before each
 * regeneration, so there is no need to chmod it back yourself.
 */
import type { MenuItem } from "./config"

/** Utility links across the top of Ashmolean Museum's header. */
export const topLinks: Array<{ label: string; href: string }> = [
	{ label: "University of Oxford", href: "http://www.ox.ac.uk/" },
	{ label: "Venue Hire", href: "/venue-hire" },
	{ label: "Working for us", href: "/working-ashmolean" },
]

/** Ashmolean Museum's primary navigation (the burger-menu drill-down). */
export const nav: Array<MenuItem> = [
	{
		label: "Visit",
		children: [
			{
				label: "Plan your visit",
				href: "/plan-your-visit",
				children: [
					{ label: "Book tickets", href: "/plan-your-visit#widget-id-2152791" },
					{ label: "Directions", href: "/directions" },
					{ label: "Access", href: "/access" },
					{ label: "Galleries", href: "/floor-guide" },
					{ label: "PDF floor plan", href: "/sitefiles/ashmolean-museum-floor-plan-jun-2026" },
					{ label: "Visiting as a group", href: "/visiting-group" },
					{ label: "Audio guides", href: "/audio-guides" },
					{ label: "FAQs", href: "/faqs" },
				],
			},
			{ label: "Families", href: "/families" },
			{ label: "Café and restaurant", href: "/cafe-and-restaurant" },
		],
	},
	{
		label: "What's on",
		children: [
			{
				label: "Exhibitions",
				href: "/exhibitions",
				children: [
					{
						label: "In bloom: how plants changed our world",
						href: "/exhibition/in-bloom-how-plants-changed-our-world",
					},
					{ label: "Free exhibitions & displays", href: "/exhibitions" },
				],
			},
			{ label: "Events", href: "/events" },
		],
	},
	{
		label: "Stories",
		children: [
			{ label: "Stories & films", href: "/stories" },
			{ label: "Podcasts", href: "/podcasts" },
			{ label: "Things to do at home", href: "/ashmoleanfromhome" },
		],
	},
	{
		label: "Collections",
		children: [
			{ label: "Collection highlights", href: "/highlights" },
			{ label: "Collections online", href: "/collections-online" },
			{
				label: "Using our collections",
				children: [
					{ label: "Study rooms", href: "/studyrooms" },
					{ label: "Loans", href: "/loans" },
					{ label: "Ordering images", href: "/ordering-images" },
				],
			},
			{
				label: "Departments",
				href: "/departments",
				children: [
					{ label: "Antiquities", href: "/antiquities" },
					{ label: "Cast gallery", href: "/cast-gallery-department" },
					{ label: "Coins", href: "/heberden-coin-room" },
					{ label: "Eastern art", href: "/eastern-art" },
					{ label: "Western art", href: "/western-art" },
					{ label: "Conservation", href: "/conservation" },
				],
			},
			{
				label: "Research",
				href: "/research",
				children: [
					{ label: "Projects", href: "/research-projects" },
					{ label: "Research profiles", href: "/research-profiles" },
					{ label: "Partnerships", href: "/partnerships" },
					{ label: "Publications", href: "/publications" },
					{
						label: "Early career research opportunities",
						href: "/early-career-research-opportunities",
					},
					{
						label: "Doctoral research opportunities",
						href: "/doctoral-research-opportunities",
					},
				],
			},
		],
	},
	{
		label: "Learn",
		children: [
			{
				label: "Schools",
				href: "/schools",
				children: [
					{ label: "Primary schools", href: "/primary-schools" },
					{ label: "Secondary schools", href: "/secondary-schools" },
					{ label: "Learning resources", href: "/learning-resources" },
				],
			},
			{ label: "Academic engagement", href: "/university-teaching" },
			{ label: "Young people", href: "/young-people" },
			{ label: "Adult groups", href: "/adult-groups" },
			{ label: "Home learning", href: "/home-learning" },
			{ label: "Case studies and projects", href: "/learning-case-studies-and-projects" },
		],
	},
	{
		label: "Join & support",
		children: [
			{
				label: "Become a member",
				href: "/membership",
				children: [
					{ label: "Join online", href: "/membership" },
					{ label: "Gift membership", href: "/gift-membership" },
					{ label: "Existing members", href: "/your-membership" },
					{
						label: "Member account login",
						href: "https://tickets.ox.ac.uk/WebStore/MemberPortal/Account/Logon?cg=ashmemaccount&c=renewmembership",
					},
					{ label: "Member events", href: "/members-events" },
				],
			},
			{ label: "Become a patron", href: "/become-patron" },
			{ label: "Corporate membership", href: "/corporate-membership" },
			{ label: "Donate", href: "/bringing-history-to-life-2025-appeal" },
			{ label: "Ways to support", href: "/support" },
			{ label: "Working for us", href: "/working-ashmolean" },
		],
	},
	{
		label: "Shop",
		children: [
			{ label: "Gift shop", href: "https://shop.ashmolean.org/" },
			{ label: "Prints and images", href: "/prints-and-images" },
			{ label: "Brand licensing", href: "/brand-licensing" },
		],
	},
]
