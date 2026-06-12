/** Refresh the unit-test fixtures in test/fixtures/ from the live APIs.
 *
 * Fetches the full collection object for each museum's known home-page item,
 * plus the IIIF manifest for the museums with a DAMs (ash, prm). */
import { $ } from "bun"

// config.ts reads MUSEUM at module scope, so the import must stay dynamic
// (static imports hoist above this assignment)
process.env.MUSEUM ??= "ash"
const { museumDirectory } = await import("../src/app/library/config")

const items = {
	ash: "ash-object-312375",
	oum: "oum-catalogue-36916",
	prm: "prm-object-79439",
	hsm: "hsm-catalogue-29715",
} as const

for (const [ref, id] of Object.entries(items) as Array<[keyof typeof items, string]>) {
	const response = await fetch(`https://prd-online.glamdigital.io/v2/item/${id}/full`)

	if (!response.ok) throw new Error(`Failed to fetch ${id}: ${response.status}`)

	const object = await response.json()
	await Bun.write(`test/fixtures/${id}.json`, `${JSON.stringify(object, null, "\t")}\n`)
	console.log(`test/fixtures/${id}.json`)

	const museum = museumDirectory[ref]

	if (!("dams" in museum)) continue

	// Mirrors the id selection in api.getDamsIiif
	const damsId = ref === "ash" ? String(object.irn) : object.objectNumberSorting1
	const manifest = await fetch(`${museum.dams}${damsId}/manifest`)

	// Objects without digitised assets have no manifest
	if (!manifest.ok) continue

	await Bun.write(
		`test/fixtures/${id}.iiif.json`,
		`${JSON.stringify(await manifest.json(), null, "\t")}\n`,
	)
	console.log(`test/fixtures/${id}.iiif.json`)
}

// JSON.stringify and oxfmt disagree on short arrays — keep fmt:check happy
await $`bunx oxfmt test/fixtures`.quiet()
