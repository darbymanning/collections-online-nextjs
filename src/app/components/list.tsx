"use client"

import { useState } from "react"

type Props = {
	links: Array<{ label: string; href: string }>
	association: string
}

// styled-jsx's class injection is dropped by React Compiler memoization,
// so this component must opt out of it
export function List({ links, association }: Props) {
	"use no memo"

	const [open, setOpen] = useState(false)

	const last = links[links.length - 1]

	return (
		<div data-open={open ? "" : undefined}>
			<div className="row">
				<div className="views">
					<div className="view closed">
						<div>
							<a href={last.href}>{last.label}</a>, ({association})
						</div>
					</div>
					<div className="view opened">
						<div>
							{links.map((link, index) => (
								<span key={index}>
									<a href={link.href}>{link.label}</a>
									{index < links.length - 1 && <span className="chevron"> &gt; </span>}
								</span>
							))}
							, ({association})
						</div>
					</div>
				</div>
				<button
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-label={open ? "Collapse place hierarchy" : "Expand place hierarchy"}
				>
					<span className="icon" aria-hidden="true">
						<span className="bar-h" />
						<span className="bar-v" />
					</span>
				</button>
			</div>
			<style jsx>{`
				.row {
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					gap: 0.5rem;
				}

				.views {
					flex: 1;
					min-width: 0;
				}

				.view {
					display: grid;
					transition: grid-template-rows 0.3s ease;
				}

				.view > div {
					overflow: hidden;
					min-height: 0;
				}

				.closed {
					grid-template-rows: 1fr;
				}

				[data-open] .closed {
					grid-template-rows: 0fr;
				}

				.opened {
					grid-template-rows: 0fr;
				}

				[data-open] .opened {
					grid-template-rows: 1fr;
				}

				.chevron {
					opacity: 0.5;
				}

				button {
					cursor: pointer;
					flex-shrink: 0;
					padding: 0.25rem;
					margin-top: 0.1rem;
				}

				.icon {
					position: relative;
					display: block;
					width: 14px;
					height: 14px;
					transition: rotate 0.25s ease;
				}

				.bar-h,
				.bar-v {
					position: absolute;
					background: currentColor;
					border-radius: 1px;
				}

				.bar-h {
					top: 50%;
					left: 0;
					width: 100%;
					height: 2px;
					translate: 0 -50%;
					transition: all 0.25s ease;
				}

				.bar-v {
					left: 50%;
					top: 0;
					width: 2px;
					height: 100%;
					translate: -50% 0;
				}

				[data-open] .icon {
					rotate: 90deg;
				}

				[data-open] .bar-h {
					scale: 0;
				}
			`}</style>
		</div>
	)
}
