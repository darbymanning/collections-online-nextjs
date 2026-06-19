import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { museum } from "./app/library/config"

// Password is read from process.env, not ENV — it is intentionally omitted from
// .env.schema so varlock does not inject it into build output or scan SSR HTML
// for substring matches against catalogue text (e.g. "italian" in item slugs).
function getBasicAuthCredentials() {
	const user = process.env.BASIC_AUTH_USER
	const pass = process.env.BASIC_AUTH_PASS
	return { user, pass, enabled: Boolean(user && pass) }
}

function isAuthorized(request: NextRequest, expectedUser: string, expectedPass: string): boolean {
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
	const { user, pass, enabled } = getBasicAuthCredentials()

	if (enabled && !isAuthorized(request, user!, pass!)) {
		return new NextResponse("Authentication required", {
			status: 401,
			headers: {
				"WWW-Authenticate": 'Basic realm="Collections Online", charset="UTF-8"',
			},
		})
	}

	const response = NextResponse.next()

	// Belt-and-braces de-indexing for opted-out museums (Pitt Rivers): the meta
	// robots tag covers HTML, this header covers every response — including any
	// non-HTML route a crawler might reach.
	if (!museum.indexable) response.headers.set("X-Robots-Tag", "noindex, nofollow")

	return response
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
}
