"use client"

import { useEffect, useRef, useState } from "react"

const SCROLL_THRESHOLD_PX = 200

export function useHeaderScrollHide() {
	const [hidden, setHidden] = useState(false)
	const lastScrollY = useRef(0)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		lastScrollY.current = window.scrollY

		function onScroll() {
			const scrollY = window.scrollY
			const scrollingUp = scrollY < lastScrollY.current
			lastScrollY.current = scrollY

			if (scrollY < SCROLL_THRESHOLD_PX) {
				setHidden(false)
				return
			}

			setHidden(!scrollingUp)
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return hidden
}
