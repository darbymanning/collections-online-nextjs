"use client"

import { useEffect, useRef, useState } from "react"
import type OpenSeadragon from "openseadragon"

export type Image = {
	/** IIIF Image API service base URL, e.g. "https://dams.ashmus.ox.ac.uk/iiif/image/12973" */
	service?: string
	/** plain image URL for museums without a IIIF DAMs */
	url?: string
	thumbnail?: string
}

type Props = {
	label: string
	images: Array<Image>
}

// gestureSettingsTouch is a live, mutable settings object the viewer reads per
// gesture, and navigator is the minimap instance — neither is in OpenSeadragon's
// public type definitions
type ViewerWithGestures = OpenSeadragon.Viewer & {
	gestureSettingsTouch: OpenSeadragon.GestureSettings
	navigator?: { element: HTMLElement }
}

// rounded white control buttons floating over the viewer
const controlClass =
	"grid h-8 w-8 place-items-center rounded-full bg-white text-base/none font-bold text-gray-600 opacity-85 shadow-md ring-1 ring-black/5 transition-opacity duration-[250ms] hover:opacity-100"

export function ImageViewer({ label, images }: Props) {
	const frame = useRef<HTMLDivElement>(null)
	const element = useRef<HTMLDivElement>(null)
	const viewer = useRef<OpenSeadragon.Viewer>(null)
	const [page, setPage] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)
	// usage hint shown over the viewer: "scroll" nudges towards ⌘/Ctrl+scroll to zoom
	// (mouse), "touch" towards two-finger panning (cf. google maps embed)
	const [hint, setHint] = useState<"scroll" | "touch" | "">("")
	const [isMac, setIsMac] = useState(false)
	// scroll-to-zoom and one-finger pan are gated except in fullscreen, where there's
	// no surrounding page to scroll; read live so the handlers stay current
	const fullscreenRef = useRef(false)
	const hintTimer = useRef<ReturnType<typeof setTimeout>>(null)

	// flash a usage hint over the viewer, then fade it out
	function showHint(kind: "scroll" | "touch") {
		setHint(kind)
		if (hintTimer.current) clearTimeout(hintTimer.current)
		hintTimer.current = setTimeout(() => setHint(""), 1500)
	}

	// Cooperative gestures (cf. google maps embed): out of fullscreen a one-finger
	// drag scrolls the page rather than panning the image — only two fingers pan and
	// zoom. In fullscreen there's no page to scroll, so one-finger panning is restored.
	function applyTouchMode(isFullscreen: boolean) {
		const v = viewer.current as ViewerWithGestures | null
		if (!v) return
		const touchAction = isFullscreen ? "none" : "pan-y"
		v.canvas.style.touchAction = touchAction
		v.container.style.touchAction = touchAction
		// the navigator minimap is a separate element OSD also pins to touch-action:none
		if (v.navigator) v.navigator.element.style.touchAction = touchAction
		v.gestureSettingsTouch.dragToPan = isFullscreen
	}

	useEffect(() => {
		fullscreenRef.current = fullscreen
		applyTouchMode(fullscreen)
	}, [fullscreen])

	useEffect(() => {
		setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.userAgent))
	}, [])

	useEffect(() => {
		let cancelled = false

		// OpenSeadragon touches browser globals on load, so it can only be imported client-side
		import("openseadragon").then(({ default: OpenSeadragon }) => {
			if (cancelled || !element.current || viewer.current) return

			viewer.current = OpenSeadragon({
				element: element.current,
				// the inline image source spec isn't modelled by the type definitions
				tileSources: images.map((image) =>
					image.service
						? `${image.service}/info.json`
						: // buildPyramid reads pixels back from a canvas, which cross-origin
							// images without CORS headers (e.g. the oum S3 bucket) don't allow
							{ type: "image", url: image.url, buildPyramid: false },
				) as OpenSeadragon.Options["tileSources"],
				sequenceMode: true,
				showSequenceControl: false,
				showNavigationControl: false,
				showNavigator: true,
				navigatorPosition: "BOTTOM_RIGHT",
				navigatorBorderColor: "transparent",
				gestureSettingsMouse: { clickToZoom: true, dblClickToZoom: true },
				// cooperative touch gestures: one finger scrolls the page, two pan/zoom
				gestureSettingsTouch: { dragToPan: false },
				// the default WebGL drawer logs "Error creating texture" in some browsers
				drawer: "canvas",
				maxZoomPixelRatio: 2,
				visibilityRatio: 1,
			})

			// OpenSeadragon pins touch-action:none on its canvas, which traps page
			// scroll on touch; relax it (and re-enable one-finger pan in fullscreen)
			applyTouchMode(fullscreenRef.current)

			// google-maps style: don't hijack the page scroll for zoom unless a
			// modifier key is held; otherwise nudge the user towards it
			viewer.current.addHandler("canvas-scroll", (event) => {
				const original = event.originalEvent as MouseEvent
				const zoomModifier = original.metaKey || original.ctrlKey

				if (zoomModifier || fullscreenRef.current) return

				event.preventDefaultAction = true
				event.preventDefault = false

				showHint("scroll")
			})
		})

		function onFullscreenChange() {
			setFullscreen(Boolean(document.fullscreenElement))
		}

		// native fullscreen exits (e.g. Esc) don't go through the toggle button;
		// Esc also exits the fill-the-window fallback, which has no native event
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && !document.fullscreenElement) setFullscreen(false)
		}

		// while a single finger drags over the embedded viewer the page scrolls, so
		// nudge the user towards two-finger panning; two fingers pan/zoom, clear it
		function onTouchMove(event: TouchEvent) {
			if (fullscreenRef.current) return
			if (event.touches.length >= 2) {
				if (hintTimer.current) clearTimeout(hintTimer.current)
				setHint("")
				return
			}
			showHint("touch")
		}

		const frameElement = frame.current
		document.addEventListener("fullscreenchange", onFullscreenChange)
		document.addEventListener("keydown", onKeyDown)
		frameElement?.addEventListener("touchmove", onTouchMove, { passive: true })

		return () => {
			cancelled = true
			if (hintTimer.current) clearTimeout(hintTimer.current)
			document.removeEventListener("fullscreenchange", onFullscreenChange)
			document.removeEventListener("keydown", onKeyDown)
			frameElement?.removeEventListener("touchmove", onTouchMove)
			viewer.current?.destroy()
			viewer.current = null
		}
	}, [images])

	function zoomBy(factor: number) {
		const viewport = viewer.current?.viewport

		if (!viewport) return

		viewport.zoomBy(factor)
		viewport.applyConstraints()
	}

	function rotateBy(degrees: number) {
		const viewport = viewer.current?.viewport

		if (!viewport) return

		viewport.setRotation(viewport.getRotation() + degrees)
	}

	function reset() {
		const viewport = viewer.current?.viewport

		if (!viewport) return

		viewport.setRotation(0)
		viewport.goHome()
	}

	function toggleFullscreen() {
		if (fullscreen) {
			if (document.fullscreenElement) document.exitFullscreen()
			setFullscreen(false)
		} else {
			// embeds without fullscreen permission reject — the [data-full]
			// styling still fills the window either way
			frame.current?.requestFullscreen().catch(() => {})
			setFullscreen(true)
		}
	}

	function goToPage(index: number) {
		viewer.current?.goToPage(index)
		setPage(index)
	}

	return (
		<div className="grid gap-3">
			<div
				ref={frame}
				className="relative h-136 overflow-hidden rounded-2xl bg-black data-full:z-1 data-[full]:fixed data-[full]:inset-0 data-[full]:h-auto data-[full]:rounded-none"
				data-full={fullscreen ? "" : undefined}
			>
				<div
					ref={element}
					className="absolute inset-0"
					aria-label={`Zoomable image of ${label}`}
				/>
				<div
					aria-hidden={!hint}
					className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-250 data-[show]:opacity-100"
					data-show={hint ? "" : undefined}
				>
					<p className="rounded-lg bg-black/70 px-4 py-2 text-center text-sm text-white">
						{hint === "touch"
							? "Use two fingers to move the image"
							: `Use ${isMac ? "\u2318" : "Ctrl"} + scroll to zoom the image`}
					</p>
				</div>
				<div className="absolute top-3 right-3 grid gap-2">
					<button
						onClick={() => zoomBy(2)}
						aria-label="Zoom in"
						title="Zoom in"
						className={controlClass}
					>
						+
					</button>
					<button
						onClick={() => zoomBy(0.5)}
						aria-label="Zoom out"
						title="Zoom out"
						className={controlClass}
					>
						&minus;
					</button>
					<button
						onClick={() => rotateBy(-90)}
						aria-label="Rotate left"
						title="Rotate left"
						className={controlClass}
					>
						&#x21ba;
					</button>
					<button
						onClick={() => rotateBy(90)}
						aria-label="Rotate right"
						title="Rotate right"
						className={controlClass}
					>
						&#x21bb;
					</button>
					<button
						onClick={reset}
						aria-label="Reset view"
						title="Reset view"
						className={controlClass}
					>
						&#x2302;
					</button>
					<button
						onClick={toggleFullscreen}
						aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
						title={fullscreen ? "Exit full screen" : "Enter full screen"}
						className={controlClass}
					>
						{fullscreen ? <>&#x2922;</> : <>&#x2921;</>}
					</button>
				</div>
			</div>
			{images.length > 1 && (
				<div className="flex justify-center gap-3">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => goToPage(index)}
							aria-label={`View image ${index + 1} of ${images.length}`}
							aria-current={page === index}
							className="overflow-hidden rounded-xl border-2 border-transparent p-0 leading-none opacity-60 transition-[opacity,border-color] duration-250 hover:border-primary hover:opacity-100 aria-[current=true]:border-primary aria-[current=true]:opacity-100"
						>
							<img src={image.thumbnail} alt="" loading="lazy" className="h-16 w-auto" />
						</button>
					))}
				</div>
			)}
		</div>
	)
}
