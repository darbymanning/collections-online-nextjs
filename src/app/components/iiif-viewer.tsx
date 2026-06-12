"use client"

import { useEffect, useRef, useState } from "react"
import type OpenSeadragon from "openseadragon"

type Props = {
	label: string
	images: Array<{
		/** IIIF Image API service base URL, e.g. "https://dams.ashmus.ox.ac.uk/iiif/image/12973" */
		service: string
		thumbnail?: string
	}>
}

// styled-jsx's class injection is dropped by React Compiler memoization,
// so this component must opt out of it
export function IiifViewer({ label, images }: Props) {
	"use no memo"

	const element = useRef<HTMLDivElement>(null)
	const viewer = useRef<OpenSeadragon.Viewer>(null)
	const [page, setPage] = useState(0)

	useEffect(() => {
		let cancelled = false

		// OpenSeadragon touches browser globals on load, so it can only be imported client-side
		import("openseadragon").then(({ default: OpenSeadragon }) => {
			if (cancelled || !element.current || viewer.current) return

			viewer.current = OpenSeadragon({
				element: element.current,
				tileSources: images.map((image) => `${image.service}/info.json`),
				sequenceMode: true,
				showSequenceControl: false,
				showNavigationControl: false,
				// the default WebGL drawer logs "Error creating texture" in some browsers
				drawer: "canvas",
				maxZoomPixelRatio: 2,
				visibilityRatio: 1,
			})
		})

		return () => {
			cancelled = true
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

	function goToPage(index: number) {
		viewer.current?.goToPage(index)
		setPage(index)
	}

	return (
		<div className="root">
			<div className="frame">
				<div ref={element} className="viewer" aria-label={`Zoomable image of ${label}`} />
				<div className="controls">
					<button onClick={() => zoomBy(2)} aria-label="Zoom in">
						+
					</button>
					<button onClick={() => zoomBy(0.5)} aria-label="Zoom out">
						&minus;
					</button>
					<button onClick={() => viewer.current?.viewport.goHome()} aria-label="Reset zoom">
						&#x21ba;
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
