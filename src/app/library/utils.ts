export const list = {
	readable(list: Array<string>): string {
		return new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(list)
	},
}
