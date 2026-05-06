export type CollectionObject = {
	id: string
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
	geographicalProvenance: Array<{
		place: string
		association: string
		sort: string
		placeSearch: string
	}>
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
	datePeriod: Array<{
		period: string
		sort: string
		to: string
		from: string
		type: string
	}>
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
