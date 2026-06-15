import { afterEach, describe, expect, mock, spyOn, test } from "bun:test"
import ashManifestFixture from "$fixtures/ash-object-312375.iiif.json"
import ashObjectFixture from "$fixtures/ash-object-312375.json"
import hsmObjectFixture from "$fixtures/hsm-catalogue-29715.json"
import oumObjectFixture from "$fixtures/oum-catalogue-36916.json"
import prmManifestFixture from "$fixtures/prm-object-79439.iiif.json"
import prmObjectFixture from "$fixtures/prm-object-79439.json"
import { museum } from "$library/config"
import type { CollectionObject, IIIFManifest } from "$library/types"
import { generateMetadata, props } from "./page"

const fixtures = {
	ash: {
		object: ashObjectFixture as unknown as CollectionObject,
		iiif: ashManifestFixture as unknown as IIIFManifest,
	},
	oum: { object: oumObjectFixture as unknown as CollectionObject, iiif: null },
	prm: {
		object: prmObjectFixture as unknown as CollectionObject,
		iiif: prmManifestFixture as unknown as IIIFManifest,
	},
	hsm: { object: hsmObjectFixture as unknown as CollectionObject, iiif: null },
} as const

const expectedMetadata = {
	ash: {
		title: "Tin-glazed tile in Italian style",
		canonical: "/item/ash-object-312375/tin-glazed-tile-in-italian-style",
	},
	oum: {
		title: "Topaz (single colourless crystal)",
		canonical: "/item/oum-catalogue-36916/topaz-single-colourless-crystal",
	},
	// the prm record title is the accession number, so the subtitle is used
	prm: {
		title: "Headdress mask representing Abam, a predatory fish.",
		canonical: "/item/prm-object-79439/headdress-mask-representing-abam-a-predatory-fish",
	},
	hsm: {
		title: "Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century",
		canonical:
			"/item/hsm-catalogue-29715/two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs-new-jersey-usa-early-21st-century",
	},
} as const

// The suite runs once per museum (scripts/test-unit.ts); each process asserts
// the transformation for the museum it was started with.
const { object, iiif } = fixtures[museum.ref]
const search = String(museum.urls.legacy.simpleSearch)

const onlyFor = (...refs: Array<(typeof museum)["ref"]>) =>
	refs.includes(museum.ref) ? describe : describe.skip

afterEach(() => {
	mock.restore()
})

describe("props (all museums)", () => {
	test("title comes from the record title", () => {
		expect(props(object, iiif).title).toBe(object.recordTitle)
	})

	test("resolves at least one image for the known item", () => {
		expect(props(object, iiif).images?.length).toBeGreaterThan(0)
	})
})

describe("generateMetadata", () => {
	test("titles the page and points the canonical at the slugged URL", async () => {
		// generateMetadata fetches the record and (for DAMs museums) its manifest,
		// so hand back a fresh Response per call rather than one shared body
		spyOn(globalThis, "fetch").mockImplementation(() =>
			Promise.resolve(new Response(JSON.stringify(object))),
		)

		const metadata = await generateMetadata({ params: Promise.resolve({ id: object.id }) })

		expect(metadata.title).toBe(expectedMetadata[museum.ref].title)
		expect(metadata.alternates?.canonical).toBe(expectedMetadata[museum.ref].canonical)
	})
})

onlyFor("ash")("props (ash)", () => {
	const result = props(object, iiif)

	test("uses the ash labels", () => {
		expect(result.labels).toMatchObject({
			materials: "Material and technique",
			accession: "Accession no.",
			persons: "Artist/maker",
		})
	})

	test("repeats the title as a details row", () => {
		expect(result.titleRow).toBe("Tin-glazed tile in Italian style")
	})

	test("is not on display", () => {
		expect(result.onDisplay).toBe(false)
	})

	test("maps IIIF canvases to image services", () => {
		expect(result.images).toEqual([
			{
				service: "https://dams.ashmus.ox.ac.uk/iiif/image/12973",
				thumbnail: "https://dams.ashmus.ox.ac.uk/iiif/image/12973/full/thm/0/default.jpg",
			},
			{
				service: "https://dams.ashmus.ox.ac.uk/iiif/image/1068284",
				thumbnail: "https://dams.ashmus.ox.ac.uk/iiif/image/1068284/full/thm/0/default.jpg",
			},
		])
	})

	test("takes the image copyright from the manifest, unprefixed", () => {
		expect(result.imageCopyright).toBe("© Ashmolean Museum, University of Oxford")
	})

	test("builds material trails with accumulated ancestors and display-text prefixes", () => {
		expect(result.materialAndProcess).toEqual([
			{
				text: "ceramic, with tin glaze",
				links: [
					{
						label: "processed material",
						href: `${search}/materialAndProcess.previewVoc:processed%20material`,
					},
					{
						label: "ceramic",
						href: `${search}/materialAndProcess.previewVoc:processed%20material%20%3E%20ceramic`,
					},
				],
			},
			{
				text: undefined,
				links: [
					{
						label: "processed material",
						href: `${search}/materialAndProcess.previewVoc:processed%20material`,
					},
					{ label: "glazed", href: `${search}/materialAndProcess.previewVoc:glazed` },
					{
						label: "tin-glazed",
						href: `${search}/materialAndProcess.previewVoc:glazed%20%3E%20tin-glazed`,
					},
				],
			},
		])
	})

	test("links the find-spot place hierarchy", () => {
		const [findSpot] = result.geographicalProvenance ?? []
		const labels = findSpot && "links" in findSpot ? findSpot.links.map((l) => l.label) : []

		expect(findSpot).toMatchObject({ association: "find spot" })
		expect(labels).toHaveLength(9)
		expect(labels[0]).toBe("Europe")
		expect(labels.at(-1)).toBe("St John the Baptist's Chapel")
	})

	test("object type comes from the objectNames trail", () => {
		const [first] = result.objectType ?? []
		const labels = first && "links" in first ? first.links.map((l) => l.label) : []

		expect(labels).toEqual(["architecture", "tile"])
	})

	test("date period falls back to the datePeriod array", () => {
		expect(result.datePeriodText).toBeUndefined()
		expect(result.datePeriod?.[0]).toMatchObject({
			period: "Medieval period (Britain) (1066 - 1500)",
			type: "date of creation",
		})
	})

	test("accession numbers use the display accession number", () => {
		expect(result.objectNumber).toBe("AN1921.320")
		expect(result.accessionNumbers).toEqual(["AN1921.320"])
	})
})

onlyFor("oum")("props (oum)", () => {
	const result = props(object, iiif)

	test("uses the oum labels", () => {
		expect(result.labels).toMatchObject({
			collection: "Collection",
			objectType: "Object Type",
			accession: "Object Number",
			dateCollected: "Date Collected",
			location: "Current Location",
		})
	})

	test("builds image URLs from S3 multimedia paths with the 1000x1000 derivative", () => {
		const url =
			"https://mhn-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/data/oumnh/multimedia/10/077/MIN.28380_001.1000x1000.jpg"

		expect(result.images).toEqual([{ url, thumbnail: url }])
	})

	test("takes copyright from the multimedia rights", () => {
		const [acknowledgement, conditions] = result.imageCopyright?.split("\n") ?? []

		expect(acknowledgement).toBe("Acknowledgement: © Oxford University Museum of Natural History")
		expect(conditions).toStartWith("Conditions: Permission is granted")
	})

	test("shows the collection and subcollection", () => {
		expect(result.collectionType).toBe("Mineralogy and Petrology")
		expect(result.subcollection).toBe("Mineralogy")
	})

	test("plain-text object type from objectName strings", () => {
		expect(result.objectType).toEqual([{ text: "mineral" }])
	})

	test("falls back to the plain object number", () => {
		expect(result.objectNumber).toBe("MIN.28380")
		expect(result.accessionNumbers).toEqual(["MIN.28380"])
	})

	test("pairs other numbers with their types when present", () => {
		expect(result.otherNumbers).toEqual(["Hull Univ. M1141"])
	})

	test("localities use the summary data", () => {
		expect(result.locality).toEqual([
			"Roppe Tin mines:, Roppe Tin mines, Central Province, Nigeria, Africa",
		])
	})
})

onlyFor("prm")("props (prm)", () => {
	const result = props(object, iiif)

	test("uses the prm labels", () => {
		expect(result.labels).toMatchObject({
			place: "Geographical reference",
			materials: "Materials and processes",
			persons: "Person",
		})
	})

	test("record title is the accession number with the description as subtitle", () => {
		expect(result.title).toBe("1938.15.69")
		expect(result.subTitle).toBe("Headdress mask representing Abam, a predatory fish.")
		expect(result.titleRow).toBeUndefined()
	})

	test("is on display", () => {
		expect(result.onDisplay).toBe(true)
	})

	test("maps all manifest canvases", () => {
		expect(result.images).toHaveLength(6)
		expect(result.images?.[0]).toEqual({
			service: "https://dams.prm.ox.ac.uk/iiif/image/265206",
			thumbnail: "https://dams.prm.ox.ac.uk/iiif/image/265206/full/thm/0/default.jpg",
		})
	})

	test("prefixes the manifest copyright", () => {
		expect(result.imageCopyright).toBe(
			"Digital asset copyright: Pitt Rivers Museum, University of Oxford",
		)
	})

	test("materials are flat indexed terms rather than trails", () => {
		expect(result.materialAndProcess).toBeUndefined()
		expect(result.materialsList).toHaveLength(9)
		expect(result.materialsList?.[0]).toEqual({
			type: "Material",
			label: "Wood Plant",
			href: `${search}/materialAndProcess.materialIndex:Wood%20Plant`,
		})
		expect(result.materialsList?.at(-1)).toMatchObject({ type: "Process", label: "Perforated" })
	})

	test("persons link to their party id, sorted", () => {
		expect(result.persons).toEqual([
			{ role: "Field collector", name: "Gwilym Iwan Jones", href: `${search}/persons.id:5847` },
			{ role: "PRM source", name: "Gwilym Iwan Jones", href: `${search}/persons.id:5847` },
		])
	})

	test("cultural groups are sorted and link the raw hierarchy value", () => {
		expect(result.culturalGroups?.map((g) => g.label)).toEqual(["Ikwerre Igbo", "Southern Igbo"])
		expect(result.culturalGroups?.[0]?.href).toBe(
			`${search}/culturalGroups.culturalGroupHierarchy:%20-%3E%20Ikwerre%20Igbo`,
		)
	})

	test("display-ready virtual fields win over structured data", () => {
		expect(result.datePeriodText).toBe("Date made: Before 1937")
		expect(result.datePeriod).toBeUndefined()
		expect(result.dimensions).toBe("Depth 460 mm, Width: max 640 mm, Length: max 980 mm")
		expect(result.acquisitionInformation).toBe("Donated: 1938")
	})

	test("geographical provenance mixes place trails and plain regions", () => {
		const [place, region] = result.geographicalProvenance ?? []
		const labels = place && "links" in place ? place.links.map((l) => l.label) : []

		expect(labels).toEqual(["Africa", "Western Africa", "Nigeria"])
		expect(region).toEqual({ region: "Southern Nigeria  Niger Delta  Rivers State  Rumuji town" })
	})

	test("normalises CRLF in research notes", () => {
		expect(result.researchAndResponses).not.toInclude("\r")
	})

	test("shows the plain object numbers string and collected dates", () => {
		expect(result.objectNumbersAll).toBe("Accession number: 1938.15.69")
		expect(result.dateCollected).toEqual(["1937"])
	})

	test("search terms concatenate class headings and keywords, deduped and linked", () => {
		expect(result.searchTerms?.map((t) => t.label)).toEqual([
			"Ornament",
			"Clothing Headgear",
			"Figure",
			"Mask",
			"Headdress",
			"Fish Figure",
		])
		expect(result.searchTerms?.[1]?.href).toBe(`${search}/Clothing%20Headgear`)
	})

	test("has no associated publications when both fields are empty", () => {
		expect(result.associatedPublications).toBeUndefined()
	})

	test("carries prm image rights guidance, with no third-party copyright notice", () => {
		expect(result.imageRights?.notPrmCopyright).toBe(false)
		expect(result.imageRights?.photographicServicesHref).toBe(
			"https://prm.web.ox.ac.uk/photographic-services",
		)
		expect(result.imageRights?.termsHref).toBe(
			"https://www.prm.ox.ac.uk/collections-online-terms-and-conditions",
		)
	})
})

onlyFor("hsm")("props (hsm)", () => {
	const result = props(object, iiif)

	test("uses the hsm labels", () => {
		expect(result.labels).toMatchObject({ persons: "Makers", accession: "Accession Number" })
	})

	test("falls back to the museum acknowledgement when assets carry no rights", () => {
		expect(result.imageCopyright).toBe(
			"Acknowledgement: © History of Science Museum, University of Oxford, inv.13431",
		)
	})

	test("builds image URLs from S3 multimedia paths", () => {
		const url =
			"https://hsm-online-collections-assets-prd.s3.eu-west-1.amazonaws.com/emu/emumultimedia/multimedia/50/117/DSC_0028.1000x1000.jpg"

		expect(result.images).toEqual([{ url, thumbnail: url }])
	})

	test("structured dimensions render as labelled lines", () => {
		expect(result.dimensions).toBe("Weight: 91g")
	})

	test("makers link by full name when there is no party id", () => {
		expect(result.persons).toEqual([
			{ role: undefined, name: "Thorlabs", href: `${search}/persons.fullName:Thorlabs` },
		])
	})

	test("item type links to the object type search", () => {
		expect(result.itemType).toEqual({
			label: "Object",
			href: `${search}/object.objectType:Object`,
		})
	})

	test("links nested physical fields and keeps the description separate", () => {
		expect(result.physicalMaterial).toEqual([
			{ label: "Cardboard", href: `${search}/physical.material:Cardboard` },
		])
		expect(result.description).toStartWith("Printed cardboard rectangular box")
	})

	test("inscriptions and provenance come from nested objects", () => {
		expect(result.primaryInscriptions).toStartWith("Wording on printed cardboard box")
		expect(result.otherInscriptions).toBeUndefined()
		expect(result.provenance).toStartWith("Transferred from the Ultrafast Physics Group")
	})

	test("identifier numbers", () => {
		expect(result.inventoryNumber).toBe("13431")
		expect(result.accessionNumbers).toEqual(["2012-9/2"])
	})
})
