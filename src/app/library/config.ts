import { museums } from "./types"

function parent(url: URL): URL {
	const parts = url.hostname.split(".")

	if (parts.length > 2) url.hostname = parts.slice(1).join(".")

	return new URL(url.origin)
}

const current = museums[process.env.MUSEUM]
const self = new URL(current.url)

export const museum = {
	...current,
	urls: {
		self,
		parent: parent(self),
		simpleSearch: new URL(parent(self) + "/collections-online#/search/simple-search"),
	},
}
