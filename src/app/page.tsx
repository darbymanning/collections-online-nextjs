import Link from "next/link"

export default function Home() {
	switch (process.env.MUSEUM) {
		case "ash":
			return (
				<Link href="/item/ash-object-312375/tin-glazed-tile-in-italian-style">
					Example with /item/ash-object-312375/tin-glazed-tile-in-italian-style
				</Link>
			)

		case "oum":
			return (
				<Link href="/item/oum-catalogue-36916/topaz-single-colourless-crystal">
					Example with /item/oum-catalogue-36916/topaz-single-colourless-crystal
				</Link>
			)

		case "prm":
			return (
				<Link href="/item/prm-object-79439/headdress-mask-representing-abam-a-predatory-fish">
					Example with /item/prm-object-79439/headdress-mask-representing-abam-a-predatory-fish
				</Link>
			)

		case "hsm":
			return (
				<Link href="/item/hsm-catalogue-29715/two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs-new-jersey-usa-early-21st-century">
					Example with
					/item/hsm-catalogue-29715/two-cardboard-boxes-for-lab-snacks-issued-by-thorlabs-new-jersey-usa-early-21st-century
				</Link>
			)

		default:
			return null
	}
}
