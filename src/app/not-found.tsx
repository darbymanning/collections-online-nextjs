import { museum } from "$library/config"
import { SiteSearch } from "$components/site-search"
import { NotFoundMark } from "$components/not-found-mark"

// Root not-found: renders for our own `notFound()` calls (e.g. a foreign-museum
// id on this deployment) and for any URL the app doesn't match. Sits inside the
// root layout, so the header is already there — this just fills the page below
// it with a calm, centred message and the same search bar as the header. The
// animated brand mark (and its CSS) is split out per museum in `NotFoundMark`, so
// only the active deployment's mark ships here, not all four.
export default function NotFound() {
	return (
		<section className="flex grow flex-col items-center justify-center gap-8 bg-background px-[5vw] py-24 text-center">
			<p className="font-mono text-sm tracking-[0.3em] text-primary">404</p>
			<NotFoundMark />
			<div className="grid gap-4">
				<h1 className="text-5xl font-semibold">Page not found</h1>
				<p className="mx-auto max-w-prose text-pretty text-foreground/70">
					Sorry, we couldn’t find the page you’re looking for. It may have moved or no longer
					exists.
				</p>
			</div>
			<SiteSearch className="mt-2" />
			<a
				href={museum.url.toString()}
				className="rounded animated-underline text-sm font-semibold text-primary hover:[--underline-w:100%]"
			>
				Back to {museum.name}
			</a>
		</section>
	)
}
