// bun auto-loads .env.local, but fresh clones and CI have none — default to ash
// so config.ts (which reads NEXT_PUBLIC_MUSEUM at module scope) doesn't throw on import.
// An explicit `NEXT_PUBLIC_MUSEUM=x bun test` always wins over this fallback.
process.env.NEXT_PUBLIC_MUSEUM ??= "ash"
