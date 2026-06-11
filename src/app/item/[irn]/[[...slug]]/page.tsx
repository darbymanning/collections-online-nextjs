import type { Metadata } from "next"
import { api } from "$library/api"
import { slugify } from "$library/slug"
import { CollectionObjectLayout } from "$layouts/collection-object"
import type { CollectionObject } from "$library/types"
import { list } from "$library/utils"
import { urls } from "$library/config"

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

	return {
		title: object.recordTitle,
		alternates: {
			canonical: `/item/${irn}/${slugify(object.recordTitle)}`,
		},
	}
}

function links(str: string, filter: string) {
	const base = [urls.simpleSearch, filter].join("/")
	const parts = str.split(" > ")

	return parts.map((label, index) => ({
		label,
		href: encodeURI(base + parts.slice(0, index + 1).join(" > ")),
	}))
}

export function props(object: CollectionObject) {
	return {
		title: object.recordTitle,
		objectNumbers: list.readable(object.objectNumbers.map((o) => o.NumberVrt)),
		datePeriod: object.datePeriod.map(({ period, type }) => ({
			period,
			type,
			link: `${urls.simpleSearch}/datePeriod.period:${encodeURI(period)}`,
		})),
		geographicalProvenance: object.geographicalProvenance.map(({ place, association }) => ({
			association,
			links: links(place, "geographicalProvenance.place:"),
		})),
	}
}

export type Props = ReturnType<typeof props>

export default async function Page({ params }: Params) {
	const { irn } = await params
	const [object, iiif] = await Promise.all([api.getCollectionObject(irn), api.getDamsIiif(irn)])

	return <CollectionObjectLayout {...props(object)} />
}
