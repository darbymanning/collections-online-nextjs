"use client"

import type { FurtherItem, FurtherItemsSection } from "$library/further-items"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

/** The curated "Related" grid: card tiles like the discovery carousel,
 * but static and wrapping (4→3→2→1 columns) with the caption always visible
 * below each image — these are specific, museum-authored links, so they read as
 * a fixed set of records rather than an endlessly browsable carousel. */
export function RelatedItems({ title, items }: FurtherItemsSection) {
	const [failed, setFailed] = useState<Set<FurtherItem["id"]>>(new Set())

	const fail = (id: FurtherItem["id"]) =>
		setFailed((ids) => (ids.has(id) ? ids : new Set(ids).add(id)))

	return (
		<div className="grid gap-6" data-testid="related-items">
			<h2 className="text-2xl font-semibold text-primary">{title}</h2>
			<ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{items.map((item) => {
					const hasImage = item.image && !failed.has(item.id)

					return (
						<li key={item.id}>
							<Link href={item.href} className="group block no-underline">
								<span className="block aspect-4/3 overflow-hidden rounded-2xl">
									{hasImage ? (
										<img
											src={item.image}
											alt=""
											loading="lazy"
											decoding="async"
											className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
											// images that 404 before hydration never fire onError
											ref={(img) => {
												if (img?.complete && img.naturalWidth === 0) fail(item.id)
											}}
											onError={() => fail(item.id)}
										/>
									) : (
										// no-image fallback: accent card with a muted icon
										<span className="grid size-full place-items-center bg-primary text-[3rem] text-on-accent/40">
											<ImageOff strokeWidth={1} aria-hidden />
										</span>
									)}
								</span>
								<span className="mt-3 block">
									<span className="block text-base leading-snug font-semibold text-primary">
										<span className="animated-underline group-hover:[--underline-w:100%]">
											{item.title}
										</span>
									</span>
									{item.subTitle && (
										<span className="mt-1 line-clamp-3 block text-sm text-pretty text-foreground/75">
											{item.subTitle}
										</span>
									)}
									{item.objectNumber && (
										<span className="mt-1.5 block font-mono text-xs tracking-wider text-foreground/55">
											{item.objectNumber}
										</span>
									)}
								</span>
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
