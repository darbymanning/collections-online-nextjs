import { museumDirectory } from "./config"

/** Museum identifier configured via `MUSEUM`.
 *
 * - `ash` — Ashmolean Museum
 * - `oum` — Oxford University Museum of Natural History
 * - `prm` — Pitt Rivers Museum
 * - `hsm` — History of Science Museum
 *
 * @see {@link museumDirectory} */
export type Museum = keyof typeof museumDirectory

/** A catalogue object from `prd-online.glamdigital.io`.
 *
 * The shape varies by museum — fields only returned by some museums are
 * optional and annotated. Verified against `ash`, `prm` and `oum` responses. */
export type CollectionObject = {
	/** @example "ash-object-312375", "oum-catalogue-36916" */
	id: `${Museum}-${string}`
	type: string
	/** a string for ash/prm, a number for oum */
	irn: string | number
	museum: string
	collection: string
	recordTitle: string
	recordSubtitle: string
	isPublished?: string
	domain?: string
	recordType?: string
	objectNumberSorting1?: string
	objectNumberSortedSorting1?: string
	lastModified?: string
	hasCulturalWarning?: boolean
	dimensionsVirtualField?: string
	creditLine?: string
	/** Narrative records carry a curated list of related catalogue objects — the
	 * legacy "Find out more" section. The entries are partial (id, irn, media,
	 * but no titles), so teasers refetch the full records. */
	relatedObjects?: Array<{ id: CollectionObject["id"] }>
	multimedia: Array<{
		identifier: string
		mimeType: string
		path: string
		isPublished?: string
		irn?: string | number
		rights?: {
			rightsAcknowledgement?: string
			rightsConditions?: string
			rightsRequiresAcknowledgement?: string
		}
		/** ash + prm */
		resourceSpaceId?: string
		/** prm */
		id?: string
		ranking?: string
		/** ash */
		quality?: string
		lastModified?: string
		thumbnail?: string
		/** oum */
		MulIdentifier?: string
		MulMimeType?: string
		mimeFormat?: string
		title?: string
		summaryData?: string
	}>
	persons?: Array<{
		id?: string
		/** prm */
		primaryName?: string
		role?: string
		/** ash */
		displayName?: string
		attribution?: string
		sort?: string
		/** hsm */
		irn?: string | number
		fullName?: string | null
		firstName?: string | null
		lastName?: string | null
		organisation?: string | null
		partyType?: string
		personTitle?: string | null
		birthDate?: string | null
		sex?: string | null
		nationality?: string | null
		isPublished?: string
		multimedia?: Array<any>
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
	materialAndProcess?: Array<{
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
	/** prm "Associated publications" — both render under the same label */
	publicationHistory?: string | null
	literature?: string | null
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
	keywords?: Array<{ keyword: string; sort?: string }>
	dateCollected?: Array<{ date: string; sort: string }>
	format?: Array<any>
	photoProcess?: Array<any>
	rights?: Array<{ type?: string }>
	/** Curated links to other catalogue records — the legacy "Related" section.
	 * The relationship is bidirectional and authored on either end, so a given
	 * record may carry the irns in `objectLinks`, `objectLinks2`, or both. */
	objectLinks?: Array<{ irn: string }>
	objectLinks2?: Array<{ irn: string }>
	objectGroups?: Array<{ id: string; isPublished: string }>
	music?: Array<any>

	/* oum */
	objectNumber?: string
	subcollection?: string
	briefDescription?: string
	currentLocation?: string
	numberOfParts?: string
	numberOfSpecimens?: string
	objectName?: Array<string>
	otherNumbers?: {
		notes: Array<string>
		otherNumbers: Array<string>
		otherNumbersType: Array<string>
	}
	locality?: Array<{
		irn: number
		summaryData: string
		country: Array<string>
		globalRegion: Array<string>
		districtCountyShire: Array<string>
		cityTown: Array<string>
		nearestNamedPlace: Array<string>
		siteName: Array<string>
	}>
	collectedDisplayDate?: Array<string>
	collectedDisplayDateEarliest?: Array<string>
	collectedDisplayDateLatest?: Array<string>
	collectedBy?: Array<any>
	collectionName?: Array<string>
	taxonomy?: Array<any>
	typeStatus?: Array<string>
	stratigraphy?: any
	preservation?: string | null
	sex?: string | null
	stage?: string | null
	age?: string | null
	phase?: string | null
	language?: string | null
	technique?: Array<any>
	materials?: Array<any>
	titleDescription?: string | null
	briefDescriptionSearch?: string
	preciseLocation?: Array<string>
	parentRecord?: any
	productionMaker?: Array<any>
	productionDisplayDate?: Array<string>
	EADUnitTitle?: string | null
	EADUnitDate?: string | null
	EADUnitDateEarliest?: string | null
	EADUnitDateLatest?: string | null
	EADUnitID?: string | null
	EADIdentifier?: string | null
	EADLevelAttribute?: string | null
	EADScopeAndContent?: string | null
	EADOrigination_tab?: Array<any>
	EADExtent_tab?: Array<any>

	/* hsm */
	title?: string
	summaryData?: string
	subject?: Array<string>
	dateCreated?: string | number | null
	dateCreatedEarliest?: number
	dateCreatedLatest?: number
	identifier?: {
		inventoryNo?: string
		accessionNumber?: string
	}
	object?: {
		objectType?: string | null
		objectName?: string | null
	}
	owner?: {
		provenance?: string | null
		collectionGroup: Array<string>
		relatedParties: Array<string>
		collectionGroupTitle?: string | null
	}
	inscriptions?: {
		primaryInscriptions?: string | null
		otherInscriptions?: string | null
	}
	physical?: {
		material: Array<string>
		medium: Array<string>
		technique: Array<string>
		contentAnalysis: Array<string>
		support?: string | null
		watermark?: string | null
		description?: string | null
	}
	origins?: {
		placeCreatedSummary: Array<string>
		placeCreated0: Array<string>
		placeCreated1: Array<string>
		placeCreated2: Array<string>
		placeCreated3: Array<string>
		placeCreated4: Array<string>
	}
	dimensions?: {
		unitLength: Array<string>
		unitWeight: Array<string>
		diameter: Array<number>
		height: Array<number>
		width: Array<number>
		depth: Array<number>
		weight: Array<number>
	}
	EADExtent?: Array<string>
	EADLanguageOfMaterial?: Array<string>
	EADArchiveRef?: string | null
	EADAuthor?: Array<any>
	EADDescription?: string | null

	_nested?: {
		geographicalProvenance?: Array<{
			place: string
			association: string
			sort: string
			placeSearch: string
		}>
		persons: Array<any>
	}
}

/** Response from `prd-online.glamdigital.io/v2/search-fields/{museum}/catalogue`.
 * Result items carry the same fields as full records, minus the virtual fields. */
export type SearchResults = {
	total: number
	maxScore: number | null
	results: Array<{ item: CollectionObject }>
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
	/** Absent on some Ashmolean DAMS canvases. */
	thumbnail?: Array<IIIFThumbnail>
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
