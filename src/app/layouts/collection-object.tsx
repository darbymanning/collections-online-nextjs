import { Button } from "$components/button"
import { List } from "$components/list"
import { FurtherItems } from "$components/further-items"
import { ImageViewer } from "$components/image-viewer"
import type { Props } from "../item/[id]/[[...slug]]/page"
import type { FurtherItemsSection } from "$library/further-items"
import type { BackLink } from "$library/utils"
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
	furtherItems,
}: Props & { backLink: BackLink; furtherItems?: FurtherItemsSection }) {
	return (
		<div className="flex flex-col">
			{/* Accent header band: the museum colour bleeds up from <body> and the text
			 * reverses to white. The image viewer below is pulled up so its top half
			 * overlaps the band — the accent fills the top ~50% of the image before the
			 * page turns white at the seam (cf. ox.ac.uk/research). With no image the
			 * band just gets normal padding and flows straight into the white page. */}
			<header className={`px-[5vw] pt-6 text-white ${images?.length ? "pb-80" : "pb-12"}`}>
				<Button href={backLink.href} revealIcon className="back-link text-background">
					<svg aria-hidden>
						<use href="/sprite.svg#arrow-left" />
					</svg>
					{backLink.label}
				</Button>
				<div className="mt-8 grid gap-4">
					<h1 className="text-center text-5xl font-semibold">{title}</h1>
					<h2 className="text-center text-2xl font-semibold text-current/80">{subTitle}</h2>
					{onDisplay && <p className="on-display text-center text-sm">On display</p>}
					<span className="text-center text-lg font-bold text-current/80">{objectNumber}</span>
				</div>
			</header>
			<div className="bg-background px-[5vw] pb-[5vw]">
				{images?.length ? (
					// negative margin ≈ half the 34rem frame, so the viewer straddles the
					// seam: top half over the accent band, lower half on the white page
					<figure className="-mt-68 grid gap-3">
						<ImageViewer label={title} images={images} />
						{imageCopyright && (
							<figcaption className="text-center whitespace-pre-line text-xs">
								{imageCopyright}
							</figcaption>
						)}
					</figure>
				) : null}
				<article className="grid gap-12 pt-12">
					<section className="mx-auto grid w-full max-w-wrap-small gap-8">
						<h2 className="text-center text-2xl font-semibold">Details</h2>
						<dl className="grid text-sm grid-cols-[auto_60%] gap-y-1 [&>div]:col-span-full [&>div]:grid [&>div]:grid-cols-subgrid [&>div]:gap-x-4 [&>div]:gap-y-1 [&>div]:rounded-md [&>div]:px-4 [&>div]:py-3 [&_dd]:col-start-2 [&_dd]:min-w-0 [&_dd]:whitespace-pre-line [&_dt]:col-start-1 [&_dt]:self-start [&_dt]:font-bold [&>div]:odd:bg-accent/10">
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
									<dd>{researchAndResponses}</dd>
								</div>
							)}

							{referenceURL && (
								<div>
									<dt>Reference URL</dt>
									<dd>
										<a
											href={referenceURL}
											className="block overflow-hidden text-ellipsis whitespace-nowrap"
										>
											{referenceURL}
										</a>
									</dd>
								</div>
							)}
						</dl>
					</section>
					{literatureVirtualField && (
						<section className="mx-auto grid w-full max-w-wrap-small gap-8 border-t border-border pt-12">
							<h2 className="text-center text-2xl font-semibold">Further reading</h2>
							<p
								className="whitespace-pre-line"
								dangerouslySetInnerHTML={{ __html: literatureVirtualField }}
							></p>
						</section>
					)}
					{description && (
						<section className="mx-auto grid w-full max-w-wrap-small gap-8 border-t border-border pt-12">
							<h2 className="text-center text-2xl font-semibold">Description</h2>
							<p className="whitespace-pre-line">{description}</p>
						</section>
					)}
					{furtherItems && (
						// full-bleed band tinted with the museum accent (cf. ox.ac.uk's
						// "Explore" band); FurtherItems renders its own heading + button row
						<section className="mx-[-5vw] bg-accent/12 px-[5vw] py-12">
							<FurtherItems {...furtherItems} />
						</section>
					)}
				</article>
			</div>
		</div>
	)
}
