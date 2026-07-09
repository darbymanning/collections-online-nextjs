"use client"
import { museum, type MenuItem } from "$library/config"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useHeaderScrollHide } from "$hooks/use-scroll-hide"
import { useState } from "react"
import { Button } from "$components/button"
import { SiteSearch } from "$components/site-search"

/** Off-site links keep their absolute URL; everything else resolves against the
 * museum's main website. */
function resolveHref(href: string): string {
	return href.startsWith("http") ? href : `${museum.urls.parent.origin}${href}`
}

const triggerClass =
	"flex items-center gap-1 rounded py-3 font-medium animated-underline hover:[--underline-w:100%]"

/** One top-level section of the horizontal nav bar: a link (or a plain trigger
 * when the museum's own nav gives the section no landing page), with a CSS-only
 * dropdown of its direct child links on hover/focus — mirroring the menu bar on
 * the museum's main site. Grandchildren are reachable from the section pages
 * themselves, so the dropdown stays one level deep. */
function NavSection({ section }: { section: MenuItem }) {
	const children = (section.children ?? []).filter((child) => child.href)
	const label = (
		<>
			{section.label}
			{children.length > 0 && <ChevronDown aria-hidden className="shrink-0" />}
		</>
	)
	return (
		<li className="group/nav relative">
			{section.href ? (
				<a href={resolveHref(section.href)} className={triggerClass}>
					{label}
				</a>
			) : (
				<button type="button" className={triggerClass}>
					{label}
				</button>
			)}
			{children.length > 0 && (
				// the dropdown sits on a white panel whatever the band colour, so the
				// focus ring reverts to the neutral default rather than the band's
				<ul className="invisible absolute top-full left-0 z-30 min-w-56 rounded-b-md bg-background py-2 text-foreground shadow-xl [--color-ring:var(--color-gray-600)] group-focus-within/nav:visible group-hover/nav:visible">
					{children.map((child) => (
						<li key={child.label}>
							<a
								href={resolveHref(child.href ?? "")}
								className="block rounded px-4 py-2 hover:bg-primary/10"
							>
								{child.label}
							</a>
						</li>
					))}
				</ul>
			)}
		</li>
	)
}

export function Header() {
	const hidden = useHeaderScrollHide()
	const [searchOpen, setSearchOpen] = useState(false)

	return (
		<header
			// keep the header pinned while the search bar is open, even mid-scroll
			data-hidden={(hidden && !searchOpen) || undefined}
			className="sticky top-0 z-20 border-b border-current/10 accented transition-[translate,opacity] duration-500 data-hidden:pointer-events-none data-hidden:-translate-y-full data-hidden:opacity-0"
		>
			<div className="flex items-center justify-between gap-4 px-[5vw] pt-4 pb-1">
				<a className="shrink-0 rounded" href={museum.url.toString()}>
					<Image
						src={museum.header.logo}
						alt={museum.name}
						width={museum.header.logoWidth}
						loading="eager"
					/>
				</a>
				<div className="flex items-center gap-2">
					<div className="flex gap-4 border-r border-r-current/20 pr-5 text-sm max-lg:hidden">
						{museum.header.topLinks.map((link) => (
							<Button variant="link" key={link.href} href={resolveHref(link.href)}>
								{link.label}
							</Button>
						))}
					</div>
					<button
						className="flex size-10 items-center justify-center rounded-full p-2"
						data-open={searchOpen || undefined}
						aria-label={searchOpen ? "Close search" : "Search"}
						aria-expanded={searchOpen}
						onClick={() => setSearchOpen(!searchOpen)}
					>
						<span className="search-icon text-base"></span>
					</button>
				</div>
			</div>
			<nav aria-label="Main menu" className="px-[5vw]">
				{/* ponytail: the bar wraps onto extra rows on narrow screens rather than
				 * collapsing into a burger — the museums asked for no burger menu */}
				<ul className="flex flex-wrap gap-x-6 text-sm">
					{museum.header.nav.map((section) => (
						<NavSection key={section.label} section={section} />
					))}
				</ul>
			</nav>
			{searchOpen && (
				<div className="border-t border-current/10 px-[5vw] py-4">
					<SiteSearch autoFocus className="mx-auto" />
				</div>
			)}
		</header>
	)
}
