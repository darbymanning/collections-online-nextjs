import { museum } from "./config"

export const list = {
	readable(list: Array<string>): string {
		return new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(list)
	},
}

export type BackLink = {
	href: string
	label: string
}

const defaultBackLink = (): BackLink => ({
	href: String(museum.urls.legacy.simpleSearch),
	label: "Back to search",
})

function normalizedPathname(url: URL): string {
	return url.pathname.replace(/\/+/g, "/") || "/"
}

function isAllowedLegacyReturn(url: URL, legacy: URL): boolean {
	if (url.protocol !== "https:") return false
	if (url.origin !== legacy.origin) return false

	const pathname = normalizedPathname(url)
	return pathname === legacy.pathname || pathname.startsWith(`${legacy.pathname}/`)
}

/** Legacy links should pass `?return=` with `encodeURIComponent(window.location.href)`. */
export function legacyBackLink(returnUrl: string | null | undefined): BackLink {
	if (!returnUrl) return defaultBackLink()

	try {
		const url = new URL(returnUrl)
		const legacy = museum.urls.legacy.collectionsOnline

		if (isAllowedLegacyReturn(url, legacy)) {
			return {
				href: returnUrl,
				label: "Back to search results",
			}
		}
	} catch {
		// ignore malformed return URLs
	}

	return defaultBackLink()
}
