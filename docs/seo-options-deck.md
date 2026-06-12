---
marp: true
title: Collections Online SEO Options
description: Recommended phased approach for making Collections Online catalogue records crawlable
theme: default
paginate: true
---

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  color-scheme: dark;
}

section {
  background:
    radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.22), transparent 28%),
    radial-gradient(circle at 20% 85%, rgba(168, 85, 247, 0.16), transparent 30%),
    linear-gradient(135deg, #020617 0%, #111827 100%);
  color: #e5edf7;
  font-size: 30px;
  letter-spacing: -0.01em;
  padding: 64px 72px;
}

section.lead {
  align-items: flex-start;
  justify-content: center;
}

h1 {
  color: #f8fafc;
  font-size: 58px;
  letter-spacing: -0.05em;
}

h2 {
  color: #7dd3fc;
  letter-spacing: -0.035em;
}

h3,
strong {
  color: #bfdbfe;
}

a,
code {
  color: #93c5fd;
}

code {
  background: rgba(148, 163, 184, 0.16);
  border-radius: 8px;
  padding: 0.08em 0.28em;
}

ul,
ol {
  padding-left: 1.35em;
}

li {
  margin: 0.34em 0;
}

section::after {
  color: #64748b;
  font-size: 18px;
}

</style>

<!-- _class: lead -->

# Collections Online SEO Options

## Recommended approach for crawlable catalogue item pages

---

# The Problem

Collections Online is currently a client-side React frontend embedded into Drupal 7 museum sites.

The key issue:

- Catalogue item pages are not reliably crawlable.
- Routes are client-rendered and hash-based.
- Google is not getting good visibility of collection records.
- The catalogue contains 400,000+ records, so discovery needs to be deliberate.

---

# The Museums

- Ashmolean Museum: `ashmolean.org`
- Museum of Natural History: `nhm.ac.uk`
- Pitt Rivers Museum: `prm.ox.ac.uk`
- Museum of the History of Science: `hsm.ox.ac.uk`

Collections Online currently lives under `/collections-online`.

Example:

`https://ashmolean.org/collections-online#/search`

---

# Two Main Options

## Option 1

Build crawlable catalogue item pages first in Next.js.

## Option 2

Rebuild the full Collections Online frontend in Next.js.

---

# Recommendation

## Choose Option 1 first

Build catalogue item pages in Next.js on museum-specific subdomains.

Keep the existing Drupal-rendered Collections Online search experience in place.

Aim towards Option 2 iteratively, rather than trying to rebuild everything at once.

---

# Option 1: How It Works

Existing search stays where it is:

`https://ashmolean.org/collections-online#/search`

Catalogue item pages move to a new subdomain:

`https://co.ashmolean.org/item/387563/attic-red-figure-cup-depicting-theseus-and-the-minotaur`

Route shape:

`/item/:object-id/:slug?`

---

# Why Option 1 First?

- Delivers the highest-value SEO improvement first.
- Smaller scope than a full rebuild.
- Keeps existing search, browse, filters, and widgets stable.
- Creates a Next.js/AWS foundation.
- Reduces delivery risk across four museums.
- Allows future migration route by route.

---

# Known Trade-Off

The user journey is split during phase one:

1. Museum site.
2. Existing Drupal-rendered Collections Online search.
3. New Next.js catalogue item page.

This is acceptable if the priority is getting item records indexed quickly.

---

# Header/Footer Position

For the first item-page delivery:

- Use minimal/static page chrome.
- Do not block on dynamic Drupal header/footer integration.
- Discuss dynamic headers, footers, and CMS-driven item-page content as a next step.

This avoids blocking SEO delivery on Drupal integration.

---

# CMS Content Position

Existing CMS-managed content remains available on the normal Drupal-rendered `/collections-online` pages.

It is not lost from Collections Online.

It is simply not reproduced on the new Next.js item pages at first.

If needed later, we can add:

- Drupal-rendered fragments.
- Drupal JSON service.
- Static export.
- Page scraping.

---

# Embedded Widgets

The current frontend also supports CMS-embedded React widgets.

Examples:

- Search result grids.
- Single item thumbnails.
- Object groups.
- Dynamic content replacement.

This capability should be retained under both options.

---

# URL And Slug Strategy

Use the object ID as the resolver.

Use the title slug for readability and canonical SEO.

Policy:

- `/item/387563/anything` can resolve the item.
- Canonical URL uses the best title slug.
- Missing, old, or nonsense slugs `301` to canonical.
- If title changes, old URLs still resolve via object ID.

---

# Sitemap Strategy

Sitemap generation should be owned by the backend indexing stack.

Not Next.js.

Why:

- 400,000+ records.
- Backend already knows publication and suppression rules.
- OpenSearch reflects the final indexed catalogue state.
- Sitemaps need batching, validation, storage, and monitoring.

---

# Sitemap Delivery

Backend generates sitemap indexes and files.

Next.js exposes the public discovery point:

`https://co.ashmolean.org/sitemap.xml`

Sitemap files can live in static storage behind CloudFront.

The URLs inside the sitemap must be canonical public item URLs.

---

# AWS Position

Deploy to AWS using OpenNext initially.

Next.js 16.2 introduced a stable Adapter API.

Plan:

- Use OpenNext now.
- Watch native AWS adapter support.
- Swap when production-ready.

---

# POC First

Before scaling up:

- Build a few basic Next.js item pages.
- Generate a simple sitemap XML file.
- Point a small number of existing links to the POC pages.
- Confirm Google can discover and index them.

---

# Delivery Shape

## MVP

1. Build crawlable Next.js item pages.
2. Update existing search result links.
3. Generate backend-owned sitemaps.

## Next phase

Discuss dynamic headers, footers, and CMS-driven item-page content.

## Later

Iterate route-by-route towards Option 2.

---

# Decisions Needed

For the MVP only:

- Confirm subdomain pattern, e.g. `co.ashmolean.org`.
- Confirm `/item/:object-id/:slug?` URL pattern.
- Confirm initial POC sitemap/link test scope.
- Confirm which existing search result links are updated first.
- Confirm backend ownership of sitemap generation.
- Confirm where `/sitemap.xml` is served from and how it points to backend-generated files.

---

<!-- _class: lead -->

# Recommended Line

Start with crawlable catalogue item pages.

Prove indexing with a small POC.

Iterate towards the full rebuild.
