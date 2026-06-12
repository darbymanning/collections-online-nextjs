"use client"

import { List } from "$components/list"
import { IiifViewer } from "$components/iiif-viewer"
import type { Props } from "../item/[id]/[[...slug]]/page"
import Link from "next/link"

export function CollectionObjectLayout({
	title,
	subTitle,
	objectNumber,
	images,
	imageCopyright,
	geographicalProvenance,
	datePeriod,
	materialAndProcess,
	objectType,
	dimensions,
	numberOfItems,
	creditLine,
	museumLocation,
	museumDepartment,
	accessionNumbers,
	referenceURL,
}: Props) {
	// styled-jsx's class injection is dropped by React Compiler memoization,
	// so this component must opt out of it
	"use no memo"

	return (
		<article>
			<header>
				<h1 className="title">{title}</h1>
				<h2 className="sub-title">{subTitle}</h2>
				<span className="object-numbers">{objectNumber}</span>
				{images?.length ? (
					<figure>
						<IiifViewer label={title} images={images} />
						{imageCopyright && <figcaption>{imageCopyright}</figcaption>}
					</figure>
				) : null}
			</header>
			<section>
				<h2 className="details-title">Details</h2>
				<dl>
					<div>
						<dt>Title</dt>
						<dd>{title}</dd>
					</div>

					{geographicalProvenance && (
						<div>
							<dt>Associated place</dt>
							{geographicalProvenance.map((p, index) => (
								<dd key={index}>{p?.links ? <List {...p} /> : p?.region}</dd>
							))}
						</div>
					)}

					{datePeriod && (
						<div>
							<dt>Date</dt>
							{datePeriod.map((d, index) => (
								<dd key={index}>
									{d?.period ? <Link href={d.link}>{d.period}</Link> : d?.from}
								</dd>
							))}
						</div>
					)}

					{materialAndProcess && (
						<div>
							<dt>Material and technique</dt>
							{materialAndProcess.map((m, index) => (
								<dd key={index}>
									{m.links ? <List links={m.links} prefix={m.text} /> : m.text}
								</dd>
							))}
						</div>
					)}

					{objectType && (
						<div>
							<dt>Object type</dt>
							{objectType.map((o, index) => (
								<dd key={index}>
									<List {...o} />
								</dd>
							))}
						</div>
					)}

					{dimensions && (
						<div>
							<dt>Dimensions</dt>
							<dd>{dimensions}</dd>
						</div>
					)}

					{numberOfItems && (
						<div>
							<dt>No. of items</dt>
							<dd>{numberOfItems}</dd>
						</div>
					)}

					{creditLine && (
						<div>
							<dt>Credit line</dt>
							<dd>{creditLine}</dd>
						</div>
					)}

					{museumLocation && (
						<div>
							<dt>Museum location</dt>
							<dd>{museumLocation}</dd>
						</div>
					)}

					{museumDepartment && (
						<div>
							<dt>Museum department</dt>
							<dd>{museumDepartment}</dd>
						</div>
					)}

					{accessionNumbers?.length ? (
						<div>
							<dt>Accession no.</dt>
							{accessionNumbers.map((number, index) => (
								<dd key={index}>{number}</dd>
							))}
						</div>
					) : null}

					{referenceURL && (
						<div>
							<dt>Reference URL</dt>
							<dd>
								<a href={referenceURL}>{referenceURL}</a>
							</dd>
						</div>
					)}
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

				.sub-title {
					font: 600 var(--f-h2);
					text-align: center;
				}

				.object-numbers {
					font: 700 var(--f-h6);
				}

				figure {
					display: grid;
					gap: 0.75rem;
				}

				figcaption {
					text-align: center;
				}

				.details-title {
					font: 600 var(--f-h3);
					text-align: center;
				}

				section {
					max-width: var(--s-wrap-small);
					margin: 0 auto;
					width: 100%;
					display: grid;
					gap: 2rem;
				}

				dl {
					display: grid;
					grid-template-columns: auto 60%;
					gap: 1rem;
				}

				dl > div {
					grid-column: 1 / -1;
					display: grid;
					grid-template-columns: subgrid;
					gap: 0.5rem;
				}

				dt {
					grid-column: 1;
					align-self: start;
					font-weight: 700;
				}

				dd {
					grid-column: 2;
				}
			`}</style>
		</article>
	)
}
