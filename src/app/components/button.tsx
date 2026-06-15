import { cn } from "$library/utils"
import NextLink from "next/link"
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react"

type Base = {
	children: ReactNode
	/** hide any <svg> child at rest and reveal it (width + fade) on hover. Put the
	 * icon before or after the text to control which side it appears on. */
	revealIcon?: boolean
}

interface Link extends Base, Omit<ComponentPropsWithoutRef<typeof NextLink>, "children" | "href"> {
	href: ComponentPropsWithoutRef<typeof NextLink>["href"]
}

interface Button extends Base, Omit<ComponentPropsWithoutRef<"button">, "children" | "href"> {
	href?: undefined
}

type Props = Link | Button

type Rest = Omit<Link | Button, "children" | "revealIcon" | "className">

function isLink(props: Rest): props is Omit<Link, "children" | "revealIcon" | "className"> {
	return props.href !== undefined
}

/** Outline pill: white at rest; on hover the accent fills up from below and the
 * text reverses to white. Renders a NextLink when given `href`, otherwise a
 * `<button>` — any extra link/button props are spread through. */
export function Button(props: Link): ReactElement
export function Button(props: Button): ReactElement
export function Button({ children, revealIcon, className, ...rest }: Props): ReactElement {
	const merged = {
		...rest,
		className: cn(
			"group relative inline-flex min-h-12 shrink-0 cursor-pointer items-center overflow-hidden rounded-md px-4 font-medium no-underline ring-2 ring-accent/20 text-accent transition-[color,box-shadow] duration-300 hover:text-white hover:ring-accent",
			revealIcon &&
				"[&_svg]:h-[1em] [&_svg]:w-0 [&_svg]:opacity-0 [&_svg]:transition-all [&_svg]:duration-300 hover:[&_svg]:mx-1 hover:[&_svg]:w-[1em] hover:[&_svg]:opacity-100",
			className,
		),
	}

	const content = (
		<>
			{/* white at rest as a clipped LAYER (not the element bg, which would bleed
			 * a sliver through the rounded corners); the accent fill slides up over it */}
			<span
				className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0"
				aria-hidden
			/>
			<span className="relative inline-flex items-center text-sm">{children}</span>
		</>
	)

	return isLink(merged) ? (
		<NextLink {...merged}>{content}</NextLink>
	) : (
		<button {...merged}>{content}</button>
	)
}
