import { cn } from "$library/utils"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import type { ReactElement } from "react"

export type Crumb = {
	label: string
	/** Omit on the final crumb — it's the current page, rendered as plain text. */
	href?: string
	/** Render this icon in place of the label text (e.g. a home icon). `label`
	 * still provides the accessible name via `aria-label`. */
	icon?: ReactElement
}

/** Visible breadcrumb trail for the accent header band (white text on accent).
 * The matching `BreadcrumbList` structured data is emitted alongside the object
 * JSON-LD on the page, so this only renders the on-page navigation. */
export function Breadcrumbs({
	items,
	className,
}: {
	items: Array<Crumb>
	className?: string
}): ReactElement {
	return (
		<nav aria-label="Breadcrumb" className={className}>
			<ol className="grid scroll-fade grid-flow-col items-center justify-start gap-x-2 gap-y-1 py-3 pr-4 whitespace-nowrap clip-focus">
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={index} className="flex items-center gap-x-2">
							{item.href && !isLast ? (
								<Link
									href={item.href}
									aria-label={item.icon ? item.label : undefined}
									className={cn(
										{ "transition-opacity hover:opacity-70": item.icon },
										{
											"animated-underline font-medium hover:[--underline-w:100%]":
												!item.icon,
										},
										"rounded p-1",
									)}
								>
									{item.icon ?? item.label}
								</Link>
							) : (
								<span
									aria-current={isLast ? "page" : undefined}
									aria-label={item.icon ? item.label : undefined}
									className="text-current/70"
								>
									{item.icon ?? item.label}
								</span>
							)}
							{!isLast && <ChevronRightIcon className="opacity-50" />}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
