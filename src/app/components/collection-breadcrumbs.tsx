"use client"

import { Breadcrumbs } from "$components/breadcrumbs"
import { museum } from "$library/config"
import { collectionsOnlineHref } from "$library/utils"
import { HomeIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { ReactElement } from "react"

type Props = { title: string; className?: string }

function items(title: string, returnUrl: string | null | undefined) {
	return [
		{ label: "Home", href: museum.url.toString(), icon: <HomeIcon aria-hidden /> },
		// doubles as the back link: carries the visitor's `?return=` search results
		// when present, else the stable landing page (mirrors the BreadcrumbList JSON-LD)
		{ label: "Collections Online", href: collectionsOnlineHref(returnUrl) },
		{ label: title },
	]
}

/** Prerendered default used as the Suspense fallback while the client resolves
 * `?return=`. Keeps a crawlable Collections Online link in the static HTML. */
export function CollectionBreadcrumbsFallback({ title, className }: Props): ReactElement {
	return <Breadcrumbs className={className} items={items(title, null)} />
}

/** Resolves the visitor's `?return=` deep link on the client so the page stays
 * statically prerenderable (ISR). Must render inside a <Suspense> boundary —
 * reading `useSearchParams` is what would otherwise opt the route into dynamic
 * rendering. */
export function CollectionBreadcrumbs({ title, className }: Props): ReactElement {
	return (
		<Breadcrumbs className={className} items={items(title, useSearchParams().get("return"))} />
	)
}
