<div align="center">

# Kelp Agency Clone

[![Astro](https://img.shields.io/badge/Astro-7.1.6-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.12.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![Output](https://img.shields.io/badge/Output-static-blue)](#deployment)

</div>

> A production-ready clone of [kelp.agency](https://www.kelp.agency/) built with **Astro 7** and **Tailwind CSS 4**.

> **Status:** ✅ Remediated (round 5) — 21 pages built, all internal links resolve (verified via `npm run check:links`), all content frontmatter valid (verified via `npm run check:content`), `npm run check` passes, `npm run test:e2e` passes 42 Playwright specs across desktop + mobile viewports. Verified against the kelp.agency live site on 2026-08-05; see `docs/audit/AUDIT_FINDINGS.md` for the audit and `docs/audit/REMEDIATION_PLAN.md` through `docs/audit/REMEDIATION_PLAN_ROUND5.md` for the fix logs.
>
> **Live preview:** `npm run preview` after `npm install` → `http://localhost:4321/`.

---

## Overview

Kelp Agency Clone is a pixel-faithful, static clone of the Kelp Creative Agency marketing site. It exists to demonstrate a modern, content-first static stack — Astro's Content Layer API, View Transitions, and Fonts API alongside Tailwind CSS 4's CSS-first `@theme` configuration — rather than to ship a product. The whole site ships zero JavaScript by default (only a carousel and mobile menu opt in), achieving editorial agency aesthetic with strong Core Web Vitals by construction. Content (case studies, services, articles, testimonials) lives as Markdown/YAML validated at build time, so adding a page is a file edit, not a code change.

## Key Features

| ✨ | Feature | What it gives you |
|----|---------|--------------------|
| 🄰 | Astro 7 static output | Zero-JS-by-default HTML; only islands hydrate |
| 🄲 | Content Layer API | 4 collections validated by Zod at build time |
| 🄵 | View Transitions (`ClientRouter`) | Native page transitions; client scripts re-init on `astro:after-swap` |
| 🄶 | Astro Fonts API | Poppins + Newsreader self-hosted (no CDN/`@import`) |
| 🅃 | Tailwind 4 CSS-first `@theme` | Tokens in `global.css`; no `tailwind.config.js` |
| 🄴 | Editorial design system | Square corners, serif button text, alternating section backgrounds |
| 🄰 | WCAG 2.2 AA | Keyboard nav, focus-visible, skip link, reduced-motion |
| 🅂 | `getStaticPaths()` dynamic routes | `/work/[slug]`, `/resources/[slug]` |

---

## Quick Start

```bash
# 1. Install dependencies (use npm — lockfile is package-lock.json; no monorepo)
npm install

# 2. Start dev server
npm run dev          # → http://localhost:4321
```

**Build & preview the production output:**

```bash
npm run build        # → static output in dist/ (+ sitemap-index.xml)
npm run preview      # → serve dist/ on http://localhost:4321
```

**Requirements:** Node.js ≥ 22.12.0 (even versions only — Astro 7 constraint).

### After pulling new commits

If you've pulled commits that added or changed dependencies, **re-run `npm install`** before `npm run build` or `npm run check`. The `prebuild` and `precheck` npm lifecycle hooks will automatically verify that config-level dependencies (`astro`, `@astrojs/sitemap`, `@tailwindcss/vite`) are installed; if any are missing, the build fails fast with a clear "run `npm install`" message instead of a confusing Vite stack trace.

### Verify Setup

| Step | Command | Expected |
|------|---------|----------|
| Install | `npm install` | Completes with a tree of 300+ packages, no peer errors |
| Type-check | `npm run check` | `0 errors` / `0 hints` from `astro check` |
| Link check | `npm run check:links` | `✓ All internal links resolve.` (after `npm run build`) |
| Content check | `npm run check:content` | `✓ All content files valid.` |
| E2E tests | `npm run test:e2e` | `42 passed` — Playwright specs across desktop + mobile viewports |
| Build | `npm run build` | `dist/` populated; `Complete!` with route list + `sitemap-index.xml` |
| Dev | `npm run dev` | Server reachable at `http://localhost:4321/`; homepage renders |

> **Note:** `npm run check` (`astro check`) is the TypeScript/Astro verification step. `npm run check:links` and `npm run check:content` are project-specific regression tests (see `scripts/link-check.mjs` and `scripts/validate-content.mjs`) added during the 2026-08-04 remediation. `npm run test:e2e` (Playwright) was added during the 2026-08-05 round-5 remediation to catch View Transitions re-init regressions that the static checks cannot detect. The `prebuild` and `precheck` hooks (see `scripts/verify-deps.mjs`) auto-verify config-level dependencies before `build`/`check` run.

---

## File Hierarchy

```
📂 kelp-clone/
├── 📄 astro.config.mjs              # Astro + Tailwind 4 + Fonts API + Sitemap config
├── 📄 content.config.ts             # (src/) Content Layer collections + Zod schemas
├── 📄 tsconfig.json                 # Extends astro/tsconfigs/strict
├── 📄 package.json                  # name: kelp-clone; npm scripts (incl. check:links, check:content, test:e2e)
├── 📄 playwright.config.ts          # Playwright E2E config — desktop + mobile projects, preview server
├── 📄 AGENTS.md                     # Compact agent instructions (gotchas & commands)
├── 📄 CLAUDE.md                     # Full agent operating manual (Meticulous Approach)
├── 📄 astro-7-patterns.md            # Long Astro 7 reference used during build (46 KB)
│
├── 📂 docs/
│   ├── 📄 kelp-design-template.md   # Source-of-truth design spec (extracted from kelp.agency)
│   ├── 📄 IMPLEMENTATION_PLAN.md    # Phased build plan with checklists
│   ├── 📄 astro-7-patterns.md       # Copy of the root reference
│   ├── 📄 astro-7-SKILL.md           # Astro 7 skill reference
│   └── 📂 audit/                    # 2026-08-04 → 2026-08-05 code audit + remediation plans
│       ├── 📄 AUDIT_FINDINGS.md      # Round 1: 26 findings (4 Critical, 8 High, 6 Medium, 5 Low, 3 Info)
│       ├── 📄 REMEDIATION_PLAN.md    # Round 1: phase-by-phase fix plan + TDD strategy
│       ├── 📄 REMEDIATION_PLAN_ROUND2.md  # Round 2: build-error root cause + dep guard + OG image
│       ├── 📄 REMEDIATION_PLAN_ROUND3.md  # Round 3: skills compliance + design fidelity
│       ├── 📄 REMEDIATION_PLAN_ROUND4.md  # Round 4: content fidelity + brand motifs + SEO
│       └── 📄 REMEDIATION_PLAN_ROUND5.md  # Round 5: View Transitions re-init bugs + content + imagery + CI
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 ci.yml                # GitHub Actions: check + build + check:links + check:content on push/PR
│
├── 📂 public/
│   ├── 📄 favicon.svg                # Kelp "K" wordmark
│   ├── 📄 og-default.png             # Default Open Graph image (1200×630) — replace with designed asset
│   ├── 📄 robots.txt                 # Crawler directives + sitemap reference
│   └── 📂 images/                    # Static image assets
│
├── 📂 scripts/                      # Project-level scripts (regression tests + generators)
│   ├── 📄 link-check.mjs             # Static link checker — scans dist/ for broken internal links
│   ├── 📄 validate-content.mjs       # Content frontmatter validator — schema-critical field checks
│   ├── 📄 verify-deps.mjs            # prebuild/precheck guard — verifies config-level deps are installed
│   └── 📄 generate-og-image.py       # Renders public/og-default.png via PIL (re-run if design changes)
│
├── 📂 tests/                        # Playwright E2E specs (added round 5)
│   ├── 📄 homepage.spec.ts           # Homepage smoke + JSON-LD parseability
│   ├── 📄 carousel.spec.ts           # Carousel init + re-init after View Transition
│   ├── 📄 mobile-menu.spec.ts        # Mobile menu a11y + F1 regression test
│   ├── 📄 headroom.spec.ts           # Headroom + scroll-reveal + F2 regression test
│   └── 📄 dropdowns.spec.ts          # Desktop dropdowns + F3 regression test
│
└── 📂 src/
    ├── 📂 components/
    │   ├── 📄 Header.astro          # Sticky nav, headroom behavior + mobile menu + dropdown menus
    │   ├── 📄 Footer.astro          # 5-column footer (with Headless platform link)
    │   ├── 📄 Button.astro          # Square-cornered button (primary / on-dark / secondary)
    │   ├── 📄 Section.astro         # Section wrapper (bg/padding variants)
    │   ├── 📄 PageHeader.astro      # Inner-page hero
    │   ├── 📄 CaseStudyCover.astro  # Deterministic SVG cover art per case study (round 5)
    │   ├── 📄 ArticleCover.astro    # Deterministic SVG cover art per article (round 5)
    │   └── 📂 home/                  # Homepage sections (all consume content collections)
    │       ├── 📄 Hero.astro          # Type-as-image hero (H1 is the visual) + wave-divider SVG
    │       ├── 📄 HeroWave.astro       # Inline SVG wave-gradient divider (matches original kelp.agency)
    │       ├── 📄 RecentWork.astro    # Vanilla-JS carousel — uses caseStudies collection + CaseStudyCover
    │       ├── 📄 Services.astro       # 5-column service grid — uses services collection
    │       ├── 📄 HowWeWork.astro     # 5-step process
    │       ├── 📄 Testimonials.astro   # Uses testimonials collection (3 entries)
    │       ├── 📄 FeaturedArticles.astro # Uses articles collection (top 3 by date) + ArticleCover
    │       └── 📄 CTA.astro
    │
    ├── 📂 content/                   # Markdown + YAML content (single source of truth)
    │   ├── 📂 case-studies/           # 9 case studies (.md) — incl. marker-48, croom-brewery, beverlin-hills-quality-goods
    │   ├── 📂 services/               # 5 service categories (.md) — with anchor + offerings
    │   ├── 📂 articles/               # 3 articles (.md)
    │   └── 📂 testimonials/           # 3 testimonials (.yaml)
    ├── 📄 content.config.ts          # Content Layer collections + Zod schemas
    ├── 📄 env.d.ts                   # Ambient types
    │
    ├── 📂 lib/                       # Shared utilities
    │   └── 📄 service-order.ts        # SERVICE_ORDER constant — shared display order for services
    │
    ├── 📂 layouts/
    │   └── 📄 BaseLayout.astro       # HTML shell + ClientRouter + scroll-reveal + SEO meta (OG, Twitter, canonical, sitemap)
    │
    ├── 📂 pages/
    │   ├── 📄 index.astro            # Homepage
    │   ├── 📄 404.astro              # Custom 404
    │   ├── 📄 about.astro
    │   ├── 📄 contact.astro          # Stub contact form (UNWIRED — see Contact form)
    │   ├── 📂 services/   → index.astro (uses services collection)
    │   ├── 📂 work/       → index.astro (grid) + [slug].astro (case study) + clients.astro (client list)
    │   ├── 📂 platforms/  → index.astro (4 platforms incl. Headless)
    │   └── 📂 resources/  → index.astro (list) + [slug].astro (article)
    │
    └── 📂 styles/
        └── 📄 global.css             # Tailwind 4 `@import "tailwindcss"` + @theme tokens + .prose-kelp + dropdown menu styles
```

> `dist/` and `.astro/` are generated (gitignored). The `skills/` symlink targets `~/.pi/agent/skills` and is gitignored — it is not part of this repo.

---

## Design System

All design tokens are defined in `src/styles/global.css` under the `@theme` block, and documented in [`docs/kelp-design-template.md`](docs/kelp-design-template.md). The full set (including `--color-seafoam`, `--color-slate`, `--color-indigo`, `--color-black`) lives in `global.css`; the user-facing palette:

| Token | Value | Use |
|-------|-------|-----|
| `--color-ink` | `#0d1726` | Primary text, dark section backgrounds, button bg |
| `--color-paper` | `#ffffff` | Default page background |
| `--color-kelp` | `#42c634` | Hover states, accents (used sparingly) |
| `--color-mist` | `#f4f4f4` | Testimonials section background |
| `--color-teal` | `#c5f5f6` | Decorative accent |
| `--color-coral` | `#f9a79c` | Decorative accent |
| `--font-poppins` | Poppins (500/600/700) | All headings, nav, buttons |
| `--font-newsreader` | Newsreader (300/400/600 + italic) | All body copy, **button text** |

**Signature design choices:**
- **Zero border-radius** everywhere — buttons, cards, inputs all use square corners.
- **Serif button text** — buttons use Newsreader, not Poppins (unusual; matches original).
- **Type-as-image hero** — Homepage hero has no background image; the H1 is the visual.
- **Alternating section backgrounds** — White → Ink → White → Ink → Mist → White → Ink.
- **Italic Newsreader for editorial emphasis** in body copy.

> The design system is **load-bearing**. Deviating from `docs/kelp-design-template.md` (rounded corners, switching the button font, flattening section backgrounds) breaks the look more than it would in a normal project — see [`AGENTS.md`](AGENTS.md).

---

## Astro 7 Features Used

| Feature | Where |
|---------|-------|
| Content Layer API with `glob()` loader | `src/content.config.ts` — 4 collections (caseStudies, services, articles, testimonials) |
| Zod 4 schemas (imported from `astro/zod`) | `src/content.config.ts` |
| `getCollection()` / `getEntry()` / `render()` | `src/pages/work/[slug].astro`, `src/pages/resources/[slug].astro` |
| `getStaticPaths()` for dynamic routes | `src/pages/work/[slug].astro`, `src/pages/resources/[slug].astro` |
| View Transitions (`ClientRouter`) | `src/layouts/BaseLayout.astro` |
| Fonts API (`fontProviders.google()`) | `astro.config.mjs` — Poppins + Newsreader auto-self-hosted |
| Tailwind 4 via `@tailwindcss/vite` | `astro.config.mjs` + `src/styles/global.css` |
| `prefetch` config | `astro.config.mjs` — hover-based prefetching |
| Static output (`output: 'static'`) | `astro.config.mjs` |
| `astro:transitions` lifecycle events | `src/layouts/BaseLayout.astro` — re-init carousel + scroll reveal on `astro:after-swap` |

---

## Content Management

All content lives in `src/content/` as Markdown (`.md`) or YAML (`.yaml`) files. The Content Layer API validates frontmatter against Zod schemas at build time.

**To add a new case study:**
1. Create `src/content/case-studies/my-new-case.md`
2. Add frontmatter matching the schema in `src/content.config.ts`
3. The case study automatically appears on `/work/` and is reachable at `/work/my-new-case/`

**To add a new article:**
1. Create `src/content/articles/my-article.md`
2. Add frontmatter matching the schema
3. The article automatically appears on `/resources/` and is reachable at `/resources/my-article/`

---

## Deployment

This is a static site (`output: 'static'`). Run `npm run build` and deploy the `dist/` directory to any static host:

- **Netlify:** Connect repo, or `netlify deploy --prod --dir=dist`
- **Vercel:** `vercel --prod`
- **Cloudflare Pages:** `wrangler pages deploy dist`
- **GitHub Pages:** Use the official Astro GitHub Action

---

## Contact Form

`/contact/` is a **stub HTML form with no backend** — it does not currently submit anywhere. When wiring it for production:

- **Formspree:** Set `action="https://formspree.io/f/YOUR_ID"` on the `<form>` element.
- **Netlify Forms:** Add `data-netlify="true"` to the `<form>` element.
- **Astro Actions (experimental):** Convert to an Action with `defineAction()` and a Zod schema.

---

## Contributing

This is a proprietary clone (no external contributions), but the conventions below matter for anyone (human or agent) editing the repo:

### Stack conventions that differ from defaults

- **npm only** — the lockfile is `package-lock.json`; do not use pnpm or yarn (no monorepo).
- **Tailwind 4 is CSS-first** — tokens live in `src/styles/global.css` under `@theme`. There is **no `tailwind.config.js`**; do not create one.
- **Fonts are self-hosted via the Astro Fonts API** — never use `@import`/CDN. They are declared in `astro.config.mjs`; the `@theme` font vars in `global.css` are mirrors for Tailwind utility generation.
- **`npm run check` is the only verification step** — no test runner, linter, or formatter is configured. Run it after every edit.
- **Client JS is opt-in and must re-bind on `astro:after-swap`** — View Transitions (`ClientRouter` in `BaseLayout.astro`) will otherwise break features on subsequent navigation.
- **Do not "normalize" the design** — square corners, serif button text, and alternating section backgrounds are intentional. See [`docs/kelp-design-template.md`](docs/kelp-design-template.md).

### Agent instructions
- [`AGENTS.md`](AGENTS.md) — compact gotchas and exact commands.
- [`CLAUDE.md`](CLAUDE.md) — full Meticulous Approach operating manual including the six-phase workflow.

---

## Skills Used

This clone was built using the following skills from the [nordeim/my-pi-agent](https://github.com/nordeim/my-pi-agent) repository:

- **`astro-7`** — Astro 7 platform patterns (Content Layer API, View Transitions, Fonts API, etc.)
- **`avant-garde-design-v4`** — Animation standards, accessibility checklist, anti-generic design principles
- **`tailwind-patterns`** — Tailwind 4 CSS-first `@theme` configuration
- **`frontend-design`** — Component composition and layout thinking
- **`code-quality-standards`** — Six-Axis review (Correctness, Readability, Architecture, Security, Performance, Aesthetic)

---

## License

Proprietary. This is a clone built for demonstration purposes. The original kelp.agency design is © Kelp Creative Agency.

---

## Changelog

- **2026-08-03** — Initial build. 17 pages, 4 content collections, 18 components. Verified against kelp.agency live site.
- **2026-08-04** — Remediation pass. 26 findings addressed (4 Critical, 8 High, 6 Medium, 5 Low, 3 Informational). Highlights:
  - **Critical:** Fixed 5 broken internal links (Hero `Marker 48`, `Beverlin Hills`; Footer `Clients`; 5 placeholder `#` links); corrected malformed `partners-vs-pirates.md` frontmatter.
  - **Content:** Added 3 missing case studies (`marker-48`, `croom-brewery`, `beverlin-hills-quality-goods`) and a new `/work/clients/` page; populated service `offerings` arrays; all homepage sections now consume content collections (single source of truth).
  - **SEO/Config:** `astro.config.mjs` `site` now points at the deployed `https://astro.jesspete.shop` domain (canonical URLs + OG URLs fixed); added `@astrojs/sitemap` integration + `public/robots.txt`; corrected `theme-color` meta; added `og:site_name`, default OG image meta, and Twitter card meta.
  - **A11y:** Carousel wrapper now keyboard-focusable with `role="region"` and slide `aria-roledescription="slide"` semantics; arrow-key nav with `preventDefault`.
  - **Header:** Added dropdown menus for Services, Work, Platforms, Resources (with `aria-expanded`, `aria-controls`, Escape-to-close, outside-click-to-close, hover/focus reveal via CSS).
  - **Platforms:** Added 4th platform (Headless) to `/platforms/` and Footer.
  - **Polish:** Replaced unused `prose prose-lg` classes (no `@tailwindcss/typography` installed) with a project-local `.prose-kelp` style block; reduced 404 page top padding; extracted header height to `--header-height` CSS variable for the mobile menu offset.
  - **Tests:** Added `scripts/link-check.mjs` (static internal-link checker) and `scripts/validate-content.mjs` (frontmatter validator), wired as `npm run check:links` and `npm run check:content`.
  - **Docs:** Updated `README.md`, `AGENTS.md`, `CLAUDE.md`, and `docs/kelp-design-template.md` to reflect the remediated state. Added `docs/audit/AUDIT_FINDINGS.md` and `docs/audit/REMEDIATION_PLAN.md`.
  - **Result:** 21 pages built (was 17); 0 broken internal links; 0 content validation errors; `npm run check` clean.
- **2026-08-04 (round 2)** — Build-error remediation. Triggered by a user report that `npm run build` failed with `Cannot find module '@astrojs/sitemap'` after pulling the round-1 commits without running `npm install`. Root cause: `astro.config.mjs` imports config-level deps at module load; if `node_modules/` is stale, Vite throws a confusing stack trace. Fixes:
  - **`prebuild` / `precheck` dep verification (B1):** Added `scripts/verify-deps.mjs` — a zero-dependency Node script that checks `astro`, `@astrojs/sitemap`, `@tailwindcss/vite`, `@astrojs/check`, and `typescript` are installed before `astro build` or `astro check` runs. Wired as npm `prebuild` and `precheck` lifecycle hooks. On missing deps, prints a clear "run `npm install`" message and exits 1 — no more Vite stack trace.
  - **Default OG image (B2):** Created `public/og-default.png` (1200×630, 23 KB) via `scripts/generate-og-image.py` (PIL). The OG image meta tag (wired in round-1 L1) now resolves to a real file instead of 404. The image is a functional placeholder — kelp-green accent bar, "Kelp" wordmark in serif, tagline below, on an ink background. The maintainer can replace it with a designed asset at the same dimensions.
  - **Documentation (B3):** Added an "After pulling new commits" note to README Quick Start; documented the `prebuild`/`precheck` hooks in README, AGENTS.md, and CLAUDE.md. Added `docs/audit/REMEDIATION_PLAN_ROUND2.md` with root-cause analysis and TDD evidence.
  - **Result:** `rm -rf node_modules dist && npm run build` now fails fast with a helpful message (verified). `npm install && npm run build` succeeds — 21 pages, sitemap, 0 broken links, 0 content errors, 0 type errors.
- **2026-08-04 (round 3)** — Skills compliance + design fidelity. Triggered by a post-deployment E2E test of the live site against the original `kelp.agency` plus a compliance review against the `astro-7` and `astro-7-patterns` skills. Fixes:
  - **Mobile menu dialog semantics (R3-1):** Added `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"` to the mobile menu container, per `astro-7-patterns` skill §7 checklist item 4. Screen readers now announce the menu as a dialog with the rest of the page inert.
  - **Mobile menu focus management (R3-2):** `openMenu()` now moves focus to the menu's first link via `requestAnimationFrame` (so the menu is visible before focus moves). `closeMenu()` returns focus to the toggle button. Verified via `agent-browser`: open → focus on Services link; Escape → focus on hamburger button.
  - **Footer "Ready to get started?" CTA column (R3-3):** Added a 6th footer column matching the original kelp.agency — H3 + description + "Schedule a Meeting" button. Changed grid from `lg:grid-cols-5` to `lg:grid-cols-6`. The `FooterColumn` interface now supports an `isCTA` flag for CTA-style columns.
  - **How We Work "Ready to get started?" link (R3-4):** Added a CTA link at the end of the 5-step process, matching the original kelp.agency's How We Work section. Links to `/contact/` with a kelp-green underline.
  - **DRY `desiredOrder` (R3-5):** Extracted the service category display order from duplicated inline arrays in `Services.astro` and `services/index.astro` into a shared `src/lib/service-order.ts` module exporting `SERVICE_ORDER`. Both consumers now import from the same source.
  - **Result:** `npm run check` (0/0/0), `npm run build` (21 pages), `npm run check:links` (0 broken), `npm run check:content` (0 errors). E2E verified via `agent-browser` against local preview: footer has 6 columns, HowWeWork has CTA link, mobile menu has dialog ARIA + focus management.
  - **Replaced fabricated contact info (R4-1, Critical):** Contact page now shows the real Kelp address (`P.O. Box 116, Brooksville, FL 34605`), real phone (`352-325-7688`), and correct email (`info@kelp.agency` — was `hello@kelp.agency`). Testimonials now use clearly-fictional placeholder names (Jane Doe, John Smith, Alex Sample) instead of fabricated names attached to real client companies. About page team now uses fictional placeholders (Jane Doe, John Smith, Alex Sample, Sam Wilson) with an explicit note that they are not real Kelp staff, plus links to the original About page for the real team.
  - **Added brand-motif SVGs (R4-2, Medium):** Created `src/components/home/HeroWave.astro` — an inline SVG wave-divider with aqua-to-teal gradient (`#bef3f4 → #80e6e9`) matching the original's `class="hero-water"`. Added a custom leaf-shaped quotation-mark SVG (90.8×67.3 viewBox, `--color-seafoam` fill) to each testimonial figure. Both verified via `agent-browser eval` — SVGs are in the DOM with the correct gradients and colors.
  - **Aligned title-tag convention (R4-3, Low):** Homepage `<title>` is now `"Kelp Creative Agency"` (was `"Kelp Creative Agency — Central Florida's Award-Winning Creative Agency"`). Inner pages follow the original's convention: `"About Kelp"`, `"Contact Kelp"`, `"Kelp's Services"`, `"Our Work"`, `"Kelp Client List"`, `"Kelp's Preferred Platforms"`, `"Kelp Resources"`. Case-study and article detail pages keep `"{Title} — Kelp Creative Agency"` (matches original).
  - **Added JSON-LD structured data (R4-4, Medium):** `BaseLayout.astro` now emits a `<script type="application/ld+json">` block with schema.org `Organization` (name, url, logo, email, phone, address, sameAs social links), `WebSite`, `WebPage`, and `BreadcrumbList` (Home → current page, skipped on homepage). Uses `set:html` with `JSON.stringify()` — safe because content is 100% server-controlled (per astro-7 anti-pattern #14). Verified parseable via Python `json.loads`.
  - **Result:** `npm run check` (0/0/0), `npm run build` (21 pages), `npm run check:links` (0 broken, 1308 checked), `npm run check:content` (0 errors). E2E verified: contact info correct, testimonials fictional, hero wave SVG present, testimonial leaf SVGs present (3, seafoam green), titles match original, JSON-LD valid with 3-4 entries per page.
- **2026-08-05 (round 5)** — View Transitions re-init bugs + content + imagery + CI. Triggered by a Mode C systematic code audit (per `astro-7` + `astro-7-patterns` skills compliance checklist) + `agent-browser` E2E validation against the live clone (`https://astro.jesspete.shop/`) and the original (`https://www.kelp.agency/`). All fixes verified via TDD (red → green → refactor) using a newly-added Playwright suite. Fixes:
  - **Mobile menu re-init on `astro:after-swap` (F1, High):** The mobile menu script in `Header.astro` captured `toggle` and `menu` once at script execution and only registered `closeMenu` on swap — after the first View Transition, the new hamburger button had no click listener and the mobile menu became unresponsive. Verified via live reproduction on `https://astro.jesspete.shop/`. Fix: refactored to an idempotent `initMobileMenu()` function that re-queries the toggle/menu on every call (mirroring the existing `initDropdowns` pattern in the same file). Verified via Playwright regression test.
  - **Headroom re-init on `astro:after-swap` (F2, Medium):** The headroom script in `BaseLayout.astro` captured `.site-header` once at script execution. The `astro:after-swap` handler only re-initialized the IntersectionObserver for `[data-reveal]` — not the headroom. After a View Transition, the scroll listener kept mutating the now-detached OLD header; the NEW header never received `is-scrolled` / `headroom--pinned` / `headroom--unpinned`. Fix: extracted `initHeadroom()` and `initScrollReveal()` functions; both are called on initial load and inside the `astro:after-swap` handler. Idempotency via `dataset.headroomInit` flag.
  - **Dropdown outside-click listener leak (F3, Medium):** The `initDropdowns()` function attached a `document.addEventListener('click', …)` outside-click listener INSIDE the function. Since `initDropdowns()` is called on initial load AND on every `astro:after-swap`, each View Transition added another identical listener — a memory leak with idempotent effect. Fix: moved the document-level listener OUT of `initDropdowns()` so it's attached only once at module level. The per-trigger `forEach` (correctly idempotent via `dataset.dropdownInit`) stays inside `initDropdowns()`.
  - **Validator schema gap (F4, Low):** `scripts/validate-content.mjs` services schema omitted the `anchor` field from `required`, even though `src/content.config.ts` requires it. A service markdown file missing `anchor:` would pass `check:content` but fail `astro build` with a less-friendly Zod error. Fix: added `'anchor'` to the `required` array.
  - **Templated case-study bodies (F5, Informational):** 6 of 9 case-study markdown files shared word-for-word-identical body paragraphs — only the client name in the opening sentence differed. The 3 newer case studies (`marker-48`, `croom-brewery`, `beverlin-hills-quality-goods`) demonstrated the intended quality bar. Fix: replaced all 6 templated bodies (`spring-water-spirits`, `unprofitable`, `elev8-fun`, `mountaineer-coffee`, `deals-in-dirt`, `harts-meat-market`) with unique, client-specific content grounded in the client's publicly-known business.
  - **Portfolio imagery (F6, High — from comparative analysis):** The clone used CSS gradients for case-study cards while the original `kelp.agency` has real portfolio screenshots. Cannot legally reuse the original's copyrighted images. Fix: created `CaseStudyCover.astro` and `ArticleCover.astro` — deterministic SVG cover components that generate unique branded cover art per case study / article, derived from a hash of the client/title. Each cover is visually distinct, infinitely scalable, and adds zero network requests (SVG inlines directly into HTML). Verified via `agent-browser eval` — all 9 carousel slides + 3 article cards now have unique SVG covers with `<title>` for a11y.
  - **Testing infrastructure (F8, High):** Added Playwright E2E test suite (`tests/` directory, 5 spec files, 21 specs × 2 projects = 42 tests). Covers homepage smoke, carousel init + re-init, mobile menu a11y + F1 regression, headroom + scroll-reveal + F2 regression, dropdowns + F3 regression. `playwright.config.ts` configures `webServer` to auto-build + preview on `npm run test:e2e`. Added `npm run test:e2e` script. All 42 tests pass.
  - **CI/CD (F9, Medium):** Added `.github/workflows/ci.yml` that runs on every push to `main` and every PR. Steps: checkout, setup-node 22, npm install, npm run check, npm run build, npm run check:links, npm run check:content. Uploads `dist/` artifact on `main`. Playwright intentionally excluded from CI for now (browser-binary download is heavy).
  - **Re-validated `docs/kelp_agency_comparative_analysis.md` and `docs/kelp_clone_remediation_plan.md`:** Of the 15 critical/high/medium discrepancies in the comparative analysis, only 2 were genuinely outstanding (carousel post-navigation breakage → F1; missing portfolio imagery → F6). The other 13 were stale (already fixed in rounds 1–4), invalid (the original `kelp.agency` also doesn't have a client logo bar), or out-of-scope (Resources as blog, anchor-based services). Of the 22 sub-items in the proposed remediation plan, only 4 were genuinely outstanding (F6, F8 testing, F9 CI/CD, plus the deferred F5). The other 18 were invalid, already done, or out-of-scope.
  - **Result:** `npm run check` (0/0/0), `npm run build` (21 pages), `npm run check:links` (0 broken, 1311 checked), `npm run check:content` (0 errors), `npm run test:e2e` (42 passed). E2E verified via `agent-browser` on local preview: mobile menu opens after View Transition (F1 fixed), headroom adds `is-scrolled` class after View Transition (F2 fixed), case study cards have unique SVG covers (F6 fixed).
