<div align="center">

# Kelp Agency Clone

[![Astro](https://img.shields.io/badge/Astro-7.1.6-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.12.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![Output](https://img.shields.io/badge/Output-static-blue)](#deployment)

</div>

> A production-ready clone of [kelp.agency](https://www.kelp.agency/) built with **Astro 7** and **Tailwind CSS 4**.

> **Status:** ✅ Complete — 17 pages built, all routes return 200, `npm run check` passes. Verified against the kelp.agency live site on 2026-08-03.
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
npm run build        # → static output in dist/
npm run preview      # → serve dist/ on http://localhost:4321
```

**Requirements:** Node.js ≥ 22.12.0 (even versions only — Astro 7 constraint).

### Verify Setup

| Step | Command | Expected |
|------|---------|----------|
| Install | `npm install` | Completes with a tree of 230+ packages, no peer errors |
| Type-check | `npm run check` | `0 errors` / `0 hints` from `astro check` |
| Build | `npm run build` | `dist/` populated; `Complete!` with route list |
| Dev | `npm run dev` | Server reachable at `http://localhost:4321/`; homepage renders |

> **Note:** `npm run check` (`astro check`) is the **only** verification step in this repo. There is no test runner, linter, or formatter configured.

---

## File Hierarchy

```
📂 kelp-clone/
├── 📄 astro.config.mjs              # Astro + Tailwind 4 + Fonts API config
├── 📄 content.config.ts             # (src/) Content Layer collections + Zod schemas
├── 📄 tsconfig.json                 # Extends astro/tsconfigs/strict
├── 📄 package.json                  # name: kelp-clone; npm scripts only
├── 📄 AGENTS.md                     # Compact agent instructions (gotchas & commands)
├── 📄 CLAUDE.md                     # Full agent operating manual (Meticulous Approach)
├── 📄 astro-7-patterns.md            # Long Astro 7 reference used during build (46 KB)
│
├── 📂 docs/
│   ├── 📄 kelp-design-template.md   # Source-of-truth design spec (extracted from kelp.agency)
│   ├── 📄 IMPLEMENTATION_PLAN.md    # Phased build plan with checklists
│   ├── 📄 astro-7-patterns.md       # Copy of the root reference
│   └── 📄 astro-7-SKILL.md           # Astro 7 skill reference
│
├── 📂 public/
│   ├── 📄 favicon.svg                # Kelp "K" wordmark
│   └── 📂 images/                    # Static image assets
│
└── 📂 src/
    ├── 📂 components/
    │   ├── 📄 Header.astro          # Sticky nav, headroom behavior + mobile menu
    │   ├── 📄 Footer.astro          # 5-column footer
    │   ├── 📄 Button.astro          # Square-cornered button (primary / on-dark / secondary)
    │   ├── 📄 Section.astro         # Section wrapper (bg/padding variants)
    │   ├── 📄 PageHeader.astro      # Inner-page hero
    │   └── 📂 home/                  # Homepage sections
    │       ├── 📄 Hero.astro          # Type-as-image hero (H1 is the visual)
    │       ├── 📄 RecentWork.astro    # Vanilla-JS carousel (ships JS)
    │       ├── 📄 Services.astro       # 5-column service grid
    │       ├── 📄 HowWeWork.astro     # 5-step process
    │       ├── 📄 Testimonials.astro
    │       ├── 📄 FeaturedArticles.astro
    │       └── 📄 CTA.astro
    │
    ├── 📂 content/                   # Markdown + YAML content
    │   ├── 📂 case-studies/           # 6 case studies (.md)
    │   ├── 📂 services/               # 5 service categories (.md)
    │   ├── 📂 articles/               # 3 articles (.md)
    │   └── 📂 testimonials/           # 3 testimonials (.yaml)
    ├── 📄 content.config.ts          # Content Layer collections + Zod schemas
    ├── 📄 env.d.ts                   # Ambient types
    │
    ├── 📂 layouts/
    │   └── 📄 BaseLayout.astro       # HTML shell + ClientRouter + scroll-reveal script
    │
    ├── 📂 pages/
    │   ├── 📄 index.astro            # Homepage
    │   ├── 📄 404.astro              # Custom 404
    │   ├── 📄 about.astro
    │   ├── 📄 contact.astro          # Stub contact form (UNWIRED — see Contact form)
    │   ├── 📂 services/   → index.astro
    │   ├── 📂 work/       → index.astro (grid) + [slug].astro (case study)
    │   ├── 📂 platforms/  → index.astro
    │   └── 📂 resources/  → index.astro (list) + [slug].astro (article)
    │
    └── 📂 styles/
        └── 📄 global.css             # Tailwind 4 `@import "tailwindcss"` + @theme tokens
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
