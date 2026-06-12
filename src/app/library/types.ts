/** GLAM Oxford museum sites, keyed by the identifier used in IRNs and `MUSEUM`. */
export const museums = {
	/** Ashmolean Museum
	 * @see {@link https://www.ashmolean.org} */
	ash: {
		ref: "ash",
		name: "Ashmolean Museum",
		url: "https://www.ashmolean.org",
		dams: "https://dams.ashmus.ox.ac.uk/iiif/",
	},
	/** Oxford University Museum of Natural History
	 * @see {@link https://www.oumnh.ox.ac.uk} */
	oum: {
		ref: "oum",
		name: "Oxford University Museum of Natural History",
		url: "https://www.oumnh.ox.ac.uk",
	},
	/** Pitt Rivers Museum
	 * @see {@link https://www.prm.ox.ac.uk} */
	prm: {
		ref: "prm",
		name: "Pitt Rivers Museum",
		url: "https://www.prm.ox.ac.uk",
		dams: "https://dams.prm.ox.ac.uk/iiif/",
	},
	/** History of Science Museum
	 * @see {@link https://hsm.ox.ac.uk} */
	hsm: {
		ref: "hsm",
		name: "History of Science Museum",
		url: "https://hsm.ox.ac.uk",
	},
} as const

/** Museum identifier configured via `MUSEUM`.
 *
 * - `ash` — Ashmolean Museum
 * - `oum` — Oxford University Museum of Natural History
 * - `prm` — Pitt Rivers Museum
 * - `hsm` — History of Science Museum
 *
 * @see {@link museums} */
export type Museum = keyof typeof museums

/** A catalogue object from `prd-online.glamdigital.io`.
 *
 * The shape varies by museum — fields only returned by some museums are
 * optional and annotated. Verified against `ash` and `prm` responses. */
export type CollectionObject = {
	id: `${Museum}-object-${string}`
	type: string
	irn: string
	isPublished: string
	museum: string
	collection: string
	domain: string
	recordType: string
	recordTitle: string
	recordSubtitle: string
	objectNumberSorting1: string
	objectNumberSortedSorting1: string
	lastModified: string
	hasCulturalWarning: boolean
	dimensionsVirtualField?: string
	creditLine?: string
	multimedia: Array<{
		resourceSpaceId: string
		isPublished: string
		identifier: string
		mimeType: string
		path: string
		rights: {}
		irn: string
		/** prm */
		id?: string
		ranking?: string
		/** ash */
		quality?: string
		lastModified?: string
		thumbnail?: string
	}>
	persons: Array<{
		id?: string
		/** prm */
		primaryName?: string
		role?: string
		/** ash */
		displayName?: string
		attribution?: string
		sort?: string
	}>
	geographicalProvenance?: Array<
		| {
				place: string
				association?: string
				sort: string
				placeSearch?: string
		  }
		| { region: string; sort: string }
	>
	materialAndProcess: Array<{
		type: string
		sort?: string
		/** ash */
		previewTxt?: string
		previewVoc?: string
		matTechSearch?: string
		/** prm */
		materialIndex?: string
		processIndex?: string
	}>
	datePeriod?: Array<
		| {
				period: string
				sort: string
				to: string
				from: string
				type: string
		  }
		| { from: string }
	>

	/* ash */
	numberOfObjects?: string
	acquisitionDatePreview?: string
	literatureVirtualField?: string
	header?: string
	subheader?: string
	currentLocationDisplay?: string
	webCategory?: string
	department?: string
	catalogueQuality?: string
	isValidated?: string
	multimediaQuality?: string
	showImages?: string
	referenceURL?: string
	redirectId?: string
	objectTitle?: Array<{
		title: string
		type: string
		sort: string
	}>
	objectNumbers?: Array<{
		NumberVrt: string
		sort: string
		type: string
		displayAccNo: string
	}>
	objectNames?: Array<{
		objectName: string
		objectNameSearch: string
	}>
	personsAssociated?: Array<any>
	provenance?: Array<any>
	inscriptionsAndMarks?: Array<any>
	provenancePerson?: Array<any>
	objectLinksA?: Array<any>
	objectLinksB?: Array<any>
	design?: Array<any>
	conservation?: Array<any>
	series?: Array<{ sort: string }>
	book?: Array<{ sort: string }>
	onDisplayFilter?: string
	catalogueQualityFilter?: string
	averageDatePeriod?: number
	multimediaQualityFilter?: Array<string>

	/* prm */
	description?: string
	longDescription?: string
	archaologyOrEthnography?: string
	culturalGroupsVirtualField?: string
	geographicalProvenanceVirtualField?: string
	materialAndProcessVirtualField?: string
	datePeriodVirtualField?: string
	acquisitionDateVirtualField?: string
	onDisplay?: string
	objectNumbersAll?: string
	researchAndResponses?: string
	intNumberOfObjects?: string
	culturalGroups?: Array<{
		id: string
		culturalGroup: string
		sort: string
		culturalGroupHierarchy: string
	}>
	acquisitionDate?: Array<{
		dateText: string
		from: string
		preview: string
		sort: string
		type: string
		fromYear: string
		toYear: string
	}>
	class?: Array<{ class: string }>
	keywords?: Array<{ keyword: string; sort: string }>
	dateCollected?: Array<{ date: string; sort: string }>
	format?: Array<any>
	photoProcess?: Array<any>
	rights?: Array<any>
	objectLinks?: Array<any>
	objectLinks2?: Array<{ irn: string }>
	objectGroups?: Array<{ id: string; isPublished: string }>
	music?: Array<any>

	_nested: {
		geographicalProvenance?: Array<{
			place: string
			association: string
			sort: string
			placeSearch: string
		}>
		persons: Array<any>
	}
}

/** IIIF Image API 3.0 service endpoint.
 * @see {@link https://iiif.io/api/image/3.0/#image-service | IIIF Image API 3.0 — Image Service} */
type IIIFImageService = {
	/** Base URL of the IIIF Image service (no region/size/quality/format suffix).
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/image/12973"
	 * @see {@link https://iiif.io/api/image/3.0/#id | IIIF Image API 3.0 — `id`} */
	id: string
	type: "ImageService3"
	profile: string
}

/** Thumbnail image resource on a manifest or canvas.
 * @see {@link https://iiif.io/api/presentation/3.0/#thumbnail | IIIF Presentation 3.0 — Thumbnail} */
type IIIFThumbnail = {
	/** IIIF Image API URL for the thumbnail rendition.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/image/12973/full/thm/0/default.jpg"
	 * @see {@link https://iiif.io/api/image/3.0/#thumbnail | IIIF Image API 3.0 — Thumbnail request} */
	id: string
	type: "Image"
	format: string
	height: number
	width: number
	service: Array<IIIFImageService>
}

/** Full-size image painted onto a canvas via an annotation.
 * @see {@link https://iiif.io/api/presentation/3.0/#content-resources | IIIF Presentation 3.0 — Content resources} */
type IIIFImageBody = {
	/** IIIF Image API URL for the full (max) image rendition.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/image/12973/full/max/0/default.jpg"
	 * @see {@link https://iiif.io/api/image/3.0/#full-size-request | IIIF Image API 3.0 — Full size request} */
	id: string
	type: "Image"
	format: string
	service: Array<IIIFImageService>
	height: number
	width: number
}

/** Painting annotation linking an image to a canvas.
 * @see {@link https://iiif.io/api/presentation/3.0/#annotation | IIIF Presentation 3.0 — Annotation} */
type IIIFAnnotation = {
	/** URL of the painting annotation.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/312375/annotation/0"
	 * @see {@link https://iiif.io/api/presentation/3.0/#id | IIIF Presentation 3.0 — `id`} */
	id: string
	type: "Annotation"
	motivation: "painting"
	body: IIIFImageBody
	/** URL of the canvas this annotation is painted onto.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/312375/canvas/0"
	 * @see {@link https://iiif.io/api/presentation/3.0/#canvas | IIIF Presentation 3.0 — Canvas} */
	target: string
}

/** Page grouping annotations for a single canvas.
 * @see {@link https://iiif.io/api/presentation/3.0/#annotationpage | IIIF Presentation 3.0 — AnnotationPage} */
type IIIFAnnotationPage = {
	/** URL of the annotation page grouping annotations for a canvas.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/312375/annotationpage/0"
	 * @see {@link https://iiif.io/api/presentation/3.0/#id | IIIF Presentation 3.0 — `id`} */
	id: string
	type: "AnnotationPage"
	items: Array<IIIFAnnotation>
}

/** One page or view within a manifest.
 * @see {@link https://iiif.io/api/presentation/3.0/#canvas | IIIF Presentation 3.0 — Canvas} */
type IIIFCanvas = {
	/** URL of the canvas (one page/view in the manifest).
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/312375/canvas/0"
	 * @see {@link https://iiif.io/api/presentation/3.0/#id | IIIF Presentation 3.0 — `id`} */
	id: string
	type: "Canvas"
	label: {
		none: Array<string>
	}
	height: number
	width: number
	thumbnail: Array<IIIFThumbnail>
	items: Array<IIIFAnnotationPage>
}

/** IIIF Presentation API 3.0 manifest for a collection object.
 * @see {@link https://iiif.io/api/presentation/3.0/#manifest | IIIF Presentation 3.0 — Manifest} */
export type IIIFManifest = {
	"@context": "http://iiif.io/api/presentation/3/context.json"
	/** Canonical URL of this manifest.
	 * @example "https://dams.ashmus.ox.ac.uk/iiif/312375/manifest"
	 * @see {@link https://iiif.io/api/presentation/3.0/#id | IIIF Presentation 3.0 — `id`} */
	id: string
	type: "Manifest"
	label: {
		en: Array<string>
	}
	metadata: Array<{
		label: {
			en: Array<string>
		}
		value: {
			en: Array<string>
		}
	}>
	requiredStatement: {
		label: {
			en: Array<string>
		}
		value: {
			en: Array<string>
		}
	}
	thumbnail: Array<IIIFThumbnail>
	behavior: Array<string>
	viewingDirection: string
	items: Array<IIIFCanvas>
}
