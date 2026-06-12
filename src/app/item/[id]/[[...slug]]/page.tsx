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

function materials(materialAndProcess: CollectionObject["materialAndProcess"]) {
	const values: Array<{ text?: string; links?: ReturnType<typeof links> }> = []
	// Ancestors of earlier vocabulary trails carry into later ones, e.g. the
	// technique "glazed > tin-glazed" expands to "processed material > glazed > tin-glazed"
	const trail: ReturnType<typeof links> = []
	// Display text without a vocabulary prefixes the next vocabulary value,
	// e.g. "ceramic, with tin glaze" + "processed material > ceramic"
	let text: string | undefined

	const sorted = materialAndProcess?.toSorted((a, b) => Number(a.sort) - Number(b.sort)) ?? []

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
	return {
		title: object.recordTitle,
		subTitle: object.recordSubtitle,
		objectNumber: object.objectNumberSorting1,
		images: iiif?.items.flatMap((canvas) => {
			const service = canvas.items[0]?.items[0]?.body.service[0]?.id
			return service ? [{ service, thumbnail: canvas.thumbnail[0]?.id }] : []
		}),
		imageCopyright: iiif?.requiredStatement?.value.en[0],
		datePeriod: object.datePeriod?.map((d) => {
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
		geographicalProvenance: object.geographicalProvenance?.map((p) => {
			if ("place" in p)
				return {
					association: p.association,
					links: links(p.place, "geographicalProvenance.place:"),
				}
			else if ("region" in p) return { region: p.region }
		}),
		materialAndProcess: materials(object.materialAndProcess),
		objectType: object.objectNames?.map((n) => ({
			links: links(n.objectName, "objectNames.objectName:"),
		})),
		dimensions: object.dimensionsVirtualField,
		numberOfItems: object.numberOfObjects,
		creditLine: object.creditLine,
		museumLocation: object.currentLocationDisplay,
		museumDepartment: object.department,
		accessionNumbers: object.objectNumbers?.map((n) => n.displayAccNo),
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
