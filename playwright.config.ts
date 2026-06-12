import { Museum } from "$library/types"
import { defineConfig, devices } from "@playwright/test"

const allMuseums: Array<Museum> = ["ash", "oum", "prm", "hsm"] as const

// CI shards one museum per job via E2E_MUSEUMS (comma-separated, e.g. "ash" or
// "ash,prm") so each job boots only its own dev server; local runs cover all four
const selected = process.env.E2E_MUSEUMS?.split(",")
const museums = selected ? allMuseums.filter((museum) => selected.includes(museum)) : allMuseums

const port = (museum: (typeof allMuseums)[number]) => 3101 + allMuseums.indexOf(museum)

export default defineConfig({
	testDir: "./test/e2e",
	// bun test claims *.test.ts and *.spec.ts, so playwright specs use *.e2e.ts
	testMatch: "**/*.e2e.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	// the suite renders live API data — absorb transient network flakes on CI
	retries: process.env.CI ? 2 : 0,
	// first visit compiles the route on demand and the data comes from live APIs
	timeout: 60_000,
	expect: { timeout: 10_000 },
	reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
	use: { trace: "on-first-retry" },
	// NEXT_PUBLIC_MUSEUM is fixed per server, so each museum gets its own dev server and project
	projects: museums.map((museum) => ({
		name: museum,
		use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${port(museum)}` },
	})),
	webServer: museums.map((museum) => ({
		command: `bun run dev --port ${port(museum)}`,
		url: `http://localhost:${port(museum)}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		// explicit process env beats .env.local in varlock's loader
		env: { NEXT_PUBLIC_MUSEUM: museum, NEXT_DIST_DIR: `.next-e2e-${museum}` },
	})),
})
