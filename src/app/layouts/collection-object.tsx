"use client"

import { List } from "$components/list"
import type { Props } from "../item/[id]/[[...slug]]/page"
import Link from "next/link"

export function CollectionObjectLayout({
	title,
	geographicalProvenance,
	datePeriod,
	objectNumbers,
}: Props) {
	// styled-jsx's class injection is dropped by React Compiler memoization,
	// so this component must opt out of it
	"use no memo"

	return (
		<article>
			<header>
				<h1 className="title">{title}</h1>
				<span className="object-numbers">{objectNumbers}</span>
				<figure />
			</header>
			<section>
				<h2 className="details-title">Details</h2>
				<dl>
					<dt>Title</dt>
					<dd>{title}</dd>

					<dt>Associated place</dt>
					{geographicalProvenance.map((p, index) => (
						<dd key={index}>
							<List links={p.links} association={p.association} />
						</dd>
					))}
					<dt>Date</dt>
					{datePeriod.map((d, index) => (
						<dd key={index}>
							<Link href={d.link}>{d.period}</Link> ({d.type})
						</dd>
					))}
				</dl>
			</section>
			<style jsx>{`
				article {
					display: grid;
					gap: 3rem;
				}

				header {
					display: grid;
					gap: 1rem;
				}

				.title {
					font: 600 var(--f-h1);
					text-align: center;
				}

				.object-numbers {
					font: 700 var(--f-h6);
				}

				figure {
					height: 34rem;
					background: var(--c-gray);
				}

				.details-title {
					font: 600 var(--f-h3);
					text-align: center;
				}

				section {
					max-width: var(--s-wrap-small);
					margin: 0 auto;
					display: grid;
					gap: 2rem;
				}

				dl {
					display: grid;
					grid-template-columns: auto 60%;
					gap: 1rem;
				}

				dt {
					font-weight: 700;
				}
			`}</style>
		</article>
	)
}
