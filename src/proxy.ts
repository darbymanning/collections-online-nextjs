import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { museum } from "./app/library/config"

function unauthorizedResponse() {
	return new NextResponse("Authentication required", {
		status: 401,
		headers: {
			"WWW-Authenticate": 'Basic realm="Collections Online", charset="UTF-8"',
		},
	})
}

// Both username and password are read from process.env
function isAuthorized(request: NextRequest): boolean {
	const expectedUser = process.env.BASIC_AUTH_USER
	const expectedPass = process.env.BASIC_AUTH_PASS
	if (!expectedUser) console.warn("Basic auth is missing: BASIC_AUTH_USER.")
	if (!expectedPass) console.warn("Basic auth is missing: BASIC_AUTH_PASS.")
	if (!expectedUser || !expectedPass) return false

	const authHeader = request.headers.get("authorization")
	if (!authHeader?.startsWith("Basic ")) return false

	const encoded = authHeader.slice("Basic ".length)
	let decoded: string
	try {
		decoded = atob(encoded)
	} catch {
		return false
	}

	const colonIndex = decoded.indexOf(":")
	if (colonIndex === -1) return false

	const user = decoded.slice(0, colonIndex)
	const pass = decoded.slice(colonIndex + 1)
	return user === expectedUser && pass === expectedPass
}

export function proxy(request: NextRequest) {
	if (!isAuthorized(request)) return unauthorizedResponse()

	const response = NextResponse.next()

	// Belt-and-braces de-indexing for opted-out museums (Pitt Rivers): the meta
	// robots tag covers HTML, this header covers every response — including any
	// non-HTML route a crawler might reach.
	if (!museum.indexable) response.headers.set("X-Robots-Tag", "noindex, nofollow")

	return response
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|healthcheck|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
}
