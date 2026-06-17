import { museum } from "$library/config"
import { slugify } from "$library/slug"
import { Button } from "$components/button"

let id: string
let title: string

switch (process.env.NEXT_PUBLIC_MUSEUM) {
	case "ash":
		id = "ash-object-312375"
		title = "Tin glazed tile in Italian style"
		break

	case "oum":
		id = "oum-catalogue-36916"
		title = "Topaz (single colourless crystal)"
		break

	case "prm":
		id = "prm-object-79439"
		title = "Headdress mask representing Abam, a predatory fish."
		break

	case "hsm":
		id = "hsm-catalogue-29715"
		title =
			"Two Cardboard Boxes for 'Lab Snacks', Issued by Thorlabs, New Jersey, USA, Early 21st Century"
		break
}

export default function Home() {
	return (
		<main className="grid flex-1 content-center justify-center gap-5 bg-white p-[5vw] text-center">
			<pre className="font-mono text-sm tracking-wider text-foreground/60">{id}</pre>
			<ol className="flex gap-6">
				<li>
					<Button href={`/item/${id}/${slugify(title)}`}>New Next.js app</Button>
				</li>
				<li>
					<Button href={`${museum.urls.legacy.collectionsOnline}#/item/${id}`}>
						Existing legacy
					</Button>
				</li>
			</ol>
		</main>
	)
}
