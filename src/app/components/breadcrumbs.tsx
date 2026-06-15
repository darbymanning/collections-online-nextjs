import Link from "next/link"
import type { ReactElement } from "react"

export type Crumb = {
	label: string
	/** Omit on the final crumb — it's the current page, rendered as plain text. */
	href?: string
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
			<ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={index} className="flex items-center gap-x-2">
							{item.href && !isLast ? (
								<Link
									href={item.href}
									className="animated-underline font-medium hover:[--underline-w:100%]"
								>
									{item.label}
								</Link>
							) : (
								<span
									aria-current={isLast ? "page" : undefined}
									className="text-current/70"
								>
									{item.label}
								</span>
							)}
							{!isLast && (
								<span aria-hidden className="opacity-50">
									/
								</span>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
