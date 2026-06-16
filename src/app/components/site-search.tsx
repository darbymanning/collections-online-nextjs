"use client"

import { Button } from "$components/button"
import { museum } from "$library/config"
import { cn } from "$library/utils"
import { ChevronDownIcon } from "lucide-react"
import { useState, type Dispatch, type FormEvent, type Ref, type SetStateAction } from "react"

/** Where a search runs: the Collections Online catalogue SPA, or the museum's
 * main Drupal site. Mirrored by the scope `<select>`. */
export type SearchScope = "collections-online" | "museum"

/** Build the upstream search URL for the chosen scope. Collections Online is a
 * hash-routed SPA (`#/search/simple-search/{phrase}`); the museum site runs a
 * Drupal site search (`/search/site/{phrase}`). */
export function searchUrl(scope: SearchScope, phrase: string): string {
	const query = encodeURIComponent(phrase)
	if (scope === "collections-online") return `${museum.urls.legacy.simpleSearch}/${query}`
	return `${museum.urls.parent.origin}/search/site/${query}`
}

type SearchFieldsProps = {
	scope: SearchScope
	setScope: Dispatch<SetStateAction<SearchScope>>
	phrase: string
	setPhrase: Dispatch<SetStateAction<string>>
	/** The header focuses this input when its search panel opens. */
	inputRef?: Ref<HTMLInputElement>
}

/** The scope select + keyword input + submit button row. Controlled, so the
 * caller owns the state and submit — shared verbatim by the header overlay and
 * the not-found page so the two search bars stay identical. */
export function SearchFields({ scope, setScope, phrase, setPhrase, inputRef }: SearchFieldsProps) {
	return (
		<div className="grid grid-cols-[1fr_auto] gap-4 md:grid-cols-[auto_1fr_auto]">
			<div className="relative max-md:col-span-full">
				<select
					value={scope}
					onChange={(event) => setScope(event.target.value as SearchScope)}
					aria-label="Search scope"
					className="w-full appearance-none rounded-md border border-border bg-background p-4 pr-8 text-foreground"
				>
					<option value="collections-online">Collections Online</option>
					<option value="museum">Museum</option>
				</select>
				<ChevronDownIcon className="absolute top-1/2 right-2 -translate-y-1/2 transform text-foreground" />
			</div>
			<input
				ref={inputRef}
				type="search"
				value={phrase}
				onChange={(event) => setPhrase(event.target.value)}
				placeholder="Search by keyword"
				aria-label="Search by keyword"
				className="w-full appearance-none rounded-md border border-border bg-background p-4 text-foreground"
			/>
			<Button
				type="submit"
				fill="var(--color-search-accent)"
				onFill="var(--color-background)"
				className="px-6 font-bold"
			>
				Search
			</Button>
		</div>
	)
}

/** A standalone search bar: the same scope-and-keyword controls as the header,
 * wrapped in their own `<form>` with local state. Used outside the header
 * overlay (e.g. the not-found page) where there's no panel to drive it. */
export function SiteSearch({ className }: { className?: string }) {
	const [scope, setScope] = useState<SearchScope>("collections-online")
	const [phrase, setPhrase] = useState("")

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const trimmed = phrase.trim()
		if (!trimmed) return
		window.location.assign(searchUrl(scope, trimmed))
	}

	return (
		<form
			role="search"
			aria-label="Search"
			onSubmit={handleSubmit}
			className={cn("w-full max-w-xl text-sm", className)}
		>
			<SearchFields scope={scope} setScope={setScope} phrase={phrase} setPhrase={setPhrase} />
		</form>
	)
}
