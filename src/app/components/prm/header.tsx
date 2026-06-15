"use client"
import { museum } from "$library/config"
import Image from "next/image"
import prmLogo from "$assets/prm-logo.svg"
import { useHeaderScrollHide } from "$hooks/use-scroll-hide"

export function Header() {
	const hidden = useHeaderScrollHide()

	return (
		<header
			data-hidden={hidden || undefined}
			className="sticky top-0 z-10 border-b border-background/10 bg-accent px-[5vw] py-4 text-background transition-[translate,opacity] duration-500 data-hidden:pointer-events-none data-hidden:-translate-y-full data-hidden:opacity-0"
		>
			<a href={museum.url.toString()}>
				<Image src={prmLogo} alt={museum.name} width={150} />
			</a>
		</header>
	)
}
