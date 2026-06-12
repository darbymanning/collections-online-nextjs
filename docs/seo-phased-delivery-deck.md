---
marp: true
title: Collections Online SEO — Phased Delivery
description: Phased delivery plan for senior stakeholder review
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
  font-size: 28px;
  letter-spacing: -0.01em;
  padding: 64px 72px;
}

section.lead {
  align-items: flex-start;
  justify-content: center;
}

section.small {
  font-size: 24px;
}

section.compact {
  font-size: 22px;
}

section.compact li {
  margin: 0.18em 0;
}

section.compact h1 {
  font-size: 46px;
}

h1 {
  color: #f8fafc;
  font-size: 52px;
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

ul,
ol {
  padding-left: 1.35em;
}

li {
  margin: 0.28em 0;
}

table {
  font-size: 22px;
  width: 100%;
}

th {
  background: rgba(148, 163, 184, 0.16);
}

section::after {
  color: #64748b;
  font-size: 18px;
}

</style>

<!-- _class: lead -->

# Collections Online SEO

## Phased delivery plan for senior stakeholder review

---

# Purpose

The delivery plan has three phases:

1. **Phase 0** — build and validate the foundation (**underway**)
2. **Phase 1** — search-engine-friendly catalogue item pages
3. **Phase 2** — museum website branding and editor content

All three phases form the agreed plan. Phase 0 work carries forward into Phase 1.

---

# Planning assumptions

- **Capacity:** approximately **10 days per month**, with scope to increase temporarily when needed
- **Indexing museums:** Ashmolean, Museum of Natural History, Museum of the History of Science
- **Pitt Rivers:** catalogue records must **not** appear in Google. Item pages can still exist for Collections Online users, but are excluded from sitemaps and blocked from search engine indexing

---

# At a glance

| Phase | Summary                            | Effort     | Timeline      |
| ----- | ---------------------------------- | ---------- | ------------- |
| 0     | Foundation and proof of indexing   | 11 days    | ~1 month      |
| 1     | Search-engine-friendly item pages  | 11–15 days | ~1–1.5 months |
| 2     | Museum branding and editor content | 8–15 days  | ~1–1.5 months |

**Full plan:** **30–41 days** (~3–4 months at 10 days per month)

---

# The problem

Catalogue item pages on Collections Online are hard for Google to find and list.

- Content loads in a way search engines struggle with
- Hundreds of thousands of records are largely invisible in search results

**The plan:** publish item pages in a format Google can read, on dedicated web addresses, while **keeping the existing search experience as it is**.

---

# Phase 0 — Foundation

**Purpose:** Build the technical foundation and prove Google can index the new pages.

**Status:** Underway.

**Effort:** 11 days · **Timeline:** ~1 month

---

# Phase 0 — What will be done

- Set up the new application, hosting, and deployment on AWS
- Establish item page template, web addresses, and metadata
- Build sample item pages for one museum using real catalogue data
- Connect to the existing catalogue API
- Small sitemap and updated search links for test pages
- Basic analytics on the new pages
- Confirm Google can discover, crawl, and index the test pages

This work carries forward into Phase 1.

---

# Phase 0 — Pros and cons

**Pros**

- Reusable foundation — not throwaway work
- Proves indexing before scaling to 400,000+ records
- Surfaces hosting and integration issues early
- Reduces risk for the main rollout

**Cons**

- Limited public SEO benefit until Phase 1
- Google indexing may take a few weeks
- Some presentation details refined in later phases

---

# Phase 1 — Main SEO delivery

**Purpose:** Make catalogue records discoverable in Google for the three indexing museums.

Extends the Phase 0 foundation to all museums and the full catalogue.

**Effort:** 11–15 days · **Timeline:** ~1–1.5 months after Phase 0

---

# Phase 1 — What will be done

- Item pages for Ashmolean, NHM, and History of Science
- Pitt Rivers pages for Collections Online users, but **excluded from Google and sitemaps**
- Stable web addresses for every indexable record
- Search result links updated (search itself stays on museum sites)
- Page titles and descriptions for search engines and social media
- Automated sitemaps for 400,000+ indexable records
- Sitemap submission to Google Search Console
- Simple static headers and footers until Phase 2

---

<!-- _class: compact -->

# Phase 1 — Pros and cons

**Pros**

- Delivers the main SEO benefit
- Keeps the current search experience stable
- Much lower risk than rebuilding the entire product
- Builds directly on Phase 0

**Cons**

- Split user journey until Phase 2
- Simple headers/footers initially
- **Analytics cookies:** consent is not shared between museum site and item-page addresses — visitors may be asked twice
- Pitt Rivers usable in Collections Online but absent from Google

---

# Phase 2 — Museum branding

**Purpose:** Make item pages feel like part of each museum website and complete the planned delivery.

**Effort:** 8–15 days · **Timeline:** ~1–1.5 months after Phase 1

---

<!-- _class: small -->

# Phase 2 — What will be done

- Museum-specific headers, footers, and navigation
- Editor-managed content around Collections Online, where required
- Content kept reasonably up to date without slowing pages
- Fallback if museum site content is temporarily unavailable
- Tested across all four museum brands

| Approach                   | Plain English                           | Effort     |
| -------------------------- | --------------------------------------- | ---------- |
| Static branded layout      | We build and maintain headers/footers   | 8–10 days  |
| Automatic extraction       | Pull content from existing museum pages | 10–12 days |
| Museum CMS fragments       | Museum sites provide page sections      | 12–15 days |
| Museum CMS structured data | Museum sites provide content as data    | 15 days    |

---

# Phase 2 — Pros and cons

**Pros**

- Item pages feel integrated with each museum brand
- Less confusion moving from search to an item page
- Editors can retain control (depending on approach)
- Completes the planned visitor experience

**Cons**

- Choice needed between speed, editorial control, and upkeep
- Museum CMS options need museum technical capacity
- Extracted content can break if website layouts change

---

# Delivery sequence

**Phase 0** → **Phase 1** → **Phase 2**

Foundation → Main SEO delivery → Museum branding

**Full planned delivery:** all three phases (~3–4 months)

---

# Cost and timeline planning

For 26/27 financial year forecasting:

| Delivery  | Phases    | Effort     | Duration    |
| --------- | --------- | ---------- | ----------- |
| Full plan | 0 + 1 + 2 | 30–41 days | ~3–4 months |

At 10 days per month. Additional days can be added in any month to shorten timelines.

---

# What stays the same

- Existing catalogue data source unchanged
- Museum websites continue to host main Collections Online search
- Embedded content blocks on museum pages keep working
- Pitt Rivers records never indexed by Google
- Each museum can be rolled out independently

---

<!-- _class: lead -->

# Planned delivery

Foundation underway.

Main SEO rollout next.

Museum branding completes the plan.
