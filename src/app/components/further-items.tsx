"use client"

import { Button } from "$components/button"
import type { FurtherItem, FurtherItemsSection } from "$library/further-items"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// the selected card sits at full size; the rest shrink, so the active item reads
// as featured (cf. ox.ac.uk's "Discover more" carousel)
const SCALE_MIN = 0.85

// fraction of the viewport every snap is inset by — matches the band's
// `mx-[-5vw]` bleed and the list's `pl-[5vw]` lead, so a rested card lines up
// with the heading above it on every breakpoint
const GUTTER = 0.05

export function FurtherItems({ title, items, more }: FurtherItemsSection) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		// align each snap to the content gutter (not the bled viewport edge), so
		// the active card always rests inset while slides still bleed mid-scroll
		align: () => window.innerWidth * GUTTER,
		containScroll: "trimSnaps",
	})

	const [selected, setSelected] = useState(0)
	const [snaps, setSnaps] = useState<Array<number>>([])
	const [canPrev, setCanPrev] = useState(false)
	const [canNext, setCanNext] = useState(false)
	const [failed, setFailed] = useState<Set<FurtherItem["id"]>>(new Set())

	useEffect(() => {
		if (!emblaApi) return

		const onSelect = () => {
			setSelected(emblaApi.selectedScrollSnap())
			setCanPrev(emblaApi.canScrollPrev())
			setCanNext(emblaApi.canScrollNext())
		}

		const onResize = () => setSnaps(emblaApi.scrollSnapList())

		onResize()
		onSelect()
		emblaApi.on("reInit", onResize).on("reInit", onSelect).on("select", onSelect)
	}, [emblaApi])

	const fail = (id: FurtherItem["id"]) =>
		setFailed((ids) => (ids.has(id) ? ids : new Set(ids).add(id)))

	return (
		<div className="grid gap-6">
			{/* heading left, more-items button right (cf. ox.ac.uk's "Discover more") */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h2 className="text-2xl font-semibold text-accent">{title}</h2>
				{more && (
					<Button href={more.href} revealIcon>
						{more.label}
						<svg aria-hidden>
							<use href="/sprite.svg#arrow" />
						</svg>
					</Button>
				)}
			</div>
			{/* viewport bleeds across the band padding to the screen edges so slides
			 * run off both sides mid-scroll; the leading `pl-[5vw]` gives the first
			 * card its gutter, and the embla `align` keeps every rested card inset to
			 * match it (on every breakpoint) */}
			<div className="further-items mx-[-5vw] overflow-hidden" ref={emblaRef}>
				<ul className="flex touch-pan-y pl-[5vw]">
					{items.map((item, index) => {
						const hasImage = item.image && !failed.has(item.id)

						return (
							<li
								key={item.id}
								className="min-w-0 shrink-0 grow-0 basis-[85%] pr-4 sm:basis-[60%] lg:basis-[42%]"
							>
								<Link
									href={item.href}
									style={{ transform: `scale(${index === selected ? 1 : SCALE_MIN})` }}
									className="group relative block aspect-4/3 origin-center overflow-hidden rounded-2xl no-underline transition-transform duration-300 ease-out"
								>
									{hasImage ? (
										<img
											src={item.image}
											alt=""
											loading="lazy"
											decoding="async"
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											// images that 404 before hydration never fire onError
											ref={(img) => {
												if (img?.complete && img.naturalWidth === 0) fail(item.id)
											}}
											onError={() => fail(item.id)}
										/>
									) : (
										// no-image fallback: elegant accent card with a muted icon
										<span className="grid h-full w-full place-items-center bg-accent text-[3rem] text-white/40">
											<ImageOff strokeWidth={1} aria-hidden />
										</span>
									)}
									<span
										className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
										aria-hidden
									/>
									{/* bottom-anchored, so the meta expanding below pushes the
									 * title up to reveal it on hover */}
									<span className="absolute inset-x-0 bottom-0 block p-4 text-white">
										<span className="line-clamp-2 text-2xl font-semibold">
											<span className="animated-underline group-hover:[--underline-w:100%]">
												{item.title}
											</span>
										</span>
										{(item.subTitle || item.objectNumber) && (
											<span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
												<span className="block min-h-0 overflow-hidden">
													<span className="block pt-1.5 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
														{item.subTitle && (
															<span className="line-clamp-2 text-white/85">
																{item.subTitle}
															</span>
														)}
														{item.objectNumber && (
															<span className="mt-1 block font-mono font-normal text-xs tracking-wider text-white/65">
																{item.objectNumber}
															</span>
														)}
													</span>
												</span>
											</span>
										)}
									</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-wrap gap-2">
					{snaps.length > 1 &&
						snaps.map((_, index) => (
							<button
								key={index}
								onClick={() => emblaApi?.scrollTo(index)}
								aria-label={`Go to slide ${index + 1}`}
								aria-current={index === selected}
								className="size-2.5 rounded-full bg-accent/25 transition-colors aria-current:bg-accent"
							/>
						))}
				</div>
				<div className="flex gap-3">
					<button
						onClick={() => emblaApi?.scrollPrev()}
						disabled={!canPrev}
						aria-label="Previous items"
						className="grid size-12 place-items-center rounded-full border-2 border-accent text-2xl text-accent transition-opacity disabled:opacity-40"
					>
						<ChevronLeft aria-hidden />
					</button>
					<button
						onClick={() => emblaApi?.scrollNext()}
						disabled={!canNext}
						aria-label="More items"
						className="grid size-12 place-items-center rounded-full bg-accent text-2xl text-white transition-opacity disabled:opacity-40"
					>
						<ChevronRight aria-hidden />
					</button>
				</div>
			</div>
		</div>
	)
}
