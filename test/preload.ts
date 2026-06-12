// bun auto-loads .env.local, but fresh clones and CI have none — default to ash
// so config.ts (which reads MUSEUM at module scope) doesn't throw on import.
// An explicit `MUSEUM=x bun test` always wins over this fallback.
process.env.MUSEUM ??= "ash"
