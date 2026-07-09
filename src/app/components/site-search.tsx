"use client"

import { Button } from "$components/button"
import { museum } from "$library/config"
import { cn } from "$library/utils"
import { useState, type FormEvent } from "react"

/** The legacy Collections Online simple search for a phrase — a hash-routed SPA
 * (`#/search/simple-search/{phrase}`). */
export function searchUrl(phrase: string): string {
	return `${museum.urls.legacy.simpleSearch}/${encodeURIComponent(phrase)}`
}

/** The Collections Online search bar — mirrors the legacy landing page's
 * "Search the collections" box (one field, no scope switching). Used by the
 * header's search panel and the not-found page so the two stay identical. */
export function SiteSearch({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
	const [phrase, setPhrase] = useState("")

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const trimmed = phrase.trim()
		if (!trimmed) return
		window.location.assign(searchUrl(trimmed))
	}

	return (
		<form
			role="search"
			aria-label="Search the collections"
			onSubmit={handleSubmit}
			className={cn("flex w-full max-w-xl gap-3 text-sm", className)}
		>
			<input
				type="search"
				value={phrase}
				onChange={(event) => setPhrase(event.target.value)}
				autoFocus={autoFocus}
				placeholder="Search the collections"
				aria-label="Search the collections"
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
		</form>
	)
}
