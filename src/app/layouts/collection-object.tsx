"use client"

import { List } from "$components/list"
import { ImageViewer } from "$components/image-viewer"
import type { Props } from "../item/[id]/[[...slug]]/page"
import type { BackLink } from "$library/utils"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export function CollectionObjectLayout({
	backLink,
	labels,
	title,
	titleRow,
	subTitle,
	objectNumber,
	onDisplay,
	images,
	imageCopyright,
	collectionType,
	subcollection,
	longDescription,
	briefDescription,
	subject,
	itemType,
	geographicalProvenance,
	locality,
	culturalGroups,
	persons,
	datePeriod,
	datePeriodText,
	dateCollected,
	acquisitionInformation,
	provenance,
	primaryInscriptions,
	otherInscriptions,
	materialAndProcess,
	materialsList,
	physicalMaterial,
	physicalMedium,
	physicalTechnique,
	objectType,
	dimensions,
	numberOfItems,
	numberOfParts,
	creditLine,
	museumLocation,
	museumDepartment,
	inventoryNumber,
	accessionNumbers,
	otherNumbers,
	objectNumbersAll,
	researchAndResponses,
	referenceURL,
	description,
	literatureVirtualField,
}: Props & { backLink: BackLink }) {
	// styled-jsx's class injection is dropped by React Compiler memoization,
	// so this component must opt out of it
	"use no memo"

	return (
		<div className="collection-object">
			<a href={backLink.href} className="back-link">
				<ChevronLeft aria-hidden strokeWidth={2} />
				{backLink.label}
			</a>
			<article>
				<header>
					<h1 className="title">{title}</h1>
					<h2 className="sub-title">{subTitle}</h2>
					{onDisplay && <p className="on-display">On display</p>}
					<span className="object-numbers">{objectNumber}</span>
					{images?.length ? (
						<figure>
							<ImageViewer label={title} images={images} />
							{imageCopyright && <figcaption>{imageCopyright}</figcaption>}
						</figure>
					) : null}
				</header>
				<section>
					<h2 className="details-title">Details</h2>
					<dl>
						{titleRow && (
							<div>
								<dt>Title</dt>
								<dd>{titleRow}</dd>
							</div>
						)}

						{collectionType && (
							<div>
								<dt>{labels.collection}</dt>
								<dd>{collectionType}</dd>
							</div>
						)}

						{subcollection && (
							<div>
								<dt>Subcollection</dt>
								<dd>{subcollection}</dd>
							</div>
						)}

						{longDescription && (
							<div>
								<dt>Long description</dt>
								<dd>{longDescription}</dd>
							</div>
						)}

						{briefDescription && (
							<div>
								<dt>Brief Description</dt>
								<dd>{briefDescription}</dd>
							</div>
						)}

						{subject && (
							<div>
								<dt>Subject</dt>
								{subject.map((s, index) => (
									<dd key={index}>
										<a href={s.href}>{s.label}</a>
									</dd>
								))}
							</div>
						)}

						{itemType && (
							<div>
								<dt>Item type</dt>
								<dd>
									<a href={itemType.href}>{itemType.label}</a>
								</dd>
							</div>
						)}

						{geographicalProvenance && (
							<div>
								<dt>{labels.place}</dt>
								{geographicalProvenance.map((p, index) => (
									<dd key={index}>{p?.links ? <List {...p} /> : p?.region}</dd>
								))}
							</div>
						)}

						{locality && (
							<div>
								<dt>Locality</dt>
								{locality.map((l, index) => (
									<dd key={index}>{l}</dd>
								))}
							</div>
						)}

						{culturalGroups && (
							<div>
								<dt>Cultural groups</dt>
								{culturalGroups.map((g, index) => (
									<dd key={index}>
										<a href={g.href}>{g.label}</a>
									</dd>
								))}
							</div>
						)}

						{persons && (
							<div>
								<dt>{labels.persons}</dt>
								{persons.map((p, index) => (
									<dd key={index}>
										{p.role ? `${p.role} ` : ""}
										<a href={p.href}>{p.name}</a>
									</dd>
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

						{datePeriodText && (
							<div>
								<dt>Date / Period</dt>
								<dd>{datePeriodText}</dd>
							</div>
						)}

						{dateCollected && (
							<div>
								<dt>{labels.dateCollected}</dt>
								{dateCollected.map((date, index) => (
									<dd key={index}>{date}</dd>
								))}
							</div>
						)}

						{acquisitionInformation && (
							<div>
								<dt>Acquisition information</dt>
								<dd>{acquisitionInformation}</dd>
							</div>
						)}

						{provenance && (
							<div>
								<dt>Provenance</dt>
								<dd>{provenance}</dd>
							</div>
						)}

						{primaryInscriptions && (
							<div>
								<dt>Primary inscriptions</dt>
								<dd>{primaryInscriptions}</dd>
							</div>
						)}

						{otherInscriptions && (
							<div>
								<dt>Other inscriptions</dt>
								<dd>{otherInscriptions}</dd>
							</div>
						)}

						{(materialAndProcess || materialsList) && (
							<div>
								<dt>{labels.materials}</dt>
								{materialAndProcess?.map((m, index) => (
									<dd key={index}>
										{m.links ? <List links={m.links} prefix={m.text} /> : m.text}
									</dd>
								))}
								{materialsList && (
									<dd>
										{materialsList.map((m, index) => (
											<span key={index}>
												{m.type ? `${m.type} ` : ""}
												<a href={m.href}>{m.label}</a>
												{index < materialsList.length - 1 ? ", " : ""}
											</span>
										))}
									</dd>
								)}
							</div>
						)}

						{physicalMaterial && (
							<div>
								<dt>Physical material</dt>
								{physicalMaterial.map((m, index) => (
									<dd key={index}>
										<a href={m.href}>{m.label}</a>
									</dd>
								))}
							</div>
						)}

						{physicalMedium && (
							<div>
								<dt>Physical medium</dt>
								{physicalMedium.map((m, index) => (
									<dd key={index}>
										<a href={m.href}>{m.label}</a>
									</dd>
								))}
							</div>
						)}

						{physicalTechnique && (
							<div>
								<dt>Physical technique</dt>
								{physicalTechnique.map((m, index) => (
									<dd key={index}>
										<a href={m.href}>{m.label}</a>
									</dd>
								))}
							</div>
						)}

						{objectType && (
							<div>
								<dt>{labels.objectType}</dt>
								{objectType.map((o, index) => (
									<dd key={index}>{"links" in o ? <List links={o.links} /> : o.text}</dd>
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

						{numberOfParts && (
							<div>
								<dt>No. of Parts</dt>
								<dd>{numberOfParts}</dd>
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
								<dt>{labels.location}</dt>
								<dd>{museumLocation}</dd>
							</div>
						)}

						{museumDepartment && (
							<div>
								<dt>Museum department</dt>
								<dd>{museumDepartment}</dd>
							</div>
						)}

						{inventoryNumber && (
							<div>
								<dt>Inventory No</dt>
								<dd>{inventoryNumber}</dd>
							</div>
						)}

						{accessionNumbers?.length ? (
							<div>
								<dt>{labels.accession}</dt>
								{accessionNumbers.map((number, index) => (
									<dd key={index}>{number}</dd>
								))}
							</div>
						) : null}

						{otherNumbers && (
							<div>
								<dt>Number (Other Numbers)</dt>
								{otherNumbers.map((number, index) => (
									<dd key={index}>{number}</dd>
								))}
							</div>
						)}

						{objectNumbersAll && (
							<div>
								<dt>Object numbers</dt>
								<dd>{objectNumbersAll}</dd>
							</div>
						)}

						{researchAndResponses && (
							<div>
								<dt>Research and responses</dt>
								<dd>{researchAndResponses}</dd>
							</div>
						)}

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
				{literatureVirtualField && (
					<section>
						<h2 className="details-title">Further reading</h2>
						<p
							className="description"
							dangerouslySetInnerHTML={{ __html: literatureVirtualField }}
						></p>
					</section>
				)}
				{description && (
					<section>
						<h2 className="details-title">Description</h2>
						<p className="description">{description}</p>
					</section>
				)}
			</article>
			<style jsx>{`
				.back-link {
					display: inline-flex;
					align-items: center;
					gap: var(--s-4);
					margin-block-end: var(--s-48);
					padding: var(--s-8) var(--s-12);
					border-radius: var(--r-24);
					transition: background-color 0.2s ease-in-out;
					text-decoration: none;
					font: 600 var(--f-caption);

					&:hover {
						background-color: var(--c-gray-100);
					}
				}

				article {
					display: grid;
					gap: var(--s-48);
				}

				section + section {
					border-top: 1px solid var(--c-border);
					padding-block-start: var(--s-48);
				}

				header {
					display: grid;
					gap: var(--s-16);
				}

				.title {
					font: 600 var(--f-h1);
					text-align: center;
				}

				.sub-title {
					font: 600 var(--f-h2);
					text-align: center;
				}

				.on-display {
					text-align: center;
					font: var(--f-caption);
				}

				.object-numbers {
					font: 700 var(--f-h6);
				}

				figure {
					display: grid;
					gap: var(--s-12);
				}

				figcaption {
					text-align: center;
					white-space: pre-line;
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
					gap: var(--s-32);
				}

				dl {
					display: grid;
					grid-template-columns: auto 60%;
					gap: var(--s-16);
				}

				dl > div {
					grid-column: 1 / -1;
					display: grid;
					grid-template-columns: subgrid;
					gap: var(--s-8);
				}

				dt {
					grid-column: 1;
					align-self: start;
					font-weight: 700;
				}

				dd {
					grid-column: 2;
					white-space: pre-line;
				}

				.description {
					white-space: pre-line;
				}
			`}</style>
		</div>
	)
}
