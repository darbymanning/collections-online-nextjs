import { cn } from "$library/utils"
import NextLink from "next/link"
import type { ComponentPropsWithoutRef, CSSProperties, ReactElement, ReactNode } from "react"

type Base = {
	children: ReactNode
	/** hide any <svg> child at rest and reveal it (width + fade) on hover. Put the
	 * icon before or after the text to control which side it appears on. */
	revealIcon?: boolean
	/** pill size — `base` (default) or a more compact `sm`. */
	size?: "base" | "sm"
	/** accent colour: rest text + ring, and the fill that slides up on hover.
	 * Defaults to the brand primary. */
	fill?: string
	/** text colour once the fill covers the button on hover. Defaults to
	 * `--color-on-accent` (the accent's reverse colour); override when the fill
	 * isn't a brand accent (e.g. a button sitting on the accent band itself). */
	onFill?: string
	/** rest text + ring (the outline before hover) colour. Defaults to `fill`, so the
	 * outline previews the colour that slides up on hover; override when that fill is
	 * too dark to read as an outline (e.g. a deep accent on a photo — see `.oum`). */
	outline?: string
	/** rounded corner style: `base` (default) or a more compact `sm` or a full `full`. */
	rounded?: "base" | "sm" | "full"
}

interface Link extends Base, Omit<ComponentPropsWithoutRef<typeof NextLink>, "children" | "href"> {
	href: ComponentPropsWithoutRef<typeof NextLink>["href"]
}

interface Button extends Base, Omit<ComponentPropsWithoutRef<"button">, "children" | "href"> {
	href?: undefined
}

type Props = Link | Button

type Rest = Omit<
	Link | Button,
	"children" | "revealIcon" | "size" | "className" | "fill" | "onFill" | "outline" | "rounded"
>

function isLink(
	props: Rest,
): props is Omit<
	Link,
	"children" | "revealIcon" | "size" | "className" | "fill" | "onFill" | "outline" | "rounded"
> {
	return props.href !== undefined
}

const sizeClass = {
	base: "min-h-12 px-4 text-sm",
	sm: "min-h-9 px-3 text-xs",
} as const

/** Outline pill: white at rest; on hover the accent fills up from below and the
 * text reverses to white. Renders a NextLink when given `href`, otherwise a
 * `<button>` — any extra link/button props are spread through. */
export function Button(props: Link): ReactElement
export function Button(props: Button): ReactElement
export function Button({
	children,
	revealIcon,
	size = "base",
	className,
	fill,
	onFill,
	outline,
	rounded = "base",
	...rest
}: Props): ReactElement {
	const merged = {
		...rest,
		style: {
			"--fill": fill ?? "var(--color-primary)",
			"--rest": outline ?? fill ?? "var(--color-primary)",
			"--on-fill": onFill ?? "var(--color-on-accent)",
		} as CSSProperties,
		className: cn(
			"group relative inline-flex shrink-0 cursor-pointer items-center overflow-hidden font-medium text-(--rest) no-underline ring-2 ring-(--rest/20) transition-[color,box-shadow] duration-300 hover:text-(--on-fill) hover:ring-(--fill)",
			sizeClass[size],
			{ "rounded-full": rounded === "full" },
			{ "rounded-sm": rounded === "sm" },
			{ "rounded-md": rounded === "base" },
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
				className="absolute inset-0 translate-y-full bg-(--fill) transition-transform duration-300 ease-out group-hover:translate-y-0"
				aria-hidden
			/>
			<span className="relative inline-flex items-center">{children}</span>
		</>
	)

	return isLink(merged) ? (
		<NextLink {...merged}>{content}</NextLink>
	) : (
		<button {...merged}>{content}</button>
	)
}
