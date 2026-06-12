import type { Metadata } from "next"
import { api } from "$library/api"
import { slugify } from "$library/slug"
import { CollectionObjectLayout } from "$layouts/collection-object"
import type { CollectionObject } from "$library/types"
import { museum } from "$library/config"

type Params = {
	params: Promise<{
		irn: CollectionObject["irn"]
		// cosmetic only — never read, just makes URLs human-friendly
		slug?: Array<string>
	}>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { irn } = await params
	const object = await api.getCollectionObject(irn)

	// If the title is the same as the object number, use the record subtitle instead
	const title =
		object.recordTitle !== object.objectNumberSorting1
			? object.recordTitle
			: object.recordSubtitle

	return {
		title,
		alternates: {
			canonical: `/item/${irn}/${slugify(title)}`,
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

export function props(object: CollectionObject) {
	return {
		title: object.recordTitle,
		subTitle: object.recordSubtitle,
		objectNumber: object.objectNumberSorting1,
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
	}
}

export type Props = ReturnType<typeof props>

export default async function Page({ params }: Params) {
	const { irn } = await params
	const object = await api.getCollectionObject(irn)
	const iiif = await api.getDamsIiif(object)

	console.log(object)

	return <CollectionObjectLayout {...props(object)} />
}
