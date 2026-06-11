import { museums } from "./types"

function parent(url: URL): URL {
	const parts = url.hostname.split(".")

	if (parts.length > 2) url.hostname = parts.slice(1).join(".")

	return new URL(url.origin)
}

const self = new URL(museums[process.env.MUSEUM].url)

export const urls = {
	self,
	parent: parent(self),
	simpleSearch: new URL(parent(self) + "/collections-online#/search/simple-search"),
}
