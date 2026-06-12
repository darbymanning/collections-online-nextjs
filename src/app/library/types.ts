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

export type CollectionObject = {
	id: `${Museum}-object-${string}`
	type: string
	irn: string
	isPublished: string
	objectNumberSorting1: string
	objectNumberSortedSorting1: string
	numberOfObjects: string
	recordType: string
	dimensionsVirtualField: string
	creditLine: string
	acquisitionDatePreview: string
	literatureVirtualField: string
	header: string
	subheader: string
	currentLocationDisplay: string
	webCategory: string
	department: string
	lastModified: string
	catalogueQuality: string
	domain: string
	isValidated: string
	multimediaQuality: string
	showImages: string
	hasCulturalWarning: boolean
	referenceURL: string
	redirectId: string
	multimedia: Array<{
		resourceSpaceId: string
		isPublished: string
		quality: string
		lastModified: string
		thumbnail: string
		identifier: string
		mimeType: string
		path: string
		rights: {}
		irn: string
	}>
	objectTitle: Array<{
		title: string
		type: string
		sort: string
	}>
	persons: Array<any>
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
		sort: string
		previewTxt?: string
		matTechSearch: string
		previewVoc?: string
	}>
	objectNumbers: Array<{
		NumberVrt: string
		sort: string
		type: string
		displayAccNo: string
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
	personsAssociated: Array<any>
	provenance: Array<any>
	inscriptionsAndMarks: Array<any>
	provenancePerson: Array<any>
	objectNames: Array<{
		objectName: string
		objectNameSearch: string
	}>
	objectLinksA: Array<any>
	objectLinksB: Array<any>
	design: Array<any>
	conservation: Array<any>
	series: Array<{
		sort: string
	}>
	book: Array<{
		sort: string
	}>
	museum: string
	collection: string
	onDisplayFilter: string
	catalogueQualityFilter: string
	averageDatePeriod: number
	multimediaQualityFilter: Array<string>
	_nested: {
		geographicalProvenance: Array<{
			place: string
			association: string
			sort: string
			placeSearch: string
		}>
		persons: Array<any>
	}
	recordTitle: string
	recordSubtitle: string
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
