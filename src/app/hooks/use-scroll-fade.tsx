"use client"

import { useEffect, useRef } from "react"

/** Drives the `scroll-fade` edge fades on browsers without CSS scroll-driven
 * animations (notably iOS Safari). Where `animation-timeline: scroll()` is
 * supported the `scroll-fade` utility handles this in pure CSS, so this hook
 * no-ops and attaches nothing. Otherwise it sets `--scroll-fade-start` /
 * `--scroll-fade-end` — the same registered properties the CSS mask reads —
 * from the live scroll position, mirroring the keyframes' ramps.
 *
 * Returns a ref to place on the horizontally scrollable element. */
export function useScrollFade<T extends HTMLElement>() {
	const ref = useRef<T>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		// where scroll-driven animations work, the pure-CSS path already handles it
		if (CSS.supports("animation-timeline: scroll()")) return

		const fadeSize = resolveFadeSize(el)
		let frame = 0

		function update() {
			frame = 0
			const node = ref.current
			if (!node) return
			const maxScroll = node.scrollWidth - node.clientWidth
			const start = Math.min(node.scrollLeft, fadeSize)
			const end = Math.min(Math.max(maxScroll - node.scrollLeft, 0), fadeSize)
			node.style.setProperty("--scroll-fade-start", `${start}px`)
			node.style.setProperty("--scroll-fade-end", `${end}px`)
		}

		// coalesce bursts of scroll/resize into one write per frame
		function schedule() {
			if (frame) return
			frame = requestAnimationFrame(update)
		}

		update()
		el.addEventListener("scroll", schedule, { passive: true })
		const observer = new ResizeObserver(schedule)
		observer.observe(el)

		return () => {
			el.removeEventListener("scroll", schedule)
			observer.disconnect()
			if (frame) cancelAnimationFrame(frame)
		}
	}, [])

	return ref
}

/** Resolves `--scroll-fade-size` (declared in rem) to pixels. */
function resolveFadeSize(el: HTMLElement): number {
	const raw = getComputedStyle(el).getPropertyValue("--scroll-fade-size").trim()
	const value = parseFloat(raw)
	if (Number.isNaN(value)) return 0
	if (raw.endsWith("rem")) {
		return value * parseFloat(getComputedStyle(document.documentElement).fontSize)
	}
	return value
}
