import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin"
import type { NextConfig } from "next"

const withVarlock = varlockNextConfigPlugin()

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	// e2e runs one dev server per museum (playwright.config.ts); each needs its
	// own build dir so concurrent servers don't corrupt each other's caches
	distDir: process.env.NEXT_DIST_DIR ?? ".next",
}

export default withVarlock(nextConfig)
