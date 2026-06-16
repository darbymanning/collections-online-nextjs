"use client"

import { Button } from "$components/button"
import { legacyBackLink, type BackLink } from "$library/utils"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { ReactElement } from "react"

function View({ href, label }: BackLink): ReactElement {
	return (
		<Button href={href} revealIcon className="mt-6 text-on-band" data-testid="back-link">
			<ArrowLeft aria-hidden />
			{label}
		</Button>
	)
}

/** Prerendered default, used as the Suspense fallback while the client resolves
 * the URL. Keeps a crawlable "Back to search" link in the static HTML. */
export function BackButtonFallback(): ReactElement {
	return <View {...legacyBackLink(null)} />
}

/** Resolves the `?return=` deep link on the client so the page itself stays
 * statically prerenderable (ISR). Must render inside a <Suspense> boundary —
 * reading `useSearchParams` is what would otherwise opt the route into dynamic
 * rendering. */
export function BackButton(): ReactElement {
	return <View {...legacyBackLink(useSearchParams().get("return"))} />
}
