// Picks the active museum's header at build time. `NEXT_PUBLIC_MUSEUM` is
// inlined by Next, so the unmatched branches are unreachable and the other
// museums' headers (and their assets) never make it into this deployment's
// bundle. Each `import()` must use a literal path for the bundler to split it.
async function loadHeader() {
	switch (process.env.NEXT_PUBLIC_MUSEUM) {
		case "ash":
			return (await import("$components/ash/header")).Header
		case "oum":
			return (await import("$components/oum/header")).Header
		case "prm":
			return (await import("$components/prm/header")).Header
		case "hsm":
			return (await import("$components/hsm/header")).Header
	}
}

export async function Header() {
	const MuseumHeader = await loadHeader()
	return MuseumHeader ? <MuseumHeader /> : null
}
