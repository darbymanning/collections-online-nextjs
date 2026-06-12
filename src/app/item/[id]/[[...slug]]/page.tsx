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
	const base = [museum.urls.simpleSearch, filter].join("/")
	const parts = str.split(" > ")

	return parts.map((label, index) => ({
		label,
		href: encodeURI(base + parts.slice(0, index + 1).join(" > ")),
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

export function props(object: CollectionObject, iiif: IIIFManifest | null) {
	const imageCopyright = iiif?.requiredStatement?.value.en[0]

	const persons = object.persons?.toSorted(bySort).flatMap((p) => {
		const name = p.primaryName ?? p.displayName
		if (!name) return []
		return [
			{
				role: p.role,
				name,
				href: encodeURI(`${museum.urls.simpleSearch}/persons.id:${p.id}`),
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
				href: encodeURI(`${museum.urls.simpleSearch}/materialAndProcess.${key}:${m[key]}`),
			},
		]
	})

	return {
		// field labels differ between the museums' live sites
		labels: {
			place: museum.ref === "prm" ? "Geographical reference" : "Associated place",
			materials: museum.ref === "prm" ? "Materials and processes" : "Material and technique",
			persons: museum.ref === "prm" ? "Person" : "Artist/maker",
		},
		title: object.recordTitle,
		subTitle: object.recordSubtitle,
		objectNumber: object.objectNumberSorting1,
		onDisplay:
			(object.onDisplay ?? object.currentLocationDisplay)?.toLowerCase() === "on display",
		images: iiif?.items.flatMap((canvas) => {
			const service = canvas.items[0]?.items[0]?.body.service[0]?.id
			return service ? [{ service, thumbnail: canvas.thumbnail[0]?.id }] : []
		}),
		imageCopyright:
			imageCopyright && museum.ref === "prm"
				? `Digital asset copyright: ${imageCopyright}`
				: imageCopyright,
		collectionType: museum.ref === "prm" ? object.collection : undefined,
		longDescription: object.longDescription,
		// the virtual field is the display-ready form; the datePeriod array then only feeds search
		datePeriod: object.datePeriodVirtualField
			? undefined
			: object.datePeriod?.map((d) => {
					if ("period" in d)
						return {
							period: d.period,
							type: d.type,
							link: `${museum.urls.simpleSearch}/datePeriod.period:${encodeURI(d.period)}`,
						}
					else if ("from" in d)
						return {
							from: d.from,
						}
				}),
		datePeriodText: object.datePeriodVirtualField?.trim(),
		dateCollected: object.dateCollected?.toSorted(bySort).map((d) => d.date),
		acquisitionInformation: object.acquisitionDateVirtualField?.trim(),
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
				`${museum.urls.simpleSearch}/culturalGroups.culturalGroupHierarchy:${g.culturalGroupHierarchy}`,
			),
		})),
		persons: persons?.length ? persons : undefined,
		materialAndProcess: materials(object.materialAndProcess),
		materialsList: materialsList?.length ? materialsList : undefined,
		objectType: object.objectNames?.map((n) => ({
			links: links(n.objectName, "objectNames.objectName:"),
		})),
		dimensions: object.dimensionsVirtualField,
		numberOfItems: object.numberOfObjects,
		creditLine: object.creditLine,
		museumLocation: object.currentLocationDisplay,
		museumDepartment: object.department,
		accessionNumbers: object.objectNumbers?.map((n) => n.displayAccNo),
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
