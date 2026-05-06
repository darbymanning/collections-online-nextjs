import { api } from "../library/api"

type Params = {
	params: Promise<{
		id: string
	}>
}

function List({ list, base }: { list: string; base: string }) {
	const places = {
		last(list: string): string {
			return list.split(" > ").pop() ?? list
		},
		array(list: string): Array<string> {
			return list.split(" > ")
		},
		link(list: string, index: number): string {
			const items = places.array(list).slice(0, index + 1)
			return encodeURI(base + items.join(" > "))
		},
	}

	return (
		<details>
			<summary>
				<a href={places.link(list, places.array(list).length)}>{places.last(list)}</a>
			</summary>
			<ol>
				{places.array(list).map((place, index) => (
					<li key={index}>
						<a href={places.link(list, index)}>{place}</a>
					</li>
				))}
			</ol>
		</details>
	)
}
export default async function Page({ params }: Params) {
	const json = await api.getCollectionObject((await params).id)

	const { recordTitle, objectNumbers, geographicalProvenance, datePeriod } = json

	return (
		<article>
			<header>
				<h1>{recordTitle}</h1>
				<ul>
					{objectNumbers.map((o, index) => (
						<li key={index}>{o.NumberVrt}</li>
					))}
				</ul>
			</header>
			<section>
				<h2>Details</h2>
				<dl>
					<dt>Title</dt>
					<dd>{recordTitle}</dd>

					<dt>Associated place</dt>
					{geographicalProvenance.map((p, index) => (
						<dd key={index}>
							<List
								list={p.place}
								base="#/search/simple-search/geographicalProvenance.place:"
							/>
							({p.association})
						</dd>
					))}

					<dt>Date</dt>
					{datePeriod.map((d, index) => (
						<dd key={index}>
							{d.period} ({d.type})
						</dd>
					))}
				</dl>
			</section>

			<pre>{JSON.stringify(json, null, 2)}</pre>
		</article>
	)
}
