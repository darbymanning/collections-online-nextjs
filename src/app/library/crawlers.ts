/** Crawler policy for `robots.txt`.
 *
 * The goal is to stay open to the bots that send us visitors — search engines
 * and the AI answer engines that cite sources and link back (AGO) — while
 * turning away the SEO-intel and content-harvester bots that spend crawl budget
 * without ever sending a reader our way.
 *
 * These lists are deliberately just data: to welcome or block another bot, add
 * its user-agent token here. Search engines themselves (Googlebot, Bingbot,
 * DuckDuckBot, …) need no entry — they're covered by the catch-all `*` rule. */

/** AI answer/assistant crawlers we explicitly welcome. Each of these surfaces
 * sources with attribution and a link, so indexing here feeds discovery rather
 * than silent training. Listing them keeps the intent visible in the generated
 * robots.txt and means they stay allowed even if the catch-all is ever
 * tightened. */
export const aiCrawlers = [
	"OAI-SearchBot", // ChatGPT search results
	"ChatGPT-User", // ChatGPT browsing on a user's request
	"GPTBot", // OpenAI index/training crawler
	"ClaudeBot", // Anthropic
	"Claude-SearchBot",
	"Claude-User",
	"anthropic-ai",
	"PerplexityBot", // Perplexity index
	"Perplexity-User",
	"Google-Extended", // grounding for Gemini and Google AI Overviews
	"Applebot-Extended", // Apple Intelligence
	"DuckAssistBot", // DuckDuckGo AI answers
	"MistralAI-User",
	"cohere-ai",
] as const

/** Aggressive SEO-intelligence and content-scraping bots. They harvest the
 * catalogue for backlink databases and resale without driving search or AI
 * discovery, so they're disallowed outright. */
export const blockedCrawlers = [
	"AhrefsBot",
	"SemrushBot",
	"DotBot", // Moz
	"MJ12bot", // Majestic
	"DataForSeoBot",
	"BLEXBot",
	"Barkrowler", // Babbar
	"serpstatbot",
	"ZoominfoBot",
	"magpie-crawler",
	"Bytespider", // ByteDance — notoriously heavy, ignores crawl-delay
] as const
