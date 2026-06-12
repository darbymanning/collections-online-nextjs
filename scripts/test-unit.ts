import { Museum } from "$library/types"
import { $ } from "bun"

// Museum-dependent modules read MUSEUM at module scope, so the suite runs once
// per museum in a fresh process. Pure tests re-running is a non-cost.
const museums: Array<Museum> = ["ash", "oum", "prm", "hsm"] as const

for (const museum of museums) {
	console.log(`\n=== bun test (MUSEUM=${museum}) ===`)
	const { exitCode } = await $`MUSEUM=${museum} bun test src`.nothrow()
	if (exitCode !== 0) process.exit(exitCode)
}
