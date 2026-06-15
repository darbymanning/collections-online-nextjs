<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project context

This app rebuilds GLAM Oxford's Collections Online catalogue item pages so search engines can crawl and index them. The existing Collections Online search experience stays in place and links through to these pages. One deployment per museum, selected via the `NEXT_PUBLIC_MUSEUM` env var.

The scoping docs in `docs/` frame the objective, constraints, and delivery plan — read them when a task needs project context:

- `docs/seo-options.md` — context, goals, assumptions, and the options analysis behind this approach
- `docs/seo-phased-delivery.md` — the agreed three-phase delivery plan (Phase 0 proof of concept is underway)

The `*-deck.md` files are Marp slide versions of the same content; prefer the plain documents.

# Naming conventions

- **camelCase** for variables, constants, and functions
- **PascalCase** for interfaces, types, classes, and React components
- **kebab-case** for filenames
- Next.js file-system conventions (e.g. `page.tsx`, `layout.tsx`, `[id]`) take precedence over filename casing
- Do not rename third-party imports, external API fields, or Next.js/React framework identifiers

## Control flow

Prefer single-line guard returns when the body is a single statement:

```ts
if (skills.includes(".agents/skills/nextjs")) return

if (lines.length === 0) return
```

Avoid unnecessary braces for one-liners:

```ts
// prefer
if (foo) return bar()

// not
if (foo) {
	return bar()
}
```

Use a block when the branch has multiple statements or is non-trivial.

## Linting

After editing code, **always check lint results** on the files you touched (use the IDE linter / `ReadLints` on changed paths). Fix new issues before finishing — do not leave lint errors you introduced.

This project uses **oxlint** with `react-no-manual-memo/no-hook-memo`. React Compiler handles memoization — **do not** use `useCallback`, `useMemo`, or `memo` in components unless a rule explicitly allows it. Prefer plain functions; define effect-only handlers inside `useEffect` when they are only used there.
