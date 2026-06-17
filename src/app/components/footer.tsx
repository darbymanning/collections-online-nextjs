import { museum, type FooterPartner, type SocialPlatform } from "$library/config"
import { Button } from "$components/button"
import { OxfordMosaicLogo } from "$components/oxford-mosaic-logo"
import { cn } from "$library/utils"
import Image, { type StaticImageData } from "next/image"
import type { IconType } from "react-icons"
import { SiBluesky, SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si"
import { MailCheckIcon } from "lucide-react"
import oxfordLogo from "$assets/oxford-logo.svg"
import ashLogo from "$assets/ash-logo.svg"
import oumLogo from "$assets/oum-logo.svg"
import prmLogo from "$assets/prm-logo.svg"
import hsmLogo from "$assets/hsm-logo.svg"
import bodleianLogo from "$assets/bodleian-logo.svg"
import obgaLogo from "$assets/obga-logo.svg"
import researchEnglandLogo from "$assets/research-england-logo.svg"
import athenaSwanLogo from "$assets/athena-swan-logo.svg"
import artsCouncilLogo from "$assets/arts-council-england-logo.svg"
import heritageFundLogo from "$assets/heritage-fund-logo.svg"

/** Brand glyph + accessible label for each social platform. lucide dropped its
 * brand icons, so the marks come from react-icons (Simple Icons). */
const socials: Record<SocialPlatform, { Icon: IconType; label: string }> = {
	facebook: { Icon: SiFacebook, label: "Facebook" },
	instagram: { Icon: SiInstagram, label: "Instagram" },
	x: { Icon: SiX, label: "X" },
	youtube: { Icon: SiYoutube, label: "YouTube" },
	bluesky: { Icon: SiBluesky, label: "Bluesky" },
}

/** The Gardens, Libraries & Museums family — the same six institutions on every
 * deployment, shown in full (the current museum included) so the strip stays a
 * clean six across breakpoints rather than orphaning at five. */
const glamFamily = [
	{ ref: "ash", label: "Ashmolean Museum", logo: ashLogo, url: "https://www.ashmolean.org" },
	{
		ref: "hsm",
		label: "History of Science Museum",
		logo: hsmLogo,
		url: "https://www.hsm.ox.ac.uk",
	},
	{
		ref: "oum",
		label: "Museum of Natural History",
		logo: oumLogo,
		url: "https://www.oumnh.ox.ac.uk",
	},
	// the Pitt Rivers mark is partly white (for its dark site), so darken it to read on white
	{
		ref: "prm",
		label: "Pitt Rivers Museum",
		logo: prmLogo,
		url: "https://www.prm.ox.ac.uk",
		light: true,
	},
	{
		ref: "bodleian",
		label: "Bodleian Libraries",
		logo: bodleianLogo,
		url: "https://www.bodleian.ox.ac.uk",
	},
	{
		ref: "obga",
		label: "Oxford Botanic Garden & Arboretum",
		logo: obgaLogo,
		url: "https://www.obga.ox.ac.uk",
	},
] as const

/** Funder / accreditation / platform logos, keyed by the partner identifiers the
 * scrape records per museum. `light` marks white-on-transparent logos that need
 * darkening to read on the white footer. */
const partners: Record<
	FooterPartner,
	{ label: string; logo: StaticImageData; url: string; light?: boolean }
> = {
	"research-england": {
		label: "Research England",
		logo: researchEnglandLogo,
		url: "https://re.ukri.org/",
	},
	"athena-swan": {
		label: "Athena Swan Charter",
		logo: athenaSwanLogo,
		url: "https://www.advance-he.ac.uk/equality-charters/athena-swan-charter",
	},
	"arts-council-england": {
		label: "Arts Council England",
		logo: artsCouncilLogo,
		url: "https://www.artscouncil.org.uk/",
	},
	"heritage-fund": {
		label: "National Lottery Heritage Fund",
		logo: heritageFundLogo,
		url: "https://www.heritagefund.org.uk/",
	},
}

/** Off-site links keep their absolute URL; site-relative paths resolve against
 * the museum's main website (mirrors the header). */
function resolveHref(href: string): string {
	return href.startsWith("http") ? href : `${museum.urls.parent.origin}${href}`
}

/** The footer sitemap: each top-level nav section becomes a column of its direct
 * children (the museums' own footer link-lists are too inconsistent to scrape, so
 * we reuse the clean nav). Sections without child links render as a heading only. */
const columns = museum.header.nav.map((section) => ({
	heading: section.label,
	href: section.href,
	links: (section.children ?? []).filter((child) => child.href).slice(0, 6),
}))

/** A footer link with the shared hover underline. */
function FootLink({ href, children }: { href: string; children: string }) {
	return (
		<Button variant="link" href={href} className="font-medium">
			{children}
		</Button>
	)
}

type LogoItem = { logo: StaticImageData; label: string; url: string; light?: boolean }

/** An affiliation logo card. Marks are greyscaled; the Pitt Rivers mark is partly
 * white-on-transparent (for its dark site), so it carries `light` and is darkened
 * to read on the white footer. */
function LogoLink({ logo, label, url, light }: LogoItem) {
	return (
		<a
			href={url}
			title={label}
			className="relative flex aspect-video w-full rounded-lg bg-primary/15 opacity-50 transition-opacity hover:opacity-100"
		>
			{/* `fill` lets the logo scale into the card without pinning the <img> to a
			 * ratio that fights its own (which trips Next's aspect-ratio warning);
			 * object-contain keeps it proportional and the padding insets it. */}
			<Image
				src={logo}
				alt={label}
				fill
				// logos don't need optimising, and a raster one would otherwise route
				// through /_next/image, which has no sharp in this project
				unoptimized
				className={cn("object-contain fl-p-2/8 grayscale-100", light && "brightness-0")}
			/>
		</a>
	)
}

/** A static strip of affiliation logos, two equal columns on mobile. The
 * variable-length supporter rows flow at a fluid floor width from `sm` up so they
 * stay legible and wrap rather than shrink. Pass `even` for the fixed six-strong
 * GLAM family: an even 2 → 3 → 6 column grid keeps all six on one desktop row. */
function LogoRow({ logos, even }: { logos: ReadonlyArray<LogoItem>; even?: boolean }) {
	return (
		<ul
			className={cn(
				"grid grid-cols-2 gap-1",
				even ? "sm:grid-cols-3 lg:grid-cols-6" : "sm:flex sm:flex-wrap",
			)}
		>
			{logos.map((item) => (
				<li key={item.label} className={cn(!even && "sm:fl-w-36/56 sm:shrink-0")}>
					<LogoLink logo={item.logo} label={item.label} url={item.url} light={item.light} />
				</li>
			))}
		</ul>
	)
}

export function Footer() {
	const { footer } = museum
	const family: Array<LogoItem> = glamFamily.map((institution) => ({
		logo: institution.logo,
		label: institution.label,
		url: institution.url,
		light: "light" in institution ? institution.light : undefined,
	}))
	const supporters: Array<LogoItem> = footer.partners.map((key) => partners[key])

	return (
		<footer role="contentinfo" className="bg-background text-sm text-foreground">
			{/* logo column + sitemap, derived from the primary nav */}
			<div className="border-t border-border py-gap">
				<div className="mx-auto grid max-w-wrap grid-cols-1 gap-x-8 gap-y-12 px-[5vw] lg:grid-cols-12">
					<div className="lg:col-span-3">
						<a
							href="https://www.ox.ac.uk/"
							title="University of Oxford"
							className="inline-block transition-opacity hover:opacity-80"
						>
							<Image
								src={oxfordLogo}
								alt="University of Oxford"
								unoptimized
								className="fl-h-20/32 w-auto"
							/>
						</a>
					</div>
					<nav
						aria-label={`${museum.name} footer`}
						className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3"
					>
						{columns.map((column) => (
							<div key={column.heading}>
								<h2 className="mb-4 text-xl font-semibold">
									{column.href ? (
										<FootLink href={resolveHref(column.href)}>{column.heading}</FootLink>
									) : (
										column.heading
									)}
								</h2>
								{column.links.length > 0 && (
									<ul className="flex flex-col gap-2">
										{column.links.map((link) => (
											<li key={link.label}>
												<FootLink href={resolveHref(link.href ?? "")}>
													{link.label}
												</FootLink>
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</nav>
				</div>
			</div>

			{/* connect with us — social marks + newsletter */}
			<div className="border-t border-border py-10">
				<div className="mx-auto grid max-w-wrap grid-cols-1 gap-6 px-[5vw] lg:grid-cols-12 lg:items-center">
					<h2 className="text-2xl font-semibold lg:col-span-3">Connect with us</h2>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-9">
						{footer.social.length > 0 && (
							<ul className="flex flex-wrap gap-5">
								{footer.social.map(({ platform, href }) => {
									const { Icon, label } = socials[platform]
									return (
										<li key={platform}>
											<Button
												rounded="full"
												className="aspect-square [&_svg]:size-6"
												href={href}
												aria-label={label}
											>
												<Icon aria-hidden />
											</Button>
										</li>
									)
								})}
								{footer.newsletter && (
									<li>
										<Button
											rounded="full"
											className="aspect-square [&_svg]:size-6"
											href={resolveHref(footer.newsletter)}
											aria-label="Sign up to our newsletter"
										>
											<MailCheckIcon aria-hidden />
										</Button>
									</li>
								)}
							</ul>
						)}
					</div>
				</div>
			</div>

			{/* Gardens, Libraries & Museums family + funder / platform logos */}
			<div className="border-t border-border py-10">
				<div className="mx-auto grid max-w-wrap gap-8 px-[5vw]">
					<div className="grid gap-5">
						<h2 className="text-xs font-semibold tracking-wider text-foreground/60 uppercase">
							Part of Gardens, Libraries &amp; Museums
						</h2>
						<LogoRow logos={family} even />
					</div>
					{supporters.length > 0 && (
						<div className="grid gap-5">
							<h2 className="text-xs font-semibold tracking-wider text-foreground/60 uppercase">
								With support from
							</h2>
							<LogoRow logos={supporters} />
						</div>
					)}
				</div>
			</div>

			{/* copyright bar — Oxford Mosaic credit, then legal links + copyright */}
			<div className="accented">
				<div className="mx-auto grid max-w-wrap gap-5 px-[5vw] fl-py-4/9">
					<a
						href="https://www.mosaic.ox.ac.uk/"
						aria-label="Powered by Oxford Mosaic"
						className="justify-self-start opacity-80 transition-opacity hover:opacity-100"
					>
						<OxfordMosaicLogo className="fl-h-10/12 w-auto" />
					</a>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<small>
							© {new Date().getFullYear()} {museum.name}
						</small>
						{footer.legal.length > 0 && (
							<ul className="flex flex-wrap gap-x-5 gap-y-2 lg:ml-auto">
								{footer.legal.map((link) => (
									<li key={link.label}>
										<Button variant="link" href={resolveHref(link.href)}>
											{link.label}
										</Button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</footer>
	)
}
