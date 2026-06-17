import { cn } from "$library/utils"
import type { ReactNode } from "react"

// http(s) URLs, stopping at whitespace or an angle bracket
const urlPattern = /https?:\/\/[^\s<]+/g
// punctuation that commonly trails a URL in prose but isn't part of it
const trailingPunctuation = /[.,;:!?)\]}'"]+$/

/** Split a run of text into nodes, turning bare URLs into anchors with the brand
 * hover underline. Sentence punctuation that trails a URL is kept as plain text. */
function linkify(text: string): ReactNode[] {
	const nodes: ReactNode[] = []
	let lastIndex = 0

	for (const match of text.matchAll(urlPattern)) {
		const start = match.index ?? 0
		let url = match[0]
		const trailing = url.match(trailingPunctuation)?.[0] ?? ""
		if (trailing) url = url.slice(0, -trailing.length)

		if (start > lastIndex) nodes.push(text.slice(lastIndex, start))
		nodes.push(
			<a
				key={start}
				href={url}
				className="animated-underline font-semibold text-primary hover:[--underline-w:100%]"
			>
				{url}
			</a>,
		)
		if (trailing) nodes.push(trailing)
		lastIndex = start + match[0].length
	}

	if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
	return nodes
}

type Props = {
	/** raw catalogue text, with paragraphs separated by newlines */
	children: string
	className?: string
}

/** Renders a block of plain catalogue text: newline-separated blocks become
 * paragraphs and bare URLs become anchors. Used wherever a free-text field would
 * otherwise be a `whitespace-pre-line` wall (Description, Research and responses). */
export function RichText({ children, className }: Props) {
	const paragraphs = children
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)

	return (
		<div className={cn("grid gap-4 wrap-anywhere", className)}>
			{paragraphs.map((paragraph, index) => (
				<p key={index}>{linkify(paragraph)}</p>
			))}
		</div>
	)
}
