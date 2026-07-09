import {
	CollectionBreadcrumbs,
	CollectionBreadcrumbsFallback,
} from "$components/collection-breadcrumbs"
import { Button } from "$components/button"
import { List } from "$components/list"
import { FurtherItems } from "$components/further-items"
import { RelatedItems } from "$components/related-items"
import { ImageViewer } from "$components/image-viewer"
import { ImageDownloads } from "$components/image-downloads"
import { RichText } from "$components/rich-text"
import type { Props } from "../item/[id]/[[...slug]]/page"
import type { FurtherItemsSection } from "$library/further-items"
import Link from "next/link"
import { Suspense } from "react"

export function CollectionObjectLayout({
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
	recordDescription,
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
	photographicProcess,
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
	associatedPublications,
	searchTerms,
	referenceURL,
	description,
	literatureVirtualField,
	imageRights,
	imageDownloads,
	related,
	furtherItems,
}: Props & { related?: FurtherItemsSection; furtherItems?: FurtherItemsSection }) {
	const breadcrumbClassName = "border-b border-b-current/10 pl-[5vw] text-sm"

	return (
		<div className="flex flex-col">
			{/* The "Collections Online" crumb doubles as the back link — it resolves the
			 * visitor's `?return=` search results on the client, so it sits inside a
			 * Suspense boundary to keep the page statically prerenderable. */}
			<Suspense
				fallback={
					<CollectionBreadcrumbsFallback title={title} className={breadcrumbClassName} />
				}
			>
				<CollectionBreadcrumbs title={title} className={breadcrumbClassName} />
			</Suspense>
			{/* plain hero: the brand colour stays up in the site header (the museums
			 * asked that it not extend down behind the object) */}
			<header className="px-[5vw] py-12">
				<div className="grid gap-4">
					<h1 className="mx-auto max-w-7xl text-center text-5xl font-semibold text-balance">
						{title}
					</h1>
					<h2 className="text-center text-2xl font-semibold text-current/80">{subTitle}</h2>
					{onDisplay && <p className="text-center text-sm">On display</p>}
					<hr className="mx-auto w-10 opacity-20" />
					<span className="text-center font-mono text-xs tracking-wider text-current/80">
						{objectNumber}
					</span>
				</div>
			</header>
			<div className="bg-background px-[5vw]">
				{images?.length ? (
					<figure className="grid gap-3">
						<ImageViewer label={title} images={images} />
						{(imageCopyright || imageRights) && (
							<figcaption className="mx-auto grid max-w-3xl gap-1 text-center text-xs text-pretty">
								{imageCopyright && <RichText className="gap-1">{imageCopyright}</RichText>}
								{imageRights?.notPrmCopyright && (
									<p>
										Copyright of this material is not held by the museum, please contact
										us for further information
									</p>
								)}
								{imageRights && (
									<>
										<p>
											<Button
												variant="link"
												href={imageRights.termsHref}
												className="font-semibold text-link"
											>
												Terms and Conditions
											</Button>
										</p>
										<p>
											If you wish to order a high-resolution image and/or licence its use
											for print or web publication, exhibition, film, promotional product
											or any other use, whether in the academic or commercial sector of
											any print run, then please visit{" "}
											<Button
												variant="link"
												href={imageRights.photographicServicesHref}
												className="font-semibold text-link"
											>
												photographic services
											</Button>
											.
										</p>
									</>
								)}
							</figcaption>
						)}
						{imageDownloads?.length ? <ImageDownloads images={imageDownloads} /> : null}
					</figure>
				) : null}
				<article className="grid gap-gap pt-gap">
					<section className="mx-auto grid w-full max-w-wrap-small gap-8">
						<dl className="grid grid-cols-[auto_60%] gap-y-1 text-sm [&_a]:animated-underline [&_a]:font-semibold [&_a]:text-link [&_a]:hover:[--underline-w:100%] [&_dd]:col-start-2 [&_dd]:min-w-0 [&_dd]:justify-self-stretch [&_dd]:wrap-anywhere [&_dd]:whitespace-pre-line [&_dt]:col-start-1 [&_dt]:self-start [&_dt]:font-bold [&_dt]:text-primary [&>div]:col-span-full [&>div]:grid [&>div]:grid-cols-subgrid [&>div]:justify-items-start [&>div]:gap-x-4 [&>div]:gap-y-1 [&>div]:rounded-md [&>div]:px-4 [&>div]:py-3 [&>div]:odd:bg-primary/10">
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

							{recordDescription && (
								<div>
									<dt>Description</dt>
									<dd>{recordDescription}</dd>
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
											<a className="rounded" href={s.href}>
												{s.label}
											</a>
										</dd>
									))}
								</div>
							)}

							{itemType && (
								<div>
									<dt>Item type</dt>
									<dd>
										<a className="rounded" href={itemType.href}>
											{itemType.label}
										</a>
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
											<a className="rounded" href={g.href}>
												{g.label}
											</a>
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
											<a className="rounded" href={p.href}>
												{p.name}
											</a>
										</dd>
									))}
								</div>
							)}

							{datePeriod && (
								<div>
									<dt>Date</dt>
									{datePeriod.map((d, index) => (
										<dd key={index}>
											{d?.period ? (
												<Link className="rounded" href={d.link}>
													{d.period}
												</Link>
											) : (
												d?.from
											)}
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
													<a className="rounded" href={m.href}>
														{m.label}
													</a>
													{index < materialsList.length - 1 ? ", " : ""}
												</span>
											))}
										</dd>
									)}
								</div>
							)}

							{photographicProcess && (
								<div>
									<dt>Photographic process</dt>
									{photographicProcess.map((p, index) => (
										<dd key={index}>
											<a className="rounded" href={p.href}>
												{p.label}
											</a>
										</dd>
									))}
								</div>
							)}

							{physicalMaterial && (
								<div>
									<dt>Physical material</dt>
									{physicalMaterial.map((m, index) => (
										<dd key={index}>
											<a className="rounded" href={m.href}>
												{m.label}
											</a>
										</dd>
									))}
								</div>
							)}

							{physicalMedium && (
								<div>
									<dt>Physical medium</dt>
									{physicalMedium.map((m, index) => (
										<dd key={index}>
											<a className="rounded" href={m.href}>
												{m.label}
											</a>
										</dd>
									))}
								</div>
							)}

							{physicalTechnique && (
								<div>
									<dt>Physical technique</dt>
									{physicalTechnique.map((m, index) => (
										<dd key={index}>
											<a className="rounded" href={m.href}>
												{m.label}
											</a>
										</dd>
									))}
								</div>
							)}

							{objectType && (
								<div>
									<dt>{labels.objectType}</dt>
									{objectType.map((o, index) => (
										<dd key={index}>
											{"links" in o ? <List links={o.links} /> : o.text}
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
									<dd>
										<RichText>{researchAndResponses}</RichText>
									</dd>
								</div>
							)}

							{associatedPublications && (
								<div>
									<dt>Associated publications</dt>
									{associatedPublications.map((publication, index) => (
										<dd key={index}>{publication}</dd>
									))}
								</div>
							)}

							{referenceURL && (
								<div>
									<dt>Reference URL</dt>
									<dd>
										<a href={referenceURL} className="block truncate rounded">
											{referenceURL}
										</a>
									</dd>
								</div>
							)}
						</dl>
						{searchTerms && (
							<p className="mt-10 text-sm text-pretty">
								<span>Search terms: </span>
								{searchTerms.map((term, index) => (
									<span key={term.label}>
										{index > 0 && ", "}
										<Button
											variant="link"
											href={term.href}
											className="font-semibold text-link"
										>
											{term.label}
										</Button>
									</span>
								))}
							</p>
						)}
					</section>
					{literatureVirtualField && (
						<section className="mx-auto grid w-full max-w-wrap-small gap-8 border-t border-border pt-12">
							<h2 className="text-center text-2xl font-semibold">Further reading</h2>
							<p
								className="whitespace-pre-line [&_a]:font-semibold [&_a]:text-link"
								dangerouslySetInnerHTML={{ __html: literatureVirtualField }}
							></p>
						</section>
					)}
					{description && (
						<section className="mx-auto grid w-full max-w-wrap-small gap-8 border-t border-border pt-gap">
							<h2 className="text-center text-2xl font-semibold">Description</h2>
							<RichText>{description}</RichText>
						</section>
					)}
					{related && (
						// curated, museum-authored links — kept in-column (not the full-bleed
						// band below) so it reads as part of the record rather than discovery
						<section className="mx-[-5vw] border-t border-border px-[5vw] pt-gap-sm">
							<RelatedItems {...related} />
						</section>
					)}
					{furtherItems && (
						// full-bleed band tinted with the museum accent (cf. ox.ac.uk's
						// "Explore" band); FurtherItems renders its own heading + button row
						<section className="mx-[-5vw] bg-primary/12 px-[5vw] py-gap">
							<FurtherItems {...furtherItems} />
						</section>
					)}
				</article>
			</div>
		</div>
	)
}
