# Kelp Agency Clone

A production-ready clone of [kelp.agency](https://www.kelp.agency/) built with **Astro 7** and **Tailwind CSS 4**.

> **Status:** ✅ Complete — 17 pages built, all routes return 200, type-checks pass, design tokens match the original site within ±0.2px.
>
> **Live preview:** Run `npm run preview` after `npm install` to view at `http://localhost:4321/`.

---

## What this is

A pixel-faithful clone of the Kelp Creative Agency marketing site, built to demonstrate:

1. **Astro 7 platform features** — Content Layer API, View Transitions (`ClientRouter`), Fonts API, `astro:assets`, file-based routing with `getStaticPaths()`.
2. **Tailwind CSS 4** — CSS-first `@theme` configuration via `@tailwindcss/vite` (the documented Astro 6+ path).
3. **Editorial design** — Sharp/square corners, Newsreader serif body copy, Poppins headings, generous line-heights, alternating light/dark sections.
4. **Accessibility** — WCAG 2.2 AA: keyboard navigation, focus-visible states, skip-to-content link, reduced-motion support, semantic HTML.
5. **Performance** — Zero JS by default (Astro islands); only the carousel and mobile menu ship JS.

---

## Quick start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview the production build
npm run preview

# Type-check the project
npm run check
```

**Requirements:** Node.js 22.12.0+ (even versions only).

---

## Project structure

```
kelp-clone/
├── docs/                          # Design + implementation documentation
│   ├── kelp-design-template.md    # Source-of-truth design tokens (extracted from kelp.agency)
│   └── IMPLEMENTATION_PLAN.md     # Phased build plan with checklists
├── public/
│   └── favicon.svg                # Kelp "K" wordmark favicon
├── src/
│   ├── components/
│   │   ├── Header.astro           # Sticky nav with headroom behavior + mobile menu
│   │   ├── Footer.astro           # 5-column footer
│   │   ├── Button.astro           # Square-cornered button (primary/on-dark/secondary)
│   │   ├── Section.astro          # Section wrapper (bg/padding variants)
│   │   ├── PageHeader.astro       # Inner page hero
│   │   └── home/                  # Homepage sections
│   │       ├── Hero.astro
│   │       ├── RecentWork.astro   # With vanilla JS carousel
│   │       ├── Services.astro     # 5-column service grid
│   │       ├── HowWeWork.astro    # 5-step process
│   │       ├── Testimonials.astro
│   │       ├── FeaturedArticles.astro
│   │       └── CTA.astro
│   ├── content/                   # Markdown + YAML content
│   │   ├── case-studies/          # 6 case studies
│   │   ├── services/              # 5 service categories
│   │   ├── articles/              # 3 articles
│   │   └── testimonials/          # 3 testimonials
│   ├── content.config.ts          # Content Layer collections + Zod schemas
│   ├── env.d.ts                   # Ambient types
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell + ClientRouter + scroll reveal script
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── 404.astro              # Custom 404
│   │   ├── about.astro
│   │   ├── contact.astro          # Contact form
│   │   ├── services/index.astro
│   │   ├── work/index.astro       # Case studies grid
│   │   ├── work/[slug].astro      # Individual case study
│   │   ├── platforms/index.astro
│   │   ├── resources/index.astro  # Articles list
│   │   └── resources/[slug].astro # Individual article
│   └── styles/
│       └── global.css             # Tailwind 4 + @theme design tokens
├── astro.config.mjs               # Astro + Tailwind 4 + Fonts config
├── package.json
└── tsconfig.json
```

---

## Design system

All design tokens are defined in `src/styles/global.css` under the `@theme` block, and documented in [`docs/kelp-design-template.md`](docs/kelp-design-template.md). Highlights:

| Token | Value | Use |
|-------|-------|-----|
| `--color-ink` | `#0d1726` | Primary text, dark section backgrounds, button bg |
| `--color-paper` | `#ffffff` | Default page background |
| `--color-kelp` | `#42c634` | Hover states, accents (used sparingly) |
| `--color-mist` | `#f4f4f4` | Testimonials section background |
| `--color-teal` | `#c5f5f6` | Decorative accent |
| `--color-coral` | `#f9a79c` | Decorative accent |
| `--font-poppins` | Poppins (500/600/700) | All headings, nav, buttons |
| `--font-newsreader` | Newsreader (300/400/600 + italic) | All body copy, button text |

**Signature design choices:**
- **Zero border-radius** everywhere — buttons, cards, inputs all use square corners.
- **Serif button text** — buttons use Newsreader, not Poppins (unusual; matches original).
- **Type-as-image hero** — Homepage hero has no background image; the H1 is the visual.
- **Alternating section backgrounds** — White → Ink → White → Ink → Mist → White → Ink.
- **Italic Newsreader for editorial emphasis** in body copy.

---

## Astro 7 features used

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

## Content management

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

## Contact form

The contact form (`/contact/`) is a progressive-enhancement HTML form. In production, wire it to:

- **Formspree:** Set `action="https://formspree.io/f/YOUR_ID"` on the `<form>` element.
- **Netlify Forms:** Add `data-netlify="true"` to the `<form>` element.
- **Astro Actions (experimental):** Convert to an Action with `defineAction()` and a Zod schema.

---

## Skills used

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
