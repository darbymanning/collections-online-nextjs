// Liveness/readiness probe for the container health check (Dockerfile HEALTHCHECK
// and the healthCheck block in task-definition-*.json). Excluded from the proxy
// matcher in proxy.ts so basic auth never 401s the probe. Returns a plain 200
// (not 204) so an ALB/target-group health check is happy without a custom matcher.
export const dynamic = "force-dynamic"

export function GET() {
	return new Response("ok", {
		status: 200,
		headers: { "content-type": "text/plain" },
	})
}
