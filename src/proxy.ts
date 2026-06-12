import { ENV } from "varlock/env"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getBasicAuthCredentials() {
	const user = ENV.BASIC_AUTH_USER
	const pass = ENV.BASIC_AUTH_PASS
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
	if (!enabled || isAuthorized(request, user!, pass!)) {
		return NextResponse.next()
	}

	return new NextResponse("Authentication required", {
		status: 401,
		headers: {
			"WWW-Authenticate": 'Basic realm="Collections Online", charset="UTF-8"',
		},
	})
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
}
