"use client"

import { museum } from "$library/config"
import type { FurtherItem, FurtherItemsSection } from "$library/further-items"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// styled-jsx's class injection is dropped by React Compiler memoization,
// so this component must opt out of it
export function FurtherItems({ items, description, more }: Omit<FurtherItemsSection, "title">) {
	"use no memo"

	const [failed, setFailed] = useState<Set<FurtherItem["id"]>>(new Set())
	const fail = (id: FurtherItem["id"]) =>
		setFailed((ids) => (ids.has(id) ? ids : new Set(ids).add(id)))

	return (
		<>
			{description && <p className="further-description">{description}</p>}
			<ul className="further-items" data-center={museum.ref === "ash" ? "" : undefined}>
				{items.map((item) => (
					<li key={item.id}>
						<Link href={item.href}>
							{item.image && !failed.has(item.id) ? (
								<img
									src={item.image}
									alt=""
									loading="lazy"
									decoding="async"
									// images that 404 before hydration never fire onError
									ref={(img) => {
										if (img?.complete && img.naturalWidth === 0) fail(item.id)
									}}
									onError={() => fail(item.id)}
								/>
							) : (
								<span className="no-image" aria-hidden>
									<ImageOff strokeWidth={1} />
								</span>
							)}
							<span className="item-title">{item.title}</span>
							{item.subTitle && <span className="item-subtitle">{item.subTitle}</span>}
						</Link>
					</li>
				))}
			</ul>
			{more && (
				<p className="further-more">
					<a href={more.href}>{more.label}</a>
				</p>
			)}
			<style jsx>{`
				.further-description {
					text-align: center;
				}

				.further-items {
					/* extend the scroll viewport across the body padding to the page
					 * edges so overflowing cards visibly bleed off the screen */
					--bleed: 5vw;
					list-style: none;
					margin: 0;
					display: flex;
					flex-wrap: nowrap;
					gap: var(--s-16);
					overflow-x: auto;
					overscroll-behavior-x: contain;
					scroll-snap-type: x mandatory;
					margin-inline: calc(-1 * var(--bleed));
					padding-inline: var(--bleed);
					scroll-padding-inline: var(--bleed);
					scrollbar-width: none;
				}

				.further-items::-webkit-scrollbar {
					display: none;
				}

				.further-items li {
					display: grid;
					/* three cards fill the section; further cards bleed off the edge */
					flex: 0 0 max(calc((100% - 2 * var(--s-16)) / 3), min(15rem, 80vw));
					scroll-snap-align: start;
					scroll-snap-stop: always;
				}

				.further-items li > :global(a) {
					display: grid;
					align-content: start;
					gap: var(--s-8);
					padding: var(--s-12);
					border: 1px solid var(--c-border);
					border-radius: var(--r-10);
					text-decoration: none;
					transition: background-color 0.2s ease-in-out;
				}

				.further-items li > :global(a:hover) {
					background-color: var(--c-gray-100);
				}

				.further-items img,
				.further-items .no-image {
					width: 100%;
					height: 11rem;
					object-fit: contain;
				}

				.further-items .no-image {
					display: grid;
					place-items: center;
					background-color: var(--c-gray-100);
					border-radius: var(--r-6);
					font-size: 2rem;
				}

				.further-items .item-title {
					font: 600 var(--f-h6);
				}

				.further-items .item-subtitle {
					font: var(--f-caption);
				}

				.further-items[data-center] :is(.item-title, .item-subtitle) {
					text-align: center;
				}

				.further-more {
					text-align: center;
					font: 600 var(--f-caption);
				}
			`}</style>
		</>
	)
}
