import type { Metadata } from "next"
import "./globals.css"

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
		<html lang="en-GB">
			<body>{children}</body>
		</html>
	)
}
