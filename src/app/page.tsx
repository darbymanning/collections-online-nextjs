import { museum } from "$library/config"
import { slugify } from "$library/slug"
import Link from "next/link"

let id: string
let title: string

switch (process.env.MUSEUM) {
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
		<>
			<Link href={`/item/${id}/${slugify(title)}`}>New</Link>
			<Link href={`${museum.urls.legacy.collectionsOnline}#/item/${id}`}>Existing</Link>
		</>
	)
}
