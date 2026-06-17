import { museum } from "./config"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge conditional class names, with later Tailwind utilities winning over
 * earlier conflicting ones (the shadcn `cn` helper). */
export function cn(...inputs: Array<ClassValue>): string {
	return twMerge(clsx(inputs))
}

export const list = {
	readable(list: Array<string>): string {
		return new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(list)
	},
}

/** Swaps an image filename's extension for an S3 derivative suffix,
 * e.g. "MIN.28380_001.jpg" → "MIN.28380_001.1000x1000.jpg" */
export function derivative(url: string, suffix: string) {
	return url.replace(/\.[^.]+$/, `${suffix}.jpg`)
}

function normalizedPathname(url: URL): string {
	return url.pathname.replace(/\/+/g, "/") || "/"
}

function isAllowedLegacyReturn(url: URL, legacy: URL): boolean {
	if (url.protocol !== "https:") return false
	if (url.origin !== legacy.origin) return false

	const pathname = normalizedPathname(url)
	return pathname === legacy.pathname || pathname.startsWith(`${legacy.pathname}/`)
}

/** Resolve where the "Collections Online" breadcrumb points. Legacy links pass
 * `?return=` set to `encodeURIComponent(window.location.href)` to send a visitor
 * back to the search results they came from; anything that isn't a Collections
 * Online URL falls back to the stable landing page (which the BreadcrumbList
 * JSON-LD also points at). */
export function collectionsOnlineHref(returnUrl: string | null | undefined): string {
	const landing = museum.urls.legacy.collectionsOnline
	if (!returnUrl) return String(landing)

	try {
		const url = new URL(returnUrl)
		if (isAllowedLegacyReturn(url, landing)) return returnUrl
	} catch {
		// ignore malformed return URLs
	}

	return String(landing)
}
