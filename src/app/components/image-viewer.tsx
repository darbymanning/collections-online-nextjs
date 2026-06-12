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

// styled-jsx's class injection is dropped by React Compiler memoization,
// so this component must opt out of it
export function ImageViewer({ label, images }: Props) {
	"use no memo"

	const frame = useRef<HTMLDivElement>(null)
	const element = useRef<HTMLDivElement>(null)
	const viewer = useRef<OpenSeadragon.Viewer>(null)
	const [page, setPage] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)

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
				// the default WebGL drawer logs "Error creating texture" in some browsers
				drawer: "canvas",
				maxZoomPixelRatio: 2,
				visibilityRatio: 1,
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

		document.addEventListener("fullscreenchange", onFullscreenChange)
		document.addEventListener("keydown", onKeyDown)

		return () => {
			cancelled = true
			document.removeEventListener("fullscreenchange", onFullscreenChange)
			document.removeEventListener("keydown", onKeyDown)
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
		<div className="root">
			<div ref={frame} className="frame" data-full={fullscreen ? "" : undefined}>
				<div ref={element} className="viewer" aria-label={`Zoomable image of ${label}`} />
				<div className="controls">
					<button onClick={() => zoomBy(2)} aria-label="Zoom in" title="Zoom in">
						+
					</button>
					<button onClick={() => zoomBy(0.5)} aria-label="Zoom out" title="Zoom out">
						&minus;
					</button>
					<button onClick={() => rotateBy(-90)} aria-label="Rotate left" title="Rotate left">
						&#x21ba;
					</button>
					<button onClick={() => rotateBy(90)} aria-label="Rotate right" title="Rotate right">
						&#x21bb;
					</button>
					<button onClick={reset} aria-label="Reset view" title="Reset view">
						&#x2302;
					</button>
					<button
						onClick={toggleFullscreen}
						aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
						title={fullscreen ? "Exit full screen" : "Enter full screen"}
					>
						{fullscreen ? <>&#x2922;</> : <>&#x2921;</>}
					</button>
				</div>
			</div>
			{images.length > 1 && (
				<div className="thumbnails">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => goToPage(index)}
							aria-label={`View image ${index + 1} of ${images.length}`}
							aria-current={page === index}
						>
							<img src={image.thumbnail} alt="" loading="lazy" />
						</button>
					))}
				</div>
			)}
			<style jsx>{`
				.root {
					display: grid;
					gap: 0.75rem;
				}

				.frame {
					position: relative;
					height: 34rem;
					background: var(--c-black);
				}

				.frame[data-full] {
					position: fixed;
					inset: 0;
					height: auto;
					z-index: 1;
				}

				.viewer {
					position: absolute;
					inset: 0;
				}

				.controls {
					position: absolute;
					top: 0.75rem;
					right: 0.75rem;
					display: grid;
					gap: 0.5rem;
				}

				.controls button {
					cursor: pointer;
					width: 2rem;
					height: 2rem;
					display: grid;
					place-items: center;
					font: 700 1rem/1 var(--f-family);
					color: var(--c-gray);
					background: var(--c-white);
					border-radius: var(--r-x);
					opacity: 0.85;
					transition: opacity 0.25s ease;
				}

				.controls button:hover {
					opacity: 1;
				}

				.thumbnails {
					display: flex;
					justify-content: center;
					gap: 0.5rem;
				}

				.thumbnails button {
					cursor: pointer;
					padding: 0;
					line-height: 0;
					border: 2px solid transparent;
					opacity: 0.6;
					transition:
						opacity 0.25s ease,
						border-color 0.25s ease;
				}

				.thumbnails button[aria-current="true"],
				.thumbnails button:hover {
					opacity: 1;
					border-color: var(--c-gray);
				}

				.thumbnails img {
					height: 4rem;
					width: auto;
				}
			`}</style>
		</div>
	)
}
