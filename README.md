# Collections Online

[![CI](https://github.com/glamdigital/collections-online-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/glamdigital/collections-online-nextjs/actions/workflows/ci.yml)

Server-rendered catalogue item pages for the GLAM Oxford museums, built with Next.js so that collection records can be crawled and indexed by search engines. The existing Collections Online search experience stays in place and links through to these pages.

See [docs/seo-options.md](docs/seo-options.md) for the context and goals, and [docs/seo-phased-delivery.md](docs/seo-phased-delivery.md) for the delivery plan.

## Museums

One deployment per museum, selected with the `NEXT_PUBLIC_MUSEUM` environment variable:

| `NEXT_PUBLIC_MUSEUM` | Museum                                      |
| -------------------- | ------------------------------------------- |
| `ash`                | Ashmolean Museum                            |
| `oum`                | Oxford University Museum of Natural History |
| `prm`                | Pitt Rivers Museum                          |
| `hsm`                | History of Science Museum                   |

Per-museum URLs and image sources are configured in [src/app/library/config.ts](src/app/library/config.ts).

## Getting started

```bash
bun install
echo 'NEXT_PUBLIC_MUSEUM="ash"' > .env.local
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) — the home page links to a sample item page for the active museum, alongside its legacy equivalent.

Environment variables are declared in [.env.schema](.env.schema) and validated at boot by [varlock](https://varlock.dev). Set values in `.env.local` (gitignored).

## How it works

- **Data** — item pages fetch records from the existing Collections Online API ([src/app/library/api.ts](src/app/library/api.ts)). Field shapes vary by museum; see the annotated `CollectionObject` type in [src/app/library/types.ts](src/app/library/types.ts).
- **Images** — ash and prm have IIIF DAMs, rendered as deep-zoomable images with OpenSeadragon. oum and hsm serve plain images from S3. Both go through the same viewer component.
- **URLs** — items live at `/item/{id}/{slug}`, where the slug is cosmetic and the canonical URL is emitted in page metadata.

## Testing

Test harness lives under `test/` — Playwright specs in `test/e2e/`, committed API fixtures in `test/fixtures/`, and the bun preload in `test/preload.ts`. Unit tests stay colocated in `src/` beside the code they cover.

Two tiers, both run in CI:

- **Unit** (`bun test`) — pure logic: the slug, list, and API helpers, and the
  `props()` transformation that maps API records to the page, asserted against
  committed fixtures of real API responses. Museum-dependent modules read
  `NEXT_PUBLIC_MUSEUM` at import time, so `bun run test` runs the suite once per museum.
- **E2E** ([Playwright](https://playwright.dev)) — real browser against live
  APIs. `bun run test:e2e` starts one dev server per museum (ports 3101–3104)
  and runs each spec against all four, covering metadata, detail fields, the
  image viewer, and hierarchy trails. Per-museum expectations live in
  [test/e2e/museums.ts](test/e2e/museums.ts). Playwright specs are named `*.e2e.ts`
  because `bun test` claims `*.test.ts` and `*.spec.ts`. CI shards the suite
  one museum per job; `E2E_MUSEUMS=prm,hsm bun run test:e2e` does the same
  locally.

`bun run fixtures` refreshes the committed API fixtures in `test/fixtures/`.

## Scripts

| Command            | Action                                 |
| ------------------ | -------------------------------------- |
| `bun run dev`      | Start the dev server                   |
| `bun run build`    | Production build                       |
| `bun run lint`     | Lint with oxlint                       |
| `bun run fmt`      | Format with oxfmt                      |
| `bun run test`     | Unit tests (once per museum)           |
| `bun run test:e2e` | Playwright e2e across all four museums |
| `bun run fixtures` | Refresh API fixtures from the live API |
