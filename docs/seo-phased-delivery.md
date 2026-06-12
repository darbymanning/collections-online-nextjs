# Collections Online SEO — Phased Delivery Plan

## Purpose

This document sets out the planned phases of SEO work for senior stakeholder review.

The delivery plan has three phases:

1. **Phase 0** — build and validate the foundation (underway)
2. **Phase 1** — roll out search-engine-friendly catalogue item pages
3. **Phase 2** — align item pages with museum website branding and editor content

All three phases form the agreed plan. Phase 0 work carries forward into Phase 1, so expanding Phase 0 does not extend the overall timeline.

---

## Planning assumptions

- **Capacity:** approximately **10 days per month** allocated to this work, with the option to increase temporarily when needed.
- **Museums in scope for indexing:** Ashmolean, Museum of Natural History, and Museum of the History of Science.
- **Pitt Rivers Museum:** Pitt Rivers catalogue records must **not** appear in Google search results. Item pages can still exist for people using Collections Online directly, but they will be excluded from sitemaps and blocked from search engine indexing.

---

## At a glance

| Phase | Summary                                       | Effort     | Provisional timeline |
| ----- | --------------------------------------------- | ---------- | -------------------- |
| 0     | Build the foundation and prove indexing works | 11 days    | ~1 month             |
| 1     | Search-engine-friendly catalogue item pages   | 11–15 days | ~1–1.5 months        |
| 2     | Museum website branding and editor content    | 8–15 days  | ~1–1.5 months        |

**Total plan:** approximately **30–41 days** (~3–4 months at 10 days per month).

Effort figures are working estimates for cost and timescale planning. Additional days can be added in a given month if a phase needs a push.

---

## The problem (brief)

Today, catalogue item pages on Collections Online are hard for Google to find and list. The content loads in a way that search engines struggle with, so hundreds of thousands of collection records are largely invisible in search results.

The plan is to publish item pages in a format Google can read, on dedicated web addresses separate from the main museum sites, while **keeping the existing search experience as it is**. When someone finds an item in search results, they would be taken to the new page. The search itself stays on the museum website.

---

## Phase 0 — Foundation and proof of concept

**Purpose:** Build the technical foundation for the new item pages, prove that Google can index them, and carry that work forward into Phase 1 rather than treating it as throwaway.

**Status:** Underway.

### What will be done

- Set up the new application, hosting, and deployment approach on AWS.
- Establish the item page template, web address pattern, and page metadata approach.
- Build sample catalogue item pages for one museum using real catalogue data.
- Connect pages to the existing catalogue API.
- Create a small sitemap for the test pages.
- Update a selection of existing search links so they point to the new pages.
- Add basic analytics on the new pages.
- Confirm Google can discover, crawl, and index the test pages.
- Document and validate the approach before rolling out to all museums and the full catalogue.

### Pros

- Builds reusable foundation work that Phase 1 extends rather than replaces.
- Proves indexing works before scaling to 400,000+ records.
- Surfaces hosting, deployment, and integration issues early.
- Gives stakeholders something concrete to review.
- Reduces delivery risk for the main rollout.

### Cons

- Public SEO benefit is limited until Phase 1 completes.
- Google indexing can take a few weeks; we may need a short observation period before full rollout.
- Some presentation details will be refined in later phases.

### Effort

**11 days**

This includes foundation work that would otherwise have fallen into Phase 1.

### Provisional timeline

**~1 month** at 10 days per month.

### Decisions needed

- Which museum to use for the initial validation.
- How many sample pages to include in the first indexing test.
- How long to wait for evidence of Google indexing before moving to full rollout.

---

## Phase 1 — Search-engine-friendly catalogue item pages

**Purpose:** Deliver the core SEO outcome — make catalogue records discoverable in Google for the three museums where indexing is wanted.

Phase 1 extends the Phase 0 foundation to all museums and the full indexable catalogue.

### What will be done

- Publish search-engine-friendly item pages for Ashmolean, Museum of Natural History, and Museum of the History of Science.
- Provide item pages for Pitt Rivers for users of Collections Online, but **explicitly exclude Pitt Rivers from Google indexing and sitemaps**.
- Roll out the item page template and hosting setup established in Phase 0.
- Give every indexable record a stable web address based on its catalogue ID and title.
- Redirect old or incorrect addresses to the correct current page.
- Update search result links so clicking an item opens the new page (search itself stays on the museum sites).
- Add appropriate page titles and descriptions for search engines and social media.
- Generate sitemaps covering the full indexable catalogue (400,000+ records across the three indexing museums).
- Submit sitemaps to Google Search Console.
- Use simple, static headers and footers on item pages until Phase 2.
- Leave the existing Collections Online search, browse, and embedded content blocks unchanged on the museum sites.

### Pros

- Delivers the main SEO benefit — individual collection records become findable in Google.
- Keeps the current search experience stable for users and staff.
- Much lower risk than rebuilding the entire Collections Online product.
- Sitemaps respect existing rules about which records should and should not be published.
- The current system remains in place as a fallback during rollout.
- Builds directly on Phase 0 rather than starting again.

### Cons

- Users move between the museum site search and the new item pages — the journey may feel split until Phase 2.
- Item pages initially use simple headers and footers, not the live museum site navigation.
- Content that museum editors manage around Collections Online on the main sites is not shown on item pages yet.
- **Analytics cookies:** the cookie that records whether a visitor has accepted tracking is not shared between the main museum website and the new item-page addresses. Visitors who have already accepted cookies on the museum site will be asked again on item pages.
- Link updates need care across all museums and embedded contexts.
- Pitt Rivers remains usable within Collections Online but deliberately absent from Google.

### Effort

**11–15 days**

Assumes Phase 0 has already delivered the foundation.

### Provisional timeline

**~1–1.5 months** after Phase 0, at 10 days per month.

### Decisions needed

- Confirm web address pattern for each museum.
- Confirm which search links are updated (main search, embedded content blocks, etc.).
- Confirm static header/footer approach is acceptable until Phase 2.
- Confirm Google Search Console access for each indexing museum.

---

## Phase 2 — Museum branding and editor content

**Purpose:** Make catalogue item pages feel like part of each museum website, and show editor-managed content around Collections Online where it is needed today.

This phase completes the planned delivery by addressing the split user journey introduced in Phase 1.

### What will be done

- Add museum-specific headers, footers, and navigation to item pages.
- Show editor-managed content that currently appears around Collections Online on museum sites, where required.
- Keep that content reasonably up to date without slowing down page loading.
- Ensure pages still work if museum site content is temporarily unavailable.
- Test presentation across all four museum brands (including Pitt Rivers item pages, which remain excluded from Google).

**How we connect to museum websites affects effort within this phase:**

| Approach                   | Plain English                                                | Typical effort |
| -------------------------- | ------------------------------------------------------------ | -------------- |
| Static branded layout      | We build and maintain headers/footers in the new system      | 8–10 days      |
| Automatic extraction       | We pull header/footer content from existing museum pages     | 10–12 days     |
| Museum CMS fragments       | Museum websites provide ready-made page sections             | 12–15 days     |
| Museum CMS structured data | Museum websites provide content as data; we build the layout | 15 days        |

The existing Collections Online pages on museum websites are not affected.

### Pros

- Item pages feel integrated with each museum brand.
- Reduces confusion when moving from search to an item page.
- Editors can retain control over navigation and surrounding content (depending on approach).
- Completes the planned visitor experience without changing how search works.

### Cons

- Requires a choice between speed, editorial control, and long-term upkeep.
- Options that depend on the museum content management systems need museum technical capacity.
- Automatically extracted content can break if museum website layouts change.
- Content may not update instantly — it depends on refresh schedules.

### Effort

**8–15 days** (depends on integration approach chosen)

### Provisional timeline

**~1–1.5 months** after Phase 1, at 10 days per month.

### Decisions needed

- Which approach to connecting with museum websites is preferred.
- Which editor-managed content must appear on item pages.
- Who maintains content if museum website layouts change.

---

## Delivery sequence

```
Phase 0  →  Phase 1  →  Phase 2
Foundation   Main SEO     Museum branding
(underway)   delivery     and editor content
```

**Full planned delivery:** Phase 0 + Phase 1 + Phase 2.

---

## Cumulative effort and cost planning

For 26/27 financial year forecasting:

| Delivery  | Phases included | Effort     | Provisional duration |
| --------- | --------------- | ---------- | -------------------- |
| Full plan | 0 + 1 + 2       | 30–41 days | ~3–4 months          |

At 10 days per month, the full plan completes in roughly **three to four months**. Additional days can be allocated in any given month to shorten this if needed.

---

## What stays the same throughout

- The existing catalogue data source is unchanged.
- Museum websites continue to host the main Collections Online search.
- Embedded content blocks on museum pages keep working.
- Pitt Rivers records are never indexed by Google.
- Each museum can be rolled out independently.
