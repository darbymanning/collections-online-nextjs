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

Per-museum URLs and image sources are configured in [src/app/library/config.ts](src/app/library/config.ts). Each museum also declares whether its pages may be indexed (`indexable`) and the schema.org type used for structured data (`schema`); both are required, so adding a museum forces an explicit choice. Pitt Rivers set `indexable: false` — their pages stay live for direct visitors but emit `noindex` and are kept out of search and AI answers.

## SEO, AGO, and scrapers

- **`robots.txt`** ([src/app/robots.ts](src/app/robots.ts)) explicitly welcomes the AI answer engines that cite and link back (ChatGPT, Claude, Perplexity, Google-Extended, …), blocks SEO-intel and content-scraping bots, and lets ordinary search engines crawl. The allow/block lists are plain data in [src/app/library/crawlers.ts](src/app/library/crawlers.ts).
- **Indexing policy** is driven by each museum's `indexable` flag: the site-wide `robots` metadata, the per-response `X-Robots-Tag` header ([src/proxy.ts](src/proxy.ts)), and `robots.txt` all read from it. Unpublished records get `noindex` regardless.
- **Rich metadata and structured data** — every item page emits a canonical URL, description, Open Graph/Twitter tags, and schema.org JSON-LD (the object, its holding museum, and a breadcrumb trail) for rich results and AI answers. See [src/app/library/seo.ts](src/app/library/seo.ts).

## Getting started

```bash
bun install
echo 'NEXT_PUBLIC_MUSEUM="ash"' > .env.local
bun run dev
```

- Bake and run docker container

```bash
NEXT_PUBLIC_MUSEUM=ash docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) — the home page links to a sample item page for the active museum, alongside its legacy equivalent.

Environment variables are declared in [.env.schema](.env.schema) and validated at boot by [varlock](https://varlock.dev). Set values in `.env.local` (gitignored).

## Basic auth

For preview/staging deployments, HTTP basic auth can be switched on to keep pages behind a login. It is controlled entirely by two environment variables — when **both** are set, every page requires a valid `Authorization` header; when either is missing, auth is off and the site is public.

| Variable          | Where to set it              | Notes                                                                       |
| ----------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `BASIC_AUTH_USER` | `.env.schema` / `.env.local` | The expected username.                                                      |
| `BASIC_AUTH_PASS` | Deployment platform only     | The expected password. Deliberately omitted from `.env.schema` (see below). |

`BASIC_AUTH_PASS` is read straight from `process.env` rather than varlock and is intentionally kept out of [.env.schema](.env.schema): varlock's build leak scan substring-matches the SSR HTML, which false-positives on catalogue words (e.g. `italian` in item slugs). Set it on the deployment platform's environment config, not in any committed file.

The check lives in [src/proxy.ts](src/proxy.ts) and runs on every matched request.

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
