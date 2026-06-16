import type { MetadataRoute } from "next"
import { museum } from "$library/config"
import { aiCrawlers, blockedCrawlers } from "$library/crawlers"

/** Per-museum `robots.txt`.
 *
 * Robots rules are matched per user-agent by longest match, so a bot named in
 * its own group follows that group and ignores the catch-all `*`. */
export default function robots(): MetadataRoute.Robots {
	// Opted-out museums (Pitt Rivers) rely on the page-level `noindex` (meta tag
	// plus `X-Robots-Tag`) to stay out of search — that's the only signal that
	// actually de-indexes a page. A blanket `Disallow: /` would be
	// counter-productive: it stops crawlers fetching the page, so they never see
	// the noindex and Google can still list a bare URL it found via inbound
	// links. So we keep pages crawlable here and let noindex do the work, while
	// still turning away the scraper blocklist.
	if (!museum.indexable) {
		return {
			rules: [
				{ userAgent: [...blockedCrawlers], disallow: "/" },
				{ userAgent: "*", allow: "/" },
			],
		}
	}

	// Sitemaps are generated and hosted outside this app — the backend indexing
	// stack writes the XML to static storage and we just point crawlers at it (see
	// docs/seo-options.md). `SITEMAP_URL` carries the absolute URL(s) of that
	// external sitemap (or sitemap index), set per deployment; for the Phase 0 POC
	// it points at a small hand-written sitemap hosted separately. Comma-separate
	// to advertise several files.
	const sitemap = (process.env.SITEMAP_URL ?? "")
		.split(",")
		.map((url) => url.trim())
		.filter(Boolean)

	return {
		rules: [
			// AI answer engines we welcome (AGO) — explicit, so intent is visible
			{ userAgent: [...aiCrawlers], allow: "/" },
			// SEO-intel and content-harvester scrapers
			{ userAgent: [...blockedCrawlers], disallow: "/" },
			// everyone else, incl. Googlebot/Bingbot, may crawl everything
			{ userAgent: "*", allow: "/" },
		],
		...(sitemap.length > 0 && { sitemap }),
	}
}
