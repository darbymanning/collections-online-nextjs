import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import "./app.css"
import { museum } from "$library/config"
import { openGraphDefaults, robotsMetadata } from "$library/seo"
import { Header } from "$components/header"

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--f-dm-sans",
})

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--f-geist-mono",
})

export const metadata: Metadata = {
	// per-museum deployment domain; relative canonical/og URLs resolve against this
	metadataBase: museum.urls.self,
	title: `${museum.name} — Collections Online`,
	description: `Explore objects from the ${museum.name} collection.`,
	applicationName: `${museum.name} Collections Online`,
	// site-wide indexing policy; opted-out museums emit noindex everywhere
	robots: robotsMetadata,
	openGraph: { ...openGraphDefaults, url: museum.urls.self },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en-GB" className={`${dmSans.variable} ${geistMono.variable} ${museum.ref}`}>
			<body>
				{/* first focusable element — sits just off the top edge and slides into
				 * view only when focused */}
				<a
					href="#main-content"
					className="fixed -top-16 left-2 z-50 rounded-md bg-foreground px-4 py-2 font-medium text-background transition-[top] focus:top-2"
				>
					Skip to content
				</a>
				<Header />
				<main id="main-content" tabIndex={-1} className="flex flex-col focus:outline-none">
					{children}
				</main>
			</body>
		</html>
	)
}
