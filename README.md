<div align="center">

# Kelp Agency Clone

[![Astro](https://img.shields.io/badge/Astro-7.1.6-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.12.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![Output](https://img.shields.io/badge/Output-static-blue)](#deployment)

</div>

> A production-ready clone of [kelp.agency](https://www.kelp.agency/) built with **Astro 7** and **Tailwind CSS 4**.

> **Status:** ✅ Remediated — 21 pages built, all internal links resolve (verified via `npm run check:links`), all content frontmatter valid (verified via `npm run check:content`), `npm run check` passes. Verified against the kelp.agency live site on 2026-08-04; see `docs/audit/AUDIT_FINDINGS.md` for the audit and `docs/audit/REMEDIATION_PLAN.md` for the fix log.
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
| Install | `npm install` | Completes with a tree of 230+ packages, no peer errors |
| Type-check | `npm run check` | `0 errors` / `0 hints` from `astro check` |
| Link check | `npm run check:links` | `✓ All internal links resolve.` (after `npm run build`) |
| Content check | `npm run check:content` | `✓ All content files valid.` |
| Build | `npm run build` | `dist/` populated; `Complete!` with route list + `sitemap-index.xml` |
| Dev | `npm run dev` | Server reachable at `http://localhost:4321/`; homepage renders |

> **Note:** `npm run check` (`astro check`) is the TypeScript/Astro verification step. `npm run check:links` and `npm run check:content` are project-specific regression tests (see `scripts/link-check.mjs` and `scripts/validate-content.mjs`) added during the 2026-08-04 remediation. The `prebuild` and `precheck` hooks (see `scripts/verify-deps.mjs`) auto-verify config-level dependencies before `build`/`check` run. There is no test runner, linter, or formatter configured.

---

## File Hierarchy

```
📂 kelp-clone/
├── 📄 astro.config.mjs              # Astro + Tailwind 4 + Fonts API + Sitemap config
├── 📄 content.config.ts             # (src/) Content Layer collections + Zod schemas
├── 📄 tsconfig.json                 # Extends astro/tsconfigs/strict
├── 📄 package.json                  # name: kelp-clone; npm scripts (incl. check:links, check:content)
├── 📄 AGENTS.md                     # Compact agent instructions (gotchas & commands)
├── 📄 CLAUDE.md                     # Full agent operating manual (Meticulous Approach)
├── 📄 astro-7-patterns.md            # Long Astro 7 reference used during build (46 KB)
│
├── 📂 docs/
│   ├── 📄 kelp-design-template.md   # Source-of-truth design spec (extracted from kelp.agency)
│   ├── 📄 IMPLEMENTATION_PLAN.md    # Phased build plan with checklists
│   ├── 📄 astro-7-patterns.md       # Copy of the root reference
│   ├── 📄 astro-7-SKILL.md           # Astro 7 skill reference
│   └── 📂 audit/                    # 2026-08-04 code audit + remediation plans
│       ├── 📄 AUDIT_FINDINGS.md      # Round 1: 26 findings (4 Critical, 8 High, 6 Medium, 5 Low, 3 Info)
│       ├── 📄 REMEDIATION_PLAN.md    # Round 1: phase-by-phase fix plan + TDD strategy
│       ├── 📄 REMEDIATION_PLAN_ROUND2.md  # Round 2: build-error root cause + dep guard + OG image
│       └── 📄 REMEDIATION_PLAN_ROUND3.md  # Round 3: skills compliance + design fidelity
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
└── 📂 src/
    ├── 📂 components/
    │   ├── 📄 Header.astro          # Sticky nav, headroom behavior + mobile menu + dropdown menus
    │   ├── 📄 Footer.astro          # 5-column footer (with Headless platform link)
    │   ├── 📄 Button.astro          # Square-cornered button (primary / on-dark / secondary)
    │   ├── 📄 Section.astro         # Section wrapper (bg/padding variants)
    │   ├── 📄 PageHeader.astro      # Inner-page hero
    │   └── 📂 home/                  # Homepage sections (all consume content collections)
    │       ├── 📄 Hero.astro          # Type-as-image hero (H1 is the visual)
    │       ├── 📄 RecentWork.astro    # Vanilla-JS carousel — uses caseStudies collection
    │       ├── 📄 Services.astro       # 5-column service grid — uses services collection
    │       ├── 📄 HowWeWork.astro     # 5-step process
    │       ├── 📄 Testimonials.astro   # Uses testimonials collection (3 entries)
    │       ├── 📄 FeaturedArticles.astro # Uses articles collection (top 3 by date)
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
