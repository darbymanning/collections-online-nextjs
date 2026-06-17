/**
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Oxford University Museum of Natural History's navigation and footer, scraped from https://www.oumnh.ox.ac.uk
 * on 2026-06-16T21:11:32.867Z by `bun run scrape`.
 *
 * Regenerate with: bun run scrape --museums=oum
 *
 * Written read-only; the scrape script restores write access before each
 * regeneration, so there is no need to chmod it back yourself.
 */
import type { FooterData, MenuItem } from "./config"

/** Utility links across the top of Oxford University Museum of Natural History's header. */
export const topLinks: Array<{ label: string; href: string }> = [
	{ label: "About us", href: "/about" },
	{ label: "Careers and Volunteering", href: "https://oumnh.web.ox.ac.uk/working-for-us" },
	{ label: "Donate", href: "/support-museum" },
	{ label: "Newsletter", href: "/newsletter" },
	{ label: "Venue Hire", href: "/venue-hire" },
]

/** Oxford University Museum of Natural History's primary navigation (the burger-menu drill-down). */
export const nav: Array<MenuItem> = [
	{
		label: "Visit Us",
		href: "/visit-us",
		children: [
			{
				label: "Plan your visit",
				href: "/visit-us",
				children: [
					{ label: "Museum highlights", href: "/learn-museum-highlights" },
					{ label: "Multilingual guides", href: "/learn-multilingual-guides" },
					{
						label: "Museum Map",
						href: "/sites/default/files/oumnh/documents/media/map_for_website.pdf",
					},
				],
			},
			{
				label: "Group and School Bookings",
				href: "/group-and-school-bookings",
				children: [
					{
						label: "Information for Visiting Schools",
						href: "/information-about-school-visits",
					},
				],
			},
			{ label: "Café", href: "/cafe" },
			{ label: "Accessibility", href: "/accessibility-information" },
			{ label: "Audio guide", href: "/learn-audio-guide" },
		],
	},
	{
		label: "What's on",
		href: "/events-at-the-museum-of-natural-history",
		children: [
			{
				label: "All Events",
				href: "/events-at-the-museum-of-natural-history",
				children: [
					{ label: "Weekly and Regular Events", href: "/regular-weekly-events" },
					{
						label: "Events for Adults and Young People",
						href: "/events-for-adults-and-young-people",
					},
					{
						label: "Events for Families and Children",
						href: "/events-for-families-and-children",
					},
					{ label: "Accessible Events", href: "/accessible-events" },
					{ label: "Free Events", href: "/free-events" },
				],
			},
			{
				label: "Exhibitions",
				href: "/exhibitions-and-displays",
				children: [
					{ label: "Current Exhibitions", href: "/exhibitions-and-displays" },
					{
						label: "Our Next Exhibition",
						href: "/34-critical-raw-materials-shaping-our-future",
					},
					{ label: "Past Exhibitions", href: "/past-exhibitions-0" },
					{ label: "Online Exhibitions", href: "/online-exhibitions" },
				],
			},
			{
				label: "Presenting Case",
				href: "/event/as-above-so-below",
				children: [
					{ label: "Current Presenting Case", href: "/event/as-above-so-below" },
					{ label: "Past Presenting Cases", href: "https://oumnh.web.ox.ac.uk/past-displays" },
				],
			},
			{
				label: "Community case",
				href: "/event/discovering-deep-time",
				children: [
					{ label: "Current Community Case", href: "/event/discovering-deep-time" },
					{ label: "Past Community Cases", href: "/past-community-cases" },
				],
			},
			{ label: "Newsletter", href: "/newsletter" },
		],
	},
	{
		label: "Discover",
		children: [
			{ label: "Swifts Diary 2026", href: "/swifts-diary-2026" },
			{ label: "More Than A Dodo Blog", href: "/museum-blog" },
			{
				label: "Oxfordshire's Dinosaur Highway",
				children: [
					{
						label: "Uncovering Oxfordshire's Dinosaur Highway",
						href: "/oxfordshires-dinosaur-highway",
					},
					{
						label: "Return to Oxfordshire's Jurassic Highway",
						href: "/return-to-oxfordshires-dinosaur-highway",
					},
				],
			},
			{ label: "Biodiversity", href: "/biodiversity" },
			{ label: "Women in Science", href: "/learn-shout-out-for-women-in-science" },
			{ label: "Museum Stories", href: "/museum-stories" },
			{ label: "Design and Decoration", href: "/the-interior-of-the-museum-1854-1914" },
		],
	},
	{
		label: "Collections",
		href: "/collections",
		children: [
			{
				label: "Collection areas",
				href: "/collections",
				children: [
					{ label: "Art & Architecture", href: "/art-and-architecture" },
					{ label: "Library & Archives", href: "/library-and-archive" },
					{ label: "Life", href: "/zoology-0" },
					{ label: "Mineralogy & Petrology", href: "/mineralogy-and-petrology" },
					{ label: "Palaeontology", href: "/learn-palaeontology" },
				],
			},
			{
				label: "Using our collections",
				href: "/using-our-collections",
				children: [{ label: "Ordering Images", href: "/ordering-images" }],
			},
			{ label: "Collections online", href: "/collections-online#/search" },
			{ label: "Collections staff", href: "/collections-managers" },
			{ label: "Collections care", href: "/collections-care" },
			{ label: "Object identification service", href: "/object-identification-service" },
			{ label: "HOPE for the Future", href: "/hope-future" },
		],
	},
	{
		label: "Learn",
		href: "/learn",
		children: [
			{
				label: "Schools and Learning",
				href: "https://oumnh.web.ox.ac.uk/information-for-teachers",
				children: [
					{ label: "Early years", href: "/learn-early-years" },
					{ label: "KS1 School Visits", href: "/learn-key-stage-1" },
					{ label: "KS2 School Visits", href: "/learn-key-stage-2" },
					{ label: "KS3 School Visits", href: "/learn-key-stage-3-school-visits" },
					{ label: "KS4 School Visits", href: "/key-stage-4-science-sessions" },
					{ label: "KS5 School Visits", href: "/key-stage-5-science-sessions" },
					{ label: "KS3-5 Art & Design", href: "/learn-art-design" },
					{ label: "Sensing Evolution", href: "/learn-sensing-evolution" },
				],
			},
			{ label: "Higher education", href: "/learn-higher-education-teaching" },
			{
				label: "Young people (10-19 yrs)",
				href: "/young-people",
				children: [
					{ label: "Youth Forum (16-19 years)", href: "/youth-forum" },
					{
						label: "Natural History Investigators (14-16 years)",
						href: "/natural-history-investigators",
					},
					{
						label: "Natural Science and Heritage Scheme (16-18 years)",
						href: "/natural-science-and-heritage-scheme",
					},
					{
						label: "STEM Research Placements (16-18 years)",
						href: "/stem-research-placements",
					},
					{ label: "Natural History Discoverers", href: "/natural-history-discoverers-0" },
				],
			},
			{ label: "Adults", href: "/adults" },
			{ label: "Families", href: "/families" },
			{ label: "Case studies", href: "/case-studies" },
			{ label: "Learning Zone", href: "https://learningzone.oumnh.ox.ac.uk/" },
		],
	},
	{
		label: "Research",
		href: "/research-at-the-museum",
		children: [
			{ label: "Research", href: "/research-at-the-museum" },
			{ label: "Researchers", href: "/research-staff" },
			{ label: "Postgraduate Study", href: "/postgraduate-study" },
			{ label: "Early Career Opportunities", href: "/early-career-opportunities" },
			{ label: "Research Visitors", href: "/research-visitors" },
			{ label: "Research Facilities", href: "/small-research-facilities" },
			{ label: "Global Partnerships", href: "/partnerships" },
			{ label: "Public Engagement with Research", href: "/public-engagement-research" },
		],
	},
	{ label: "Shop", href: "https://shop.oumnh.ox.ac.uk/" },
]

/** Oxford University Museum of Natural History's footer: link columns, social, legal links and partner-logo keys. */
export const footer: FooterData = {
	social: [
		{ platform: "facebook", href: "https://www.facebook.com/morethanadodo/" },
		{ platform: "instagram", href: "https://www.instagram.com/morethanadodo/" },
		{ platform: "youtube", href: "https://www.youtube.com/user/oumnhvideos/videos" },
	],
	legal: [
		{ label: "Accessibility", href: "/accessibility-information" },
		{ label: "Privacy policy", href: "https://www.glam.ox.ac.uk/privacy-notice-glam" },
		{ label: "Terms of Use and Copyright", href: "/copyright-0" },
		{ label: "Website Accessibility Statement", href: "/website-accessibility-statement" },
	],
	partners: [
		"research-england",
		"arts-council-england",
		"heritage-fund",
		"athena-swan",
		"oxford-mosaic",
		"it-services",
	],
	newsletter: "/newsletter",
}
