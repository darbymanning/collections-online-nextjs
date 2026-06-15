import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { museum } from "$library/config"
import { openGraphDefaults, robotsMetadata } from "$library/seo"

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--f-dm-sans",
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
		<html lang="en-GB" className={`${dmSans.variable} ${museum.ref}`}>
			<body>{children}</body>
		</html>
	)
}
