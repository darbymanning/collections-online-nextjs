import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
})

export const metadata: Metadata = {
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
			<body>{children}</body>
		</html>
	)
}
