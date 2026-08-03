# Implementation Plan — Kelp Agency Clone

> **Project:** Clone of `https://www.kelp.agency/` built with Astro 7 + Tailwind 4.
> **Author:** Super Z (AI agent), 2026-08-03.
> **Workspace:** `/home/z/my-project/kelp-clone/` (Astro project) + `/home/z/my-project/download/` (deliverables).
> **Source skills used:**
> - `astro-7` (from `my-pi-agent/skills/astro-7/`) — Astro 7 platform patterns, Content Layer API, View Transitions, Server Islands, Fonts API, `astro:env`, `astro:assets`.
> - `avant-garde-design-v4` (from `my-pi-agent/skills/avant-garde-design-v4/`) — Anti-generic design principles, animation standards, mobile navigation patterns, accessibility checklist.
> - `tailwind-patterns` (referenced in skills catalog) — Tailwind 4 CSS-first `@theme` configuration.
> - `frontend-design` (referenced) — Design thinking for components, layouts, color, typography.
> - `code-quality-standards` (referenced) — Six-Axis review for production quality.
>
> **Design source of truth:** `kelp-design-template.md` (extracted via agent-browser from the live kelp.agency site).

---

## 1. Project Goals

Build a production-ready clone of `kelp.agency` that:

1. **Matches the visual design** — Colors, typography, spacing, layout, and component behavior extracted in `kelp-design-template.md`.
2. **Uses Astro 7** — Leverages the platform features documented in the `astro-7` skill (View Transitions, Fonts API, Content Layer API, `astro:assets`).
3. **Uses Tailwind 4** — CSS-first `@theme` configuration via `@tailwindcss/vite` (the documented Astro 6+ path; no `@astrojs/tailwind`).
4. **Is multi-page** — Homepage + Services + Work + Platforms + Resources + About + Contact (matching the kelp.agency nav).
5. **Is accessible** — WCAG 2.2 AA: keyboard navigation, focus states, reduced-motion support, semantic HTML.
6. **Is performant** — Zero JS by default (Astro islands architecture); only the carousel and mobile menu ship JS.
7. **Is deployment-ready** — Builds cleanly to static `dist/` that can be deployed to any static host.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Astro 7.x | Matches the `astro-7` skill; zero-JS-by-default fits kelp's editorial aesthetic. |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | Documented Astro 6+ path in the skill; CSS-first `@theme` for design tokens. |
| Fonts | Astro 6 Fonts API with `fontProviders.google()` | Auto-self-hosts, subsets, generates fallback metrics — no third-party CDN. |
| Content | Astro Content Layer API (`src/content.config.ts`) | Type-safe case studies, services, testimonials, articles. |
| Images | `astro:assets` `<Image />` and `<Picture />` | Built-in AVIF/WebP optimization. |
| Routing | File-based (`src/pages/`) + `getStaticPaths()` for dynamic case study routes. | Standard Astro pattern. |
| Animations | Vanilla JS islands + CSS transitions + View Transitions API | No animation library needed for this scope. |
| Icons | Text arrows (←, →) + minimal inline SVG | Matches kelp's icon-less aesthetic. |
| Deployment | Static (`output: 'static'`) | No SSR needed for a marketing site. |
| Node | 22.12.0+ (Astro 7 requirement) | Per skill documentation. |

---

## 3. Phased Plan

The build is organized into 6 phases. Each phase has a checklist that must be satisfied before moving to the next.

### Phase 1 — Project Initialization (estimated: 15 minutes)

**Goal:** Set up the Astro 7 project with Tailwind 4, fonts, and base configuration.

**Tasks:**
1. Run `npm create astro@latest` with the "Empty" template in `/home/z/my-project/kelp-clone/`.
2. Install dependencies: `tailwindcss`, `@tailwindcss/vite`.
3. Configure `astro.config.mjs` with Tailwind 4 Vite plugin, Fonts API (Poppins + Newsreader), `site` URL, and `prefetch`.
4. Create `src/styles/global.css` with `@import "tailwindcss"` and `@theme` block mapping kelp design tokens.
5. Create `src/env.d.ts` with `App.Locals` type declarations.
6. Verify `npm run dev` starts cleanly at `http://localhost:4321`.
7. Verify `npm run build` produces `dist/index.html`.

**Phase 1 checklist:**
- [ ] `package.json` shows `astro: "^7.x"` and `tailwindcss: "^4.x"`
- [ ] `astro.config.mjs` has `fontProviders.google()` for Poppins and Newsreader
- [ ] `astro.config.mjs` has `tailwindcss()` in `vite.plugins`
- [ ] `global.css` has `@theme` block with `--color-ink`, `--color-kelp`, `--font-poppins`, `--font-newsreader`
- [ ] `npm run dev` works
- [ ] `npm run build` works

---

### Phase 2 — Layouts & Core Components (estimated: 30 minutes)

**Goal:** Build the BaseLayout, Header (with sticky nav), Footer, and shared UI primitives.

**Tasks:**
1. Create `src/layouts/BaseLayout.astro` — HTML shell with `<head>`, `<ClientRouter />`, slot for page content, global CSS import.
2. Create `src/components/Header.astro` — sticky nav with "Kelp" wordmark, nav menu (Services, Work, Platforms, Resources, About, Contact Us), "Hire Us" CTA. Mobile hamburger menu as a vanilla JS island.
3. Create `src/components/Footer.astro` — 5-column footer with Services, Contact, Work, Platforms, "Follow us on social" + copyright line.
4. Create `src/components/Button.astro` — reusable button component (primary/secondary variants, square corners, Newsreader text).
5. Create `src/components/Section.astro` — section wrapper with bg variant (white/ink/mist) and padding scale tokens.
6. Create `src/components/MobileMenu.astro` — client island (`client:load`) for the hamburger menu toggle.
7. Verify the header sticks and toggles mobile menu on small viewports.

**Phase 2 checklist:**
- [ ] `BaseLayout.astro` includes `<ClientRouter />` and imports `global.css`
- [ ] `Header.astro` has sticky positioning with headroom behavior
- [ ] `Header.astro` nav items match kelp.agency (Services, Work, Platforms, Resources, About, Contact Us, Hire Us)
- [ ] `Footer.astro` has 5 columns + copyright
- [ ] `Button.astro` produces square-cornered buttons with Newsreader text
- [ ] All buttons have `border-radius: 0`
- [ ] Mobile menu opens/closes on hamburger click
- [ ] Header is responsive (hamburger appears < 768px)

---

### Phase 3 — Homepage Sections (estimated: 60 minutes)

**Goal:** Build all 7 homepage sections in order: Hero, Recent Work, Services, How We Work, Testimonials, Featured Articles, CTA.

**Tasks:**
1. Create `src/pages/index.astro` — imports all section components, passes them through BaseLayout.
2. **Hero section** (`src/components/home/Hero.astro`):
   - H1: "Central Florida's Award Winning Creative Agency." (Poppins 700, clamp responsive)
   - Subhead with italic Newsreader emphasis
   - Client logos row (3 text links: Elev8 Fun, Marker 48, Beverlin Hills)
   - Min-height 720px, no background image
3. **Recent Work section** (`src/components/home/RecentWork.astro`):
   - Dark ink background
   - H2: "Our Work In the real-world"
   - Vanilla JS carousel island (`src/components/home/WorkCarousel.astro`, `client:visible`)
   - 6 case study cards (Spring Water Spirits, Deals In Dirt, Hart's Meat Market, Elev8 Fun, Mountaineer Coffee, Unprofitable)
   - Prev/Next buttons with arrow characters
4. **Services section** (`src/components/home/Services.astro`):
   - White background
   - H2: "Our Services"
   - 5-column grid (responsive to stack on mobile)
   - Categories: Branding & Design, Websites, Marketing & Strategy, Media, Ongoing Support
   - Service links per category (from design template §5)
5. **How We Work section** (`src/components/home/HowWeWork.astro`):
   - Dark ink background
   - Oversized H2: "How We Work"
   - Intro statement: "Everything we work on follows the same 5 basic steps in order:"
   - 5 numbered steps (Discovery, Planning, Production, Market, Ongoing Support) with descriptions
6. **Testimonials section** (`src/components/home/Testimonials.astro`):
   - Mist gray background
   - H2: "What Our Clients Say"
   - Single large testimonial quote (Newsreader 300 weight)
   - Attribution below
7. **Featured Articles section** (`src/components/home/FeaturedArticles.astro`):
   - White background
   - H3: "Featured Articles"
   - 3-column grid of article cards
   - 3 articles: "Manipulate HubSpot Forms with JavaScript—the Right Way", "Simple HubDB Pagination", "Partners VS Pirates: Navigating an Ocean of Digital Agencies"
8. **CTA section** (`src/components/home/CTA.astro`):
   - Dark ink background
   - H3: "Ready to get started?"
   - Lead text: "Let's get creative and start making something amazing together!"
   - "Schedule a Meeting" button

**Phase 3 checklist:**
- [ ] Homepage renders all 7 sections in the correct order
- [ ] Hero has no image — typography only
- [ ] Recent Work carousel advances on Prev/Next click
- [ ] Recent Work section bg is `#0d1726`
- [ ] How We Work section bg is `#0d1726` with oversized H2
- [ ] Testimonials section bg is `#f4f4f4`
- [ ] Services section has 5 categories with correct service links
- [ ] All 3 featured articles are present with correct titles
- [ ] CTA section has "Schedule a Meeting" button
- [ ] All headings use Poppins; all body uses Newsreader
- [ ] No rounded corners anywhere on the page

---

### Phase 4 — Content Collections & Inner Pages (estimated: 45 minutes)

**Goal:** Set up Content Layer collections and build the 6 inner pages (Services, Work, Platforms, Resources, About, Contact).

**Tasks:**
1. Create `src/content.config.ts` with collections:
   - `caseStudies` — for individual work case study pages
   - `services` — for service category pages
   - `testimonials` — for testimonial data
   - `articles` — for resource/blog article pages
2. Create Markdown/MDX content files:
   - `src/content/case-studies/spring-water-spirits.md` (and 5 more)
   - `src/content/services/branding-design.md` (and 4 more)
   - `src/content/articles/manipulate-hubspot-forms.md` (and 2 more)
   - `src/content/testimonials/*.yaml` (3-5 testimonials)
3. Build inner pages:
   - `src/pages/services/index.astro` — Services overview with 5 categories
   - `src/pages/work/index.astro` — Work case studies grid
   - `src/pages/work/[slug].astro` — Individual case study (dynamic route via `getStaticPaths`)
   - `src/pages/platforms/index.astro` — Platforms overview (HubSpot, Shopify, WordPress)
   - `src/pages/resources/index.astro` — Articles list
   - `src/pages/about.astro` — About page
   - `src/pages/contact.astro` — Contact page with form
4. Create reusable components for inner pages:
   - `src/components/PageHeader.astro` — inner page hero with H1 + breadcrumb
   - `src/components/CaseStudyCard.astro` — card for work grid
   - `src/components/ArticleCard.astro` — card for articles list
5. Verify all internal links work and pages build without errors.

**Phase 4 checklist:**
- [ ] `src/content.config.ts` defines 4 collections with Zod schemas (importing `z` from `astro/zod`)
- [ ] All content files have valid frontmatter
- [ ] `src/pages/services/index.astro` renders
- [ ] `src/pages/work/index.astro` renders with case study cards
- [ ] `src/pages/work/[slug].astro` renders for each case study
- [ ] `src/pages/platforms/index.astro` renders
- [ ] `src/pages/resources/index.astro` renders with articles
- [ ] `src/pages/about.astro` renders
- [ ] `src/pages/contact.astro` renders with a form
- [ ] All nav links resolve to existing pages
- [ ] `npm run build` succeeds with no errors

---

### Phase 5 — Animations, Polish & Accessibility (estimated: 30 minutes)

**Goal:** Add scroll-triggered reveal animations, hover states, focus management, and reduced-motion support. Pass `astro check` with no errors.

**Tasks:**
1. Create `src/scripts/reveal.ts` — IntersectionObserver-based scroll reveal. Add `data-reveal` attribute to sections; on intersection, add `.is-visible` class. Respects `prefers-reduced-motion`.
2. Create `src/components/ScrollReveal.astro` — wrapper that applies `data-reveal` and includes the script inline.
3. Add hover states to all interactive elements (links → kelp green, buttons → invert colors).
4. Add focus-visible styles (`outline: 2px solid var(--color-kelp); outline-offset: 2px;`).
5. Add skip-to-content link at the top of `BaseLayout.astro`.
6. Verify semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h4>` hierarchy.
7. Add `prefers-reduced-motion` CSS to disable all animations.
8. Add Open Graph meta tags and `<title>` per page.
9. Run `npx astro check` — fix all type errors.
10. Run `npm run build` and verify `dist/` is generated.
11. Run Lighthouse audit (manual in browser) — target ≥ 90 for Performance, Accessibility, Best Practices, SEO.

**Phase 5 checklist:**
- [ ] Scroll reveal works on sections (fade-in + slide-up)
- [ ] `prefers-reduced-motion: reduce` disables animations
- [ ] All interactive elements have visible focus states
- [ ] Skip-to-content link is present and functional
- [ ] HTML is semantic (verify with Lighthouse)
- [ ] `npx astro check` exits 0
- [ ] `npm run build` exits 0
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 90

---

### Phase 6 — Documentation, Preview & Archive (estimated: 20 minutes)

**Goal:** Write project README, deploy a live preview, and create the tar archive for the user's GitHub repo.

**Tasks:**
1. Write `README.md` for the kelp-clone project — install/dev/build/deploy instructions, design decisions, skill references.
2. Copy `kelp-design-template.md` and `IMPLEMENTATION_PLAN.md` into the project's `docs/` directory.
3. Run `npm run build` to produce final `dist/`.
4. Deploy preview (via the system's preview mechanism) — verify the site loads.
5. Call the `Complete` tool with project summary.
6. Create tar archive: `tar -czf /home/z/my-project/download/kelp-clone.tar.gz` containing:
   - The complete `kelp-clone/` project (excluding `node_modules/`, `dist/`, `.git/`)
   - `docs/kelp-design-template.md`
   - `docs/IMPLEMENTATION_PLAN.md`
   - `docs/README.md`
7. Verify the tar archive is well-formed and contains all expected files.

**Phase 6 checklist:**
- [ ] `README.md` exists with install/dev/build instructions
- [ ] `docs/` directory contains design template + implementation plan + README
- [ ] `npm run build` produces final `dist/`
- [ ] Live preview URL is accessible
- [ ] `Complete` tool called
- [ ] `kelp-clone.tar.gz` exists in `/home/z/my-project/download/`
- [ ] Tar archive contains the project + docs (verify with `tar -tzf`)
- [ ] Tar archive excludes `node_modules/`, `dist/`, `.git/`

---

## 4. File Inventory

### Project structure to create

```
/home/z/my-project/kelp-clone/
├── README.md                                    # Project documentation
├── docs/
│   ├── kelp-design-template.md                  # Design source of truth
│   ├── IMPLEMENTATION_PLAN.md                   # This file
│   └── astro-5-SKILL.md                         # Reference skill (Astro 7 patterns)
├── astro.config.mjs                             # Astro + Tailwind 4 + Fonts config
├── tsconfig.json                                # TypeScript config (Astro strict)
├── package.json                                 # Dependencies
├── .gitignore                                   # node_modules, dist, .astro
├── public/
│   ├── favicon.svg                              # Kelp favicon (simple "K" wordmark)
│   └── images/                                  # Static images (if any)
├── src/
│   ├── env.d.ts                                 # Ambient types
│   ├── content.config.ts                        # Content Layer collections
│   ├── styles/
│   │   └── global.css                           # Tailwind 4 + @theme tokens
│   ├── layouts/
│   │   └── BaseLayout.astro                     # HTML shell + ClientRouter + slots
│   ├── components/
│   │   ├── Header.astro                         # Sticky nav + mobile menu trigger
│   │   ├── Footer.astro                         # 5-column footer
│   │   ├── Button.astro                         # Reusable button (primary/secondary)
│   │   ├── Section.astro                        # Section wrapper (bg/padding variants)
│   │   ├── PageHeader.astro                     # Inner page hero
│   │   ├── CaseStudyCard.astro                  # Work card
│   │   ├── ArticleCard.astro                    # Article card
│   │   ├── ScrollReveal.astro                   # IntersectionObserver wrapper
│   │   ├── MobileMenu.astro                     # Client island (client:load)
│   │   └── home/
│   │       ├── Hero.astro                       # Hero section
│   │       ├── RecentWork.astro                 # Recent Work section wrapper
│   │       ├── WorkCarousel.astro               # Client island (client:visible)
│   │       ├── Services.astro                   # Services 5-column grid
│   │       ├── HowWeWork.astro                  # Process 5-step
│   │       ├── Testimonials.astro               # Testimonial quote
│   │       ├── FeaturedArticles.astro           # 3 article cards
│   │       └── CTA.astro                        # "Ready to get started?"
│   ├── content/
│   │   ├── case-studies/
│   │   │   ├── spring-water-spirits.md
│   │   │   ├── deals-in-dirt.md
│   │   │   ├── harts-meat-market.md
│   │   │   ├── elev8-fun.md
│   │   │   ├── mountaineer-coffee.md
│   │   │   └── unprofitable.md
│   │   ├── services/
│   │   │   ├── branding-design.md
│   │   │   ├── websites.md
│   │   │   ├── marketing-strategy.md
│   │   │   ├── media.md
│   │   │   └── ongoing-support.md
│   │   ├── articles/
│   │   │   ├── manipulate-hubspot-forms.md
│   │   │   ├── simple-hubdb-pagination.md
│   │   │   └── partners-vs-pirates.md
│   │   └── testimonials/
│   │       ├── client-1.yaml
│   │       ├── client-2.yaml
│   │       └── client-3.yaml
│   ├── pages/
│   │   ├── index.astro                          # Homepage
│   │   ├── services/
│   │   │   └── index.astro                      # Services overview
│   │   ├── work/
│   │   │   ├── index.astro                      # Work case studies grid
│   │   │   └── [slug].astro                     # Individual case study
│   │   ├── platforms/
│   │   │   └── index.astro                      # Platforms overview
│   │   ├── resources/
│   │   │   ├── index.astro                      # Articles list
│   │   │   └── [slug].astro                     # Individual article
│   │   ├── about.astro                          # About page
│   │   ├── contact.astro                        # Contact page with form
│   │   └── 404.astro                            # Custom 404
│   └── scripts/
│       └── reveal.ts                            # Scroll reveal IntersectionObserver
└── dist/                                        # Build output (gitignored)
```

### File count summary

| Category | Count |
|----------|-------|
| Config files (root) | 5 (astro.config.mjs, tsconfig.json, package.json, .gitignore, README.md) |
| Documentation | 3 (docs/) |
| Public assets | 1+ (favicon.svg, images/) |
| Source components | 18 (Header, Footer, Button, Section, PageHeader, CaseStudyCard, ArticleCard, ScrollReveal, MobileMenu, 9 home/* components) |
| Content collections | 12 (6 case studies, 5 services, 3 articles, 3 testimonials) |
| Pages | 9 (index, services, work/index, work/[slug], platforms, resources/index, resources/[slug], about, contact, 404) |
| Layouts | 1 (BaseLayout) |
| Styles | 1 (global.css) |
| Scripts | 1 (reveal.ts) |
| Content config | 1 (content.config.ts) |
| Type declarations | 1 (env.d.ts) |
| **Total files to create** | **~52** |

---

## 5. Skill Usage Matrix

| Skill | Where it's used | How |
|-------|-----------------|-----|
| `astro-7` | Project setup, content collections, View Transitions, Fonts API, `astro:assets` | Direct application of patterns from `astro-7-SKILL.md` |
| `avant-garde-design-v4` | Animation standards, mobile nav, accessibility, anti-generic checks | References `14-animation-standards.md`, `07-mobile-navigation.md`, `04-accessibility-checklist.md`, `12-anti-generic-checklist.md` |
| `tailwind-patterns` | Tailwind 4 `@theme` config, container queries, design tokens | CSS-first configuration in `global.css` |
| `frontend-design` | Component composition, layout, color, typography | Design thinking applied to component structure |
| `code-quality-standards` | Final review — Six-Axis check (Correctness, Readability, Architecture, Security, Performance, Aesthetic) | Phase 5 verification |

---

## 6. Risk Assessment & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Astro 7 not yet released / `npm create astro@latest` installs Astro 5 | Low | High | Pin to `astro@^7.0.0` in package.json. If install fails, fall back to Astro 6.x and adjust migration notes. |
| Tailwind 4 `@theme` syntax unfamiliar | Medium | Medium | Reference `tailwind-patterns` skill and the `avant-garde-design-v4/references/02-tailwind-v4-deep-dive.md` doc. |
| Google Fonts API rate-limits during dev | Low | Low | Astro Fonts API downloads once at build; cached afterward. |
| Carousel JS complexity | Medium | Medium | Build minimal vanilla JS — if > 80 lines, switch to `embla-carousel` (lightweight). |
| View Transitions break on navigation | Low | Medium | Test in Chrome (full support); Safari 16.4+ (full support); Firefox (partial — falls back to no transition, no breakage). |
| Lighthouse Performance < 90 | Low | Medium | Astro's zero-JS-by-default + Fonts API subsetting + `astro:assets` optimization should easily hit 95+. |
| Content collection schema validation fails | Medium | Low | Zod 4 import from `astro/zod` (not `astro:content`). Validate with `npx astro sync` before build. |
| Mobile menu accessibility (keyboard trap) | Medium | High | Use `focus-trap` pattern: trap focus inside menu while open, restore on close. Esc key closes. |

---

## 7. Definition of Done

The clone is complete when ALL of these are true:

1. ✅ `npm run build` exits 0 and produces `dist/index.html` + hashed assets.
2. ✅ `npx astro check` exits 0 (no type errors).
3. ✅ Homepage visually matches `kelp.agency` per the verification checklist in `kelp-design-template.md` §13.
4. ✅ All 9 pages render without 404s.
5. ✅ Carousel advances on Prev/Next click.
6. ✅ Mobile menu opens/closes on hamburger tap.
7. ✅ Header sticks with headroom behavior (hides on scroll down).
8. ✅ Scroll-reveal animations work and respect `prefers-reduced-motion`.
9. ✅ All buttons have `border-radius: 0`.
10. ✅ All headings use Poppins; all body uses Newsreader.
11. ✅ No images on homepage hero.
12. ✅ Kelp green `#42c634` appears only on hover states and accents.
13. ✅ Lighthouse Performance ≥ 90, Accessibility ≥ 90.
14. ✅ Live preview URL loads without errors.
15. ✅ `Complete` tool called with project summary.
16. ✅ `kelp-clone.tar.gz` archive created with project + docs, excluding `node_modules/` and `dist/`.

---

## 8. Post-Build Verification Steps

After the build is complete, run these verification steps:

```bash
# 1. Type check
cd /home/z/my-project/kelp-clone
npx astro check

# 2. Production build
npm run build

# 3. Preview the build
npm run preview  # serves at http://localhost:4321

# 4. Visual verification (manual)
# Open http://localhost:4321 in a browser and verify against:
# - /home/z/my-project/scripts/kelp-home-full.png (reference screenshot)
# - kelp-design-template.md §13 verification checklist

# 5. Lighthouse audit (manual in Chrome DevTools)
# Target: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

# 6. Create the tar archive
cd /home/z/my-project
tar -czf download/kelp-clone.tar.gz \
  --exclude='kelp-clone/node_modules' \
  --exclude='kelp-clone/dist' \
  --exclude='kelp-clone/.git' \
  --exclude='kelp-clone/.astro' \
  kelp-clone/

# 7. Verify the archive
tar -tzf download/kelp-clone.tar.gz | head -20
```

---

## 9. Open Decisions (Pre-Build)

These are decisions that could go either way — documenting the defaults chosen:

1. **Astro version:** Targeting Astro 7.x. If `npm create astro@latest` installs Astro 5 or 6, fall back to that version and adjust the migration notes in the README. The skill covers 5/6/7 together, so the code patterns are identical.

2. **Carousel implementation:** Building vanilla JS first. If the implementation exceeds ~80 lines or proves buggy, switch to `embla-carousel-react` (5KB gzipped) as a React island.

3. **Image strategy:** Kelp.agency has almost no images on the homepage. The clone will use placeholder images from `https://placehold.co/` for case study thumbnails on the `/work/` page. No images on the homepage hero (matching the original).

4. **Contact form:** Static site, so the form will be a progressive-enhancement HTML form that posts to a placeholder endpoint. Document in README that the user should wire it to Formspree, Netlify Forms, or an Astro Action when deploying.

5. **Live preview deployment:** Using the system's preview mechanism (likely a static file server). If that's unavailable, the `npm run preview` command serves the build locally — the README will document how to deploy to Netlify/Vercel/Cloudflare Pages.

6. **Tar archive scope:** Excluding `node_modules/`, `dist/`, `.astro/`, `.git/`. Including `docs/`, all source files, `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `README.md`. The user can `npm install && npm run build` after extracting.

---

*End of implementation plan. Proceeding to Phase 1 (project initialization).*
