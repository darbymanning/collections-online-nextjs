import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import StyledJsxRegistry from "./registry"
import "./globals.css"
import { museum } from "$library/config"

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--f-montserrat",
})

export const metadata: Metadata = {
	// per-museum deployment domain; relative canonical/og URLs resolve against this
	metadataBase: museum.urls.self,
	title: "Collections Online",
	description: "POC",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en-GB" className={montserrat.variable}>
			<body>
				<StyledJsxRegistry>{children}</StyledJsxRegistry>
			</body>
		</html>
	)
}
