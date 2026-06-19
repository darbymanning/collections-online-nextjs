/*
 * Preflight for the e2e workflow: is the upstream API actually serving this
 * museum's sample record? This is a reachability check, not a correctness one —
 * a 4xx means the host is up (a stale sample id is a test-data problem the e2e
 * run should surface), so only connection failures, timeouts, and 5xx count as
 * "down". The workflow uses the exit code to skip a shard whose upstream is out
 * rather than failing the build on someone else's outage.
 *
 * Exit codes: 0 = up (run e2e), 1 = down (skip the shard), 2 = misconfigured.
 */
import { museums } from "../test/e2e/museums"

const ref = process.env.E2E_MUSEUMS?.split(",")[0]?.trim()

if (!ref || !(ref in museums)) {
	console.error(`e2e-preflight: unknown or missing museum "${ref}" (set E2E_MUSEUMS)`)
	process.exit(2)
}

const { id } = museums[ref as keyof typeof museums]
const url = `https://prd-online.glamdigital.io/v2/item/${id}/full`

try {
	const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })

	if (response.status >= 500) {
		console.log(`down: ${url} -> HTTP ${response.status}`)
		process.exit(1)
	}

	console.log(`up: ${url} -> HTTP ${response.status}`)
	process.exit(0)
} catch (error) {
	console.log(`down: ${url} -> ${(error as Error).message}`)
	process.exit(1)
}
