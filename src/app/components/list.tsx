"use client"

import { useState } from "react"

type Props = {
	links: Array<{ label: string; href: string }>
	association?: string
	prefix?: string
}

export function List({ links, association, prefix }: Props) {
	const [open, setOpen] = useState(false)

	const last = links[links.length - 1]

	return (
		<div className="group" data-open={open ? "" : undefined} data-testid="list">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<div className="grid grid-rows-[1fr] [transition:grid-template-rows_0.3s_ease] group-data-open:grid-rows-[0fr]">
						<div className="min-h-0 overflow-hidden clip-focus">
							{prefix ? `${prefix} ` : ""}
							<a className="rounded" href={last.href}>
								{last.label}
							</a>
							{association ? ` (${association})` : ""}
						</div>
					</div>
					<div
						className="grid grid-rows-[0fr] [transition:grid-template-rows_0.3s_ease] group-data-open:grid-rows-[1fr]"
						inert={open ? false : true}
						data-testid="list-expanded"
					>
						<div className="min-h-0 overflow-hidden clip-focus">
							{prefix ? `${prefix} ` : ""}
							{links.map((link, index) => (
								<span key={index}>
									<a className="rounded" href={link.href}>
										{link.label}
									</a>
									{index < links.length - 1 && <span className="opacity-50"> &gt; </span>}
								</span>
							))}
							{association ? ` (${association})` : ""}
						</div>
					</div>
				</div>
				{links.length > 1 && (
					<button
						onClick={() => setOpen(!open)}
						aria-expanded={open}
						aria-label={open ? "Collapse hierarchy" : "Expand hierarchy"}
						className="mt-[0.1rem] shrink-0 rounded p-1"
					>
						<span
							className="relative block size-3.5 [transition:rotate_0.25s_ease] group-data-open:rotate-90"
							aria-hidden="true"
						>
							<span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-[1px] bg-current [transition:all_0.25s_ease] group-data-open:scale-0" />
							<span className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 rounded-[1px] bg-current" />
						</span>
					</button>
				)}
			</div>
		</div>
	)
}
