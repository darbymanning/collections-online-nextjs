import { museums } from "./types"

function parent(url: URL): URL {
	const parts = url.hostname.split(".")
	// clone — mutating the argument would strip a level per call
	const origin = new URL(url.origin)

	if (parts.length > 2) origin.hostname = parts.slice(1).join(".")

	return origin
}

const current = museums[process.env.MUSEUM]
const self = new URL(current.url)

export const museum = {
	...current,
	urls: {
		self,
		parent: parent(self),
		simpleSearch: new URL("/collections-online#/search/simple-search", parent(self)),
	},
}
