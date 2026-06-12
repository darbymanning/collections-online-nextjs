import type { Metadata } from "next"
import { api } from "$library/api"
import { slugify } from "$library/slug"
import { CollectionObjectLayout } from "$layouts/collection-object"
import type { CollectionObject, IIIFManifest } from "$library/types"
import { museum } from "$library/config"

type Params = {
	params: Promise<{
		id: CollectionObject["id"]
		// cosmetic only — never read, just makes URLs human-friendly
		slug?: Array<string>
	}>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { id } = await params
	const object = await api.getCollectionObject(id)

	// If the title is the same as the object number, use the record subtitle instead
	const title =
		object.recordTitle !== object.objectNumberSorting1
			? object.recordTitle
			: object.recordSubtitle

	return {
		title,
		alternates: {
			canonical: `/item/${id}/${slugify(title)}`,
		},
	}
}

function links(str: string, filter: string) {
	const base = [museum.urls.legacy.simpleSearch, filter].join("/")
	const parts = str.split(" > ")

	return parts.map((label, index) => ({
		label,
		href: encodeURI(base + parts.slice(0, index + 1).join(" > ")),
	}))
}

/** One search link per value, e.g. hsm's "Cardboard" → `physical.material:Cardboard` */
function searchLinks(values: Array<string> | undefined, filter: string) {
	if (!values?.length) return undefined

	return values.map((label) => ({
		label,
		href: encodeURI(`${museum.urls.legacy.simpleSearch}/${filter}${label}`),
	}))
}

function bySort(a: { sort?: string }, b: { sort?: string }) {
	return Number(a.sort ?? 0) - Number(b.sort ?? 0)
}

function materials(materialAndProcess: CollectionObject["materialAndProcess"]) {
	const values: Array<{ text?: string; links?: ReturnType<typeof links> }> = []
	// Ancestors of earlier vocabulary trails carry into later ones, e.g. the
	// technique "glazed > tin-glazed" expands to "processed material > glazed > tin-glazed"
	const trail: ReturnType<typeof links> = []
	// Display text without a vocabulary prefixes the next vocabulary value,
	// e.g. "ceramic, with tin glaze" + "processed material > ceramic"
	let text: string | undefined

	const sorted = materialAndProcess?.toSorted(bySort) ?? []

	for (const item of sorted) {
		if (item.previewVoc) {
			const parts = links(item.previewVoc, "materialAndProcess.previewVoc:")
			values.push({ text, links: [...trail, ...parts] })
			trail.push(...parts.slice(0, -1))
			text = undefined
		} else if (item.previewTxt) {
			if (text) values.push({ text })
			text = item.previewTxt
		}
	}

	if (text) values.push({ text })

	return values.length ? values : undefined
}

/** Swaps an image filename's extension for an S3 derivative suffix,
 * e.g. "MIN.28380_001.jpg" → "MIN.28380_001.1000x1000.jpg" */
function derivative(url: string, suffix: string) {
	return url.replace(/\.[^.]+$/, `${suffix}.jpg`)
}

/** hsm dimensions are structured values with separate units, e.g. "Weight: 91g" */
function dimensionLines(dimensions: CollectionObject["dimensions"]) {
	if (!dimensions) return undefined

	const measurements = [
		["Diameter", dimensions.diameter[0], dimensions.unitLength[0]],
		["Height", dimensions.height[0], dimensions.unitLength[0]],
		["Width", dimensions.width[0], dimensions.unitLength[0]],
		["Depth", dimensions.depth[0], dimensions.unitLength[0]],
		["Weight", dimensions.weight[0], dimensions.unitWeight[0]],
	] as const

	const lines = measurements
		.filter(([, value, unit]) => value != null && unit)
		.map(([label, value, unit]) => `${label}: ${value}${unit}`)

	return lines.length ? lines.join("\n") : undefined
}

/** Images for museums without a DAMs (oum/hsm) come straight from S3 multimedia paths. */
function multimediaImages(object: CollectionObject) {
	if (!("multimedia" in museum)) return undefined

	const base = museum.multimedia

	const images = object.multimedia.flatMap((m) => {
		if (m.mimeType !== "image" || !m.path || !m.identifier) return []
		if (/\.tiff?$/.test(m.identifier)) return []

		const url = derivative(`${base}${m.path}${m.identifier}`, ".1000x1000")

		return [{ url, thumbnail: url }]
	})

	return images.length ? images : undefined
}

export function props(object: CollectionObject, iiif: IIIFManifest | null) {
	const imageCopyright = iiif?.requiredStatement?.value.en[0]

	// rights live on the multimedia entries for museums without a DAMs
	const rights = object.multimedia.find((m) => m.rights?.rightsAcknowledgement)?.rights
	const multimediaCopyright =
		[
			rights?.rightsAcknowledgement && `Acknowledgement: ${rights.rightsAcknowledgement}`,
			rights?.rightsConditions && `Conditions: ${rights.rightsConditions}`,
		]
			.filter(Boolean)
			.join("\n") ||
		// hsm assets without explicit rights default to the museum's acknowledgement
		(museum.ref === "hsm" && object.identifier?.inventoryNo
			? `Acknowledgement: © ${museum.name}, University of Oxford, inv.${object.identifier.inventoryNo}`
			: undefined)

	const persons = object.persons?.toSorted(bySort).flatMap((p) => {
		const name =
			p.primaryName ??
			p.displayName ??
			p.fullName ??
			[p.firstName, p.lastName].filter(Boolean).join(" ")
		if (!name) return []
		return [
			{
				role: p.role,
				name,
				// hsm parties have no search id and are found by name instead
				href: encodeURI(
					p.id
						? `${museum.urls.legacy.simpleSearch}/persons.id:${p.id}`
						: `${museum.urls.legacy.simpleSearch}/persons.fullName:${name}`,
				),
			},
		]
	})

	// prm material/process entries are flat indexed terms rather than trails
	const materialsList = object.materialAndProcess?.flatMap((m) => {
		const key = m.materialIndex ? "materialIndex" : m.processIndex ? "processIndex" : undefined
		if (!key) return []
		return [
			{
				type: m.type,
				label: m[key]!,
				href: encodeURI(
					`${museum.urls.legacy.simpleSearch}/materialAndProcess.${key}:${m[key]}`,
				),
			},
		]
	})

	return {
		// field labels differ between the museums' live sites
		labels: {
			place: museum.ref === "prm" ? "Geographical reference" : "Associated place",
			materials: museum.ref === "prm" ? "Materials and processes" : "Material and technique",
			persons:
				museum.ref === "prm" ? "Person" : museum.ref === "hsm" ? "Makers" : "Artist/maker",
			collection: museum.ref === "oum" ? "Collection" : "Collection type",
			objectType: museum.ref === "oum" ? "Object Type" : "Object type",
			accession:
				museum.ref === "oum"
					? "Object Number"
					: museum.ref === "hsm"
						? "Accession Number"
						: "Accession no.",
			dateCollected: museum.ref === "oum" ? "Date Collected" : "Date collected",
			location: museum.ref === "oum" ? "Current Location" : "Museum location",
		},
		title: object.recordTitle,
		// only the ash details list repeats the title as a row
		titleRow:
			museum.ref === "ash" && object.recordTitle !== object.objectNumberSorting1
				? object.recordTitle
				: undefined,
		subTitle: object.recordSubtitle,
		objectNumber: object.objectNumberSorting1 ?? object.objectNumber,
		onDisplay:
			(object.onDisplay ?? object.currentLocationDisplay)?.toLowerCase() === "on display",
		images:
			iiif?.items.flatMap((canvas) => {
				const service = canvas.items[0]?.items[0]?.body.service[0]?.id
				return service ? [{ service, thumbnail: canvas.thumbnail[0]?.id }] : []
			}) ?? multimediaImages(object),
		imageCopyright: iiif
			? imageCopyright && museum.ref === "prm"
				? `Digital asset copyright: ${imageCopyright}`
				: imageCopyright
			: multimediaCopyright || undefined,
		collectionType: ["prm", "oum"].includes(museum.ref) ? object.collection : undefined,
		subcollection: object.subcollection,
		longDescription: object.longDescription,
		briefDescription: object.briefDescription,
		subject: searchLinks(object.subject, "subject:"),
		itemType: object.object?.objectType
			? {
					label: object.object.objectType,
					href: encodeURI(
						`${museum.urls.legacy.simpleSearch}/object.objectType:${object.object.objectType}`,
					),
				}
			: undefined,
		provenance: object.owner?.provenance || undefined,
		primaryInscriptions: object.inscriptions?.primaryInscriptions || undefined,
		otherInscriptions: object.inscriptions?.otherInscriptions || undefined,
		physicalMaterial: searchLinks(object.physical?.material, "physical.material:"),
		physicalMedium: searchLinks(object.physical?.medium, "physical.medium:"),
		physicalTechnique: searchLinks(object.physical?.technique, "physical.technique:"),
		description: object.physical?.description || undefined,
		// the virtual field is the display-ready form; the datePeriod array then only feeds search
		datePeriod: object.datePeriodVirtualField
			? undefined
			: object.datePeriod?.map((d) => {
					if ("period" in d)
						return {
							period: d.period,
							type: d.type,
							link: `${museum.urls.legacy.simpleSearch}/datePeriod.period:${encodeURI(d.period)}`,
						}
					else if ("from" in d)
						return {
							from: d.from,
						}
				}),
		datePeriodText: object.datePeriodVirtualField?.trim(),
		dateCollected:
			object.dateCollected?.toSorted(bySort).map((d) => d.date) ??
			(object.collectedDisplayDate?.length ? object.collectedDisplayDate : undefined),
		acquisitionInformation: object.acquisitionDateVirtualField?.trim(),
		locality: object.locality?.length ? object.locality.map((l) => l.summaryData) : undefined,
		geographicalProvenance: object.geographicalProvenance?.map((p) => {
			if ("place" in p)
				return {
					association: p.association,
					links: links(p.place, "geographicalProvenance.place:"),
				}
			else if ("region" in p) return { region: p.region }
		}),
		culturalGroups: object.culturalGroups?.toSorted(bySort).map((g) => ({
			label: g.culturalGroup,
			href: encodeURI(
				`${museum.urls.legacy.simpleSearch}/culturalGroups.culturalGroupHierarchy:${g.culturalGroupHierarchy}`,
			),
		})),
		persons: persons?.length ? persons : undefined,
		materialAndProcess: materials(object.materialAndProcess),
		materialsList: materialsList?.length ? materialsList : undefined,
		objectType:
			object.objectNames?.map((n) => ({
				links: links(n.objectName, "objectNames.objectName:"),
			})) ??
			(object.objectName?.length ? object.objectName.map((text) => ({ text })) : undefined) ??
			(object.object?.objectName ? [{ text: object.object.objectName }] : undefined),
		dimensions: object.dimensionsVirtualField ?? dimensionLines(object.dimensions),
		numberOfItems: object.numberOfObjects,
		numberOfParts: object.numberOfParts,
		creditLine: object.creditLine,
		museumLocation: object.currentLocationDisplay ?? object.currentLocation,
		museumDepartment: object.department,
		accessionNumbers:
			object.objectNumbers?.map((n) => n.displayAccNo) ??
			(object.objectNumber ? [object.objectNumber] : undefined) ??
			(object.identifier?.accessionNumber ? [object.identifier.accessionNumber] : undefined),
		inventoryNumber: object.identifier?.inventoryNo,
		otherNumbers: object.otherNumbers?.otherNumbers.length
			? object.otherNumbers.otherNumbers.map((number, index) =>
					[object.otherNumbers?.otherNumbersType[index], number].filter(Boolean).join(": "),
				)
			: undefined,
		objectNumbersAll: object.objectNumbersAll,
		researchAndResponses: object.researchAndResponses?.replace(/\r\n/g, "\n"),
		referenceURL: object.referenceURL,
	}
}

export type Props = ReturnType<typeof props>

export default async function Page({ params }: Params) {
	const { id } = await params
	const object = await api.getCollectionObject(id)
	const iiif = await api.getDamsIiif(object)

	return <CollectionObjectLayout {...props(object, iiif)} />
}
