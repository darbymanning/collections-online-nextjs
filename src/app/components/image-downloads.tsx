"use client"

import { useState } from "react"
import { Button } from "./button"

export type Download = {
	/** full-resolution image URL to save */
	url: string
	thumbnail?: string
	/** suggested filename, e.g. "RS222313_PRM1996.27.3.1.jpg" */
	filename: string
}

type Props = {
	images: Array<Download>
}

/** Reimplements the legacy "Download images" accordion: a toggle that reveals a
 * grid of the object's digitised images, each saving the full-resolution file.
 * The DAMs serves the images with `Access-Control-Allow-Origin: *`, so the blob
 * fetch + object URL works cross-origin; if it ever fails we fall back to
 * opening the image in a new tab. */
export function ImageDownloads({ images }: Props) {
	const [open, setOpen] = useState(false)

	async function save({ url, filename }: Download) {
		try {
			const response = await fetch(url)
			const blob = await response.blob()
			const objectUrl = URL.createObjectURL(blob)
			const anchor = document.createElement("a")
			anchor.href = objectUrl
			anchor.download = filename
			document.body.appendChild(anchor)
			anchor.click()
			anchor.remove()
			URL.revokeObjectURL(objectUrl)
		} catch {
			window.open(url, "_blank", "noopener")
		}
	}

	return (
		<div
			className="group/downloads grid justify-items-center gap-3"
			data-open={open ? "" : undefined}
		>
			<Button size="sm" onClick={() => setOpen(!open)} aria-expanded={open}>
				Download images
				{/* chevron points right at rest, rotates to point down when expanded */}
				<svg
					viewBox="0 0 24 24"
					aria-hidden
					className="ml-2 size-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-data-[open]/downloads:rotate-90"
				>
					<path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</Button>
			{/* collapse via a grid-rows transition (cf. List), so the panel animates
			 * smoothly without measuring its height. The group is named so it doesn't
			 * clash with the unnamed `group-hover` the Button uses for its fill. */}
			<div className="grid w-full grid-rows-[0fr] [transition:grid-template-rows_0.3s_ease] group-data-open/downloads:grid-rows-[1fr]">
				<div className="min-h-0 overflow-hidden">
					<ul
						className="grid gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3"
						inert={open ? false : true}
					>
						{images.map((image) => (
							<li key={image.url}>
								<button
									onClick={() => save(image)}
									className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left ring-2 ring-accent/20 transition-shadow duration-300 hover:ring-accent"
								>
									{image.thumbnail && (
										<img
											src={image.thumbnail}
											alt=""
											loading="lazy"
											className="size-12 shrink-0 rounded object-cover"
										/>
									)}
									<span className="min-w-0 flex-1 text-xs font-semibold break-all text-accent">
										{image.filename}
									</span>
									<svg
										viewBox="0 0 24 24"
										aria-hidden
										className="size-4 shrink-0 fill-none stroke-accent stroke-2"
									>
										<path
											d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
