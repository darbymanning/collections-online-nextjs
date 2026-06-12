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

/** When the visitor arrived from the legacy Collections Online app, send them back there. */
export function legacyBackLink(referrer: string | null | undefined): BackLink {
	if (!referrer) return defaultBackLink()

	try {
		const url = new URL(referrer)
		const legacy = museum.urls.legacy.collectionsOnline

		if (url.origin === legacy.origin && url.pathname.startsWith(legacy.pathname)) {
			return {
				href: referrer,
				label: "Back to search results",
			}
		}
	} catch {
		// ignore malformed referrers
	}

	return defaultBackLink()
}
