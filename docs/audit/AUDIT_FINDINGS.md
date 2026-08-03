# Astro-Web Codebase Audit Findings

> **Audit date:** 2026-08-04
> **Auditor:** Super Z (coding specialist agent)
> **Scope:** Static code review + E2E test of deployed site `https://astro.jesspete.shop/` against original `https://www.kelp.agency/`
> **Method:** Mode C (Audit/Review) per the coding specialist operating manual. Findings separated from fixes — see `REMEDIATION_PLAN.md`.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4 |
| High | 8 |
| Medium | 6 |
| Low | 5 |
| Informational | 3 |
| **Total** | **26** |

The codebase builds cleanly (`npm run check` → 0 errors, `npm run build` → 17 pages) and the design system is faithfully cloned. However, **two categories of defect** are present:

1. **Broken internal links** — the Hero and Footer reference pages and case studies that do not exist in the clone's content folder, producing live 404s on the deployed site.
2. **Stale configuration** — `astro.config.mjs` still points at the placeholder `kelp-clone.example.com` domain, breaking every canonical URL and Open Graph URL tag on the deployed site.

Additionally, several **content collections are defined but unused** — the homepage components hardcode data that duplicates the collection content, creating a single-source-of-truth violation.

---

## Critical Findings

### C1. Hero references non-existent case studies (live 404s)

- **Location:** `src/components/home/Hero.astro` lines 4–6
- **Description:** The hero "client logos" row links to `/work/marker-48/` and `/work/beverlin-hills/`. Neither case study file exists in `src/content/case-studies/` (the folder contains only 6 files: `spring-water-spirits`, `deals-in-dirt`, `harts-meat-market`, `elev8-fun`, `mountaineer-coffee`, `unprofitable`).
- **Evidence (deployed):** `agent-browser open https://astro.jesspete.shop/work/marker-48/` → title `"404 — Page Not Found | Kelp Creative Agency"`. Same for `/work/beverlin-hills/`.
- **Comparison to original:** The original `kelp.agency` has 9 case studies including `marker-48` (slug `/work/marker-48/`, title "Marker 48 Brewing"), `croom-brewery` (slug `/work/croom-brewery/`, title "Croom Brewery"), and `beverlin-hills-quality-goods` (slug `/work/beverlin-hills-quality-goods/`, title "Beverlin Hills Quality Goods"). The Hero link text "Beverlin Hills" on the original correctly points to `/work/beverlin-hills-quality-goods/` — the clone's Hero uses the wrong slug `/work/beverlin-hills/`.
- **Impact:** Two of three prominent homepage CTAs land on 404 pages. Users perceive the site as broken.
- **Severity:** Critical
- **Confidence:** Verified

### C2. Footer "Clients" link → 404

- **Location:** `src/components/Footer.astro` line 38
- **Description:** The Footer "Work" column includes `{ label: 'Clients', href: '/work/clients/' }`. No `src/pages/work/clients.astro` file exists.
- **Evidence (deployed):** `agent-browser open https://astro.jesspete.shop/work/clients/` → title `"404 — Page Not Found"`.
- **Comparison to original:** `https://www.kelp.agency/work/clients/` returns HTTP 200 with title `"Kelp Client List"`.
- **Impact:** Footer link broken on every page.
- **Severity:** Critical
- **Confidence:** Verified

### C3. Five placeholder `href="#"` links shipped to production

- **Location:** `src/components/Footer.astro` lines 52–55 (4 social links: Instagram, LinkedIn, Facebook, YouTube), `src/pages/contact.astro` line 155 ("Schedule a 30-minute discovery call" link)
- **Description:** These links use `href="#"` which navigates to the top of the current page (no actual destination).
- **Evidence (deployed):** `agent-browser get attr @e54 href` (Instagram link) → `"#"`. Same for the other 4.
- **Impact:** Clicking any of these 5 links produces a jarring scroll-to-top with no destination. Looks unprofessional.
- **Severity:** Critical
- **Confidence:** Verified

### C4. `partners-vs-pirates.md` has malformed frontmatter

- **Location:** `src/content/articles/partners-vs-pirates.md` lines 2–4
- **Description:** The frontmatter has the article's subtitle in the `category` field and the category prefix jammed into the `excerpt` field:
  ```yaml
  title: "Partners VS Pirates"                                          # missing subtitle
  category: " Navigating an Ocean of Digital Agencies"                  # leading space, this is the subtitle
  excerpt: "Agency Life:How to tell a true agency partner from..."      # "Agency Life:" prefix jammed in
  ```
- **Evidence:** The correct values are visible in `src/components/home/FeaturedArticles.astro` lines 21–24 (hardcoded):
  ```js
  title: 'Partners VS Pirates: Navigating an Ocean of Digital Agencies',
  category: 'Agency Life',
  excerpt: "How to tell a true agency partner from a pirate in sheep's clothing.",
  ```
  So the homepage shows the correct values (from the hardcoded array), but `/resources/partners-vs-pirates/` (which renders from the markdown) shows the broken values.
- **Impact:** The article detail page has wrong title metadata, wrong category eyebrow, wrong excerpt, wrong OG description. SEO and UX both broken for that URL.
- **Severity:** Critical
- **Confidence:** Verified

---

## High Findings

### H1. `astro.config.mjs` `site` URL is the placeholder, not the deployed URL

- **Location:** `astro.config.mjs` line 8: `site: 'https://kelp-clone.example.com'`
- **Description:** Astro uses `site` to generate absolute URLs for canonical links, sitemaps, and OG tags. With the placeholder, every page emits `<link rel="canonical" href="https://kelp-clone.example.com/...">` and `<meta property="og:url" content="https://kelp-clone.example.com/...">`.
- **Evidence (deployed):** `agent-browser eval "document.querySelector('link[rel=canonical]').href"` → `"https://kelp-clone.example.com/"`. Same for `og:url`.
- **Impact:** Search engines see canonical URLs pointing at a non-existent domain. Social scrapers see the same. SEO is severely damaged.
- **Severity:** High
- **Confidence:** Verified

### H2. Missing `robots.txt`

- **Location:** `public/` directory — no `robots.txt` present
- **Evidence (deployed):** `agent-browser open https://astro.jesspete.shop/robots.txt` → empty response
- **Impact:** No crawler directives. No sitemap discovery for crawlers.
- **Severity:** High
- **Confidence:** Verified

### H3. Missing sitemap

- **Location:** `astro.config.mjs` — no `@astrojs/sitemap` integration
- **Evidence (deployed):** `agent-browser open https://astro.jesspete.shop/sitemap-index.xml` → 404
- **Impact:** Search engines have no index of pages. SEO gap.
- **Severity:** High
- **Confidence:** Verified

### H4. `<meta name="theme-color">` is dark ink on a light-background page

- **Location:** `src/layouts/BaseLayout.astro` line 38: `<meta name="theme-color" content="#0d1726" />`
- **Description:** The default page background is `#ffffff` (paper). Setting `theme-color` to `#0d1726` (ink) tells mobile browsers (Safari iOS, Chrome Android) to render the browser chrome in dark — mismatched with the actual page.
- **Impact:** Mobile browser UI doesn't match the page. Minor UX/branding issue.
- **Severity:** High
- **Confidence:** Reasoned (visual mismatch is logically obvious; not browser-tested)

### H5. Unused `testimonials` content collection (dead data)

- **Location:** `src/content.config.ts` lines 39–47 (collection defined), `src/content/testimonials/client-{1,2,3}.yaml` (3 files with real content), `src/components/home/Testimonials.astro` lines 4–10 (hardcodes a single testimonial, ignores the collection)
- **Description:** Three testimonial YAML files exist with real quotes (Sarah Mitchell/Spring Water Spirits, Marcus Chen/Mountaineer Coffee, Diana Rodriguez/Elev8 Fun). The `Testimonials.astro` component ignores them and hardcodes only the Sarah Mitchell quote.
- **Impact:** Two valid testimonials are not displayed. Single-source-of-truth violation. Adding a new testimonial YAML file does nothing — confusing for content editors.
- **Severity:** High
- **Confidence:** Verified

### H6. Unused `services` content collection (dead data)

- **Location:** `src/content.config.ts` lines 18–26 (collection defined), `src/content/services/*.md` (5 files), `src/components/home/Services.astro` (hardcodes 5 service categories), `src/pages/services/index.astro` (hardcodes the same 5 categories)
- **Description:** Five service markdown files exist with title/description, but the `offerings: []` array is empty in all of them. Both the homepage Services section and the `/services/` page hardcode the same 5 categories and service lists. The collection is unused.
- **Impact:** Adding or editing a service via the content folder has no effect. Single-source-of-truth violation (the same data is duplicated in two components).
- **Severity:** High
- **Confidence:** Verified

### H7. Unused `articles` collection in `FeaturedArticles.astro`

- **Location:** `src/components/home/FeaturedArticles.astro` lines 4–26 (hardcodes 3 articles), `src/content/articles/*.md` (3 files with the same 3 articles)
- **Description:** The component duplicates the article metadata (title, category, date, excerpt, slug) that already exists in the collection. The `/resources/` page already uses `getCollection('articles')` correctly — only `FeaturedArticles.astro` duplicates.
- **Impact:** Drift between the homepage article cards and the article detail pages (already happened — see C4). Single-source-of-truth violation.
- **Severity:** High
- **Confidence:** Verified

### H8. `RecentWork.astro` hardcodes case studies instead of using `getCollection('caseStudies')`

- **Location:** `src/components/home/RecentWork.astro` lines 4–41
- **Description:** The component has a hardcoded array of 6 case studies with title/description/category/slug. The `/work/` page already uses `getCollection('caseStudies')` and sorts by `publishDate`. The carousel duplicates this data.
- **Impact:** Drift between the carousel cards and the actual case study pages. Adding a new case study doesn't add it to the carousel. Single-source-of-truth violation.
- **Severity:** High
- **Confidence:** Verified

---

## Medium Findings

### M1. Carousel wrapper not keyboard-focusable; slides lack ARIA semantics

- **Location:** `src/components/home/RecentWork.astro` lines 55–83, `src/styles/global.css` (no `tabindex` rule for `.carousel-wrapper`)
- **Description:** The carousel wrapper `<div class="carousel-wrapper relative overflow-hidden">` has `tabIndex = -1` (verified via `agent-browser eval`). The arrow-key handler (line 129) is bound to the wrapper, but since the wrapper isn't focusable, arrows only work after a child button is focused. The slides lack `role="group"`, `aria-roledescription="slide"`, and `aria-label`.
- **Comparison to original:** The original's carousel wrapper has `tabindex` set (visible in snapshot: `generic "..." [ref=e11] focusable [tabindex]`).
- **Impact:** Keyboard users can't operate the carousel without first tabbing to a button. Screen reader users get no slide semantics.
- **Severity:** Medium
- **Confidence:** Verified

### M2. Missing dropdown menus in Header (key UX feature of original)

- **Location:** `src/components/Header.astro` lines 22–41
- **Description:** The clone's nav items are plain links. The original kelp.agency has dropdown menus for Services, Work, Platforms, Resources — each with `aria-expanded`, `aria-controls`, and a sub-`<ul>` of category links (verified via `agent-browser eval` on the original's `<nav>` HTML).
- **Impact:** Users can't quickly jump to a specific service/platform from any page. The clone is missing a primary navigation affordance of the original.
- **Severity:** Medium
- **Confidence:** Verified

### M3. Missing "Headless" platform (original has 4 platforms, clone has 3)

- **Location:** `src/pages/platforms/index.astro` lines 6–25, `src/components/Footer.astro` lines 43–47
- **Description:** The clone's Platforms page and Footer list 3 platforms: HubSpot, Shopify, WordPress. The original has a 4th: Headless (`/platforms/headless/`, title "Kelp ❤️'s Headless").
- **Impact:** Content gap vs original. Footer Platforms column is incomplete.
- **Severity:** Medium
- **Confidence:** Verified

### M4. `prose prose-lg` classes used but `@tailwindcss/typography` not installed

- **Location:** `src/pages/work/[slug].astro` line 39, `src/pages/resources/[slug].astro` line 39, `package.json` (no `@tailwindcss/typography` dependency)
- **Description:** Both detail page templates wrap rendered Markdown in `<div class="prose prose-lg max-w-none ...">`. The `prose` class is provided by `@tailwindcss/typography`, which is not in `package.json`. The classes silently do nothing.
- **Impact:** Article and case study body copy is unstyled (only the inline `style="font-size: 1.125rem; line-height: 1.8;"` applies). Headings, lists, blockquotes inside Markdown render with browser defaults.
- **Severity:** Medium
- **Confidence:** Reasoned (the dependency is absent; behavior follows logically)

### M5. 404 page excessive top padding

- **Location:** `src/pages/404.astro` line 7: `<Section bg="ink" padding="xl">`
- **Description:** `padding="xl"` maps to `padding-block: 144px 48px` (see `global.css` line 169). The 404 page has no `PageHeader` above it, so the H1 sits 144px below the sticky header — excessive whitespace.
- **Impact:** Visual awkwardness on the 404 page.
- **Severity:** Medium
- **Confidence:** Reasoned

### M6. Mobile menu hardcoded `top-[72px]` offset

- **Location:** `src/components/Header.astro` line 62: `class="hidden md:hidden fixed inset-0 top-[72px] bg-paper z-50 flex flex-col p-6"`
- **Description:** The mobile menu overlay is positioned `top: 72px` to sit just below the header. The header padding is `24px 0` (line 186 of `global.css`) and the logo is `text-lg` (~18px line-height ~24px), so total header height is `24 + 24 + 24 = 72px`. If the header height ever changes (e.g. logo size, padding), the overlay will misalign.
- **Impact:** Fragile coupling between two values. Maintenance hazard.
- **Severity:** Medium
- **Confidence:** Reasoned

---

## Low Findings

### L1. Open Graph image prop defined but never passed

- **Location:** `src/layouts/BaseLayout.astro` line 10 (`ogImage?: string`), line 34 (`{ogImage && <meta property="og:image" content={ogImage} />}`)
- **Description:** The `ogImage` prop exists but no page passes it. Result: no OG image on any page. Social shares have no preview image.
- **Impact:** Social media shares show no preview image.
- **Severity:** Low
- **Confidence:** Verified (no `ogImage=` found in any page file)

### L2. README claims "Verified against kelp.agency live site on 2026-08-03" + "Status: ✅ Complete"

- **Location:** `README.md` line 15
- **Description:** The verification missed the broken Hero links, the missing /work/clients/ page, the missing case studies, the wrong canonical URL, the missing sitemap, etc. The "Complete" status is misleading.
- **Impact:** Maintainers believe the clone is production-ready when it has critical bugs.
- **Severity:** Low
- **Confidence:** Verified

### L3. No `prefers-color-scheme` support

- **Description:** The site is permanently light-mode. The original is also light-mode only. Not a bug per se — a design choice. Documenting for completeness.
- **Severity:** Low
- **Confidence:** Reasoned

### L4. `prefetchAll: true` may prefetch 17 pages on first hover

- **Location:** `astro.config.mjs` lines 9–12
- **Description:** With `prefetchAll: true` and `defaultStrategy: 'hover'`, every internal link on the page is prefetched on hover. On a page with many links (e.g. the homepage with ~40+ links), this could prefetch a significant amount of data on a slow connection.
- **Impact:** Minor bandwidth concern on mobile networks.
- **Severity:** Low
- **Confidence:** Reasoned

### L5. No `viewport-fit=cover` in viewport meta

- **Location:** `src/layouts/BaseLayout.astro` line 22: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- **Description:** Missing `viewport-fit=cover` for iPhone X+ notch / Dynamic Island safe-area insets.
- **Impact:** Content may not extend into safe areas on notched iPhones.
- **Severity:** Low
- **Confidence:** Reasoned

---

## Informational Findings

### I1. SVG logo vs text wordmark

- The original kelp.agency uses an inline SVG "Kelp" wordmark (paths). The clone uses a text wordmark `<a>Kelp</a>`. The text wordmark is documented as intentional in `docs/kelp-design-template.md` ("Wordmark over logo — 'Kelp' is set in Newsreader 18px, not a graphic logo"). Leave as-is.

### I2. Article body content is placeholder

- The 3 article markdown files contain placeholder body text ("This is where the full article body would go. For the purpose of this clone, we're showing the structure and metadata."). This is content work, not code work.

### I3. Case study body content is decent but generic

- The 6 case study markdown files have plausible body content but follow a repetitive template ("The Challenge / Our Approach / The Solution / The Result"). Acceptable for a demo clone.

---

## Verification Method

| Check | How | Result |
|-------|-----|--------|
| TypeScript + Astro diagnostics | `npm run check` | 0 errors, 0 warnings, 0 hints (27 files) |
| Production build | `npm run build` | 17 pages built in 1.61s, exit 0 |
| Deployed site console errors | `agent-browser console` on `https://astro.jesspete.shop/` | none |
| Deployed site page errors | `agent-browser errors` | none |
| Hero client link reachability | `agent-browser open` for each of 3 URLs | 1 OK, 2 × 404 |
| Footer "Clients" link reachability | `agent-browser open /work/clients/` | 404 |
| Social/discovery call link hrefs | `agent-browser get attr` | 5 × `href="#"` |
| Canonical URL | `agent-browser eval document.querySelector('link[rel=canonical]').href` | `https://kelp-clone.example.com/` |
| OG URL | `agent-browser eval document.querySelector('meta[property="og:url"]').content` | `https://kelp-clone.example.com/` |
| Theme color | `agent-browser eval document.querySelector('meta[name=theme-color]').content` | `#0d1726` |
| robots.txt | `agent-browser open /robots.txt` | empty |
| sitemap-index.xml | `agent-browser open /sitemap-index.xml` | 404 |
| Carousel a11y | `agent-browser eval` on `.carousel-wrapper` | `tabindex: -1`, no `role`, no `aria-label` |
| Original site nav structure | `agent-browser eval` on `nav.header-nav` | `<ul>` with `<li class="has-submenu">` and nested `<ul>` submenus with `aria-expanded`/`aria-controls` |
| Original site case study count | `agent-browser snapshot -i` on `/work/` | 9 case studies (clone has 6) |
| Original site platforms | snapshot on `/platforms/` + `/platforms/headless/` | 4 platforms including Headless (clone has 3) |
| Original `/work/clients/` | `agent-browser open` | HTTP 200, title "Kelp Client List" |
| Original `/services/#support` anchor | `agent-browser eval` | `<div id="support">` exists (clone uses `#ongoing-support`) |

---

## Out-of-Scope (intentionally not flagged)

- **Contact form has no backend** — documented in README/AGENTS.md as a stub. Intentional.
- **`src/scripts/` directory is empty** — documented in AGENTS.md. Intentional.
- **`skills/` symlink** — gitignored, not part of the repo. Intentional.
- **SVG logo vs text wordmark** — design choice documented in `docs/kelp-design-template.md`.

---

*End of audit findings. See `REMEDIATION_PLAN.md` for the fix plan.*
