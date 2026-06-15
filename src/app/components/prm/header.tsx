"use client"
import { museum } from "$library/config"
import Image from "next/image"
import prmLogo from "$assets/prm-logo.svg"
import { useHeaderScrollHide } from "$hooks/use-scroll-hide"
import { ChevronDownIcon } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Button } from "$components/button"

type SearchScope = "collections-online" | "museum"

/** Build the upstream search URL for the chosen scope. Collections Online is a
 * hash-routed SPA (`#/search/simple-search/{phrase}`); the museum site runs a
 * Drupal site search (`/search/site/{phrase}`). */
function searchUrl(scope: SearchScope, phrase: string): string {
	const query = encodeURIComponent(phrase)
	if (scope === "collections-online") return `${museum.urls.legacy.simpleSearch}/${query}`
	return `${museum.urls.parent.origin}/search/site/${query}`
}

export function Header() {
	const hidden = useHeaderScrollHide()
	const [searchOpen, setSearchOpen] = useState(false)
	const [scope, setScope] = useState<SearchScope>("collections-online")
	const [phrase, setPhrase] = useState("")
	const headerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!headerRef.current) return
		document.body.style.setProperty("--header-height", `${headerRef.current.offsetHeight}px`)
	}, [headerRef])

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const trimmed = phrase.trim()
		if (!trimmed) return
		window.location.assign(searchUrl(scope, trimmed))
	}

	return (
		<>
			<header
				ref={headerRef}
				data-hidden={hidden || undefined}
				className="sticky top-0 z-20 flex items-center justify-between border-b border-current/10 accented px-[5vw] py-4 transition-[translate,opacity] duration-500 data-hidden:pointer-events-none data-hidden:-translate-y-full data-hidden:opacity-0"
			>
				<a href={museum.url.toString()}>
					<Image src={prmLogo} alt={museum.name} width={150} loading="eager" />
				</a>
				<div>
					<button
						className="rounded-full p-2"
						data-open={searchOpen || undefined}
						onClick={() => setSearchOpen(!searchOpen)}
					>
						<span className="search-icon"></span>
					</button>
				</div>
			</header>
			<form
				onSubmit={handleSubmit}
				data-open={searchOpen || undefined}
				className="fixed z-10 flex w-full -translate-y-full items-center justify-center overflow-auto rounded-b-4xl accented pt-(--header-height) shadow-2xl transition-[translate] duration-500 data-open:translate-none"
				inert={!searchOpen}
			>
				<div className="grid w-full gap-4 p-[5vw] text-sm">
					<h2 className="text-4xl max-md:hidden">Search</h2>
					<div className="grid grid-cols-[1fr_auto] gap-4 md:grid-cols-[auto_1fr_auto]">
						<div className="relative max-md:col-span-full">
							<select
								value={scope}
								onChange={(event) => setScope(event.target.value as SearchScope)}
								className="w-full appearance-none rounded-md bg-background p-4 pr-8 text-foreground"
							>
								<option value="collections-online">Collections Online</option>
								<option value="museum">Museum</option>
							</select>
							<ChevronDownIcon className="absolute top-1/2 right-2 -translate-y-1/2 transform text-foreground" />
						</div>
						<input
							type="search"
							value={phrase}
							onChange={(event) => setPhrase(event.target.value)}
							placeholder="Search by keyword"
							className="w-full appearance-none rounded-md bg-background p-4 text-foreground"
						/>
						<Button type="submit" fill="var(--color-secondary)" className="px-6 font-bold">
							Search
						</Button>
					</div>
				</div>
			</form>
		</>
	)
}
