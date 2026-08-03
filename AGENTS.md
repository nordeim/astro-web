# AGENTS.md

Static marketing clone of kelp.agency built with **Astro 7.1** (`output: 'static'`) + **Tailwind CSS 4** via `@tailwindcss/vite` + **@astrojs/sitemap**. Read `README.md` for the full product overview; this file captures the facts an agent working in the repo would otherwise get wrong.

## Commands

- `npm install` — install (lockfile is `package-lock.json`; **use npm, not pnpm/yarn**, to respect the lockfile and because there is no monorepo).
- `npm run dev` — dev server at `http://localhost:4321`.
- `npm run build` — static build to `dist/` (also emits `dist/sitemap-index.xml` + `dist/sitemap-0.xml`).
- `npm run preview` — serve the built `dist/`.
- `npm run check` — `astro check` (TypeScript + `.astro` diagnostics). Run after any edit.
- `npm run check:links` — static internal-link checker. Walks `dist/**/*.html` and verifies every internal `href`/`src` resolves to a file. Run AFTER `npm run build`. Exits non-zero on broken links.
- `npm run check:content` — content frontmatter validator. Reads `src/content/**/*.{md,yaml}` and asserts schema-critical fields are present, non-empty, and correctly typed. Run any time. Exits non-zero on invalid frontmatter.

Requires Node.js 22.12.0+ (Astro 7 constraint).

## Architecture & gotchas

- **Tailwind 4 is wired through Vite, not PostCSS.** `tailwindcss()` plugin lives in `astro.config.mjs`; there is no `tailwind.config.js`. All tokens are CSS-first in `src/styles/global.css` under `@theme`. Do not create a JS Tailwind config.
- **Fonts are self-hosted by Astro's Fonts API**, not via `@import`/CDN. Poppins + Newsreader are declared in `astro.config.mjs` with `cssVariable: '--font-poppins'` / `'--font-newsreader'`. The `@theme` font vars in `global.css` are mirrored for Tailwind utility generation; the actual font files are injected by Astro at build.
- **Content Layer API (Astro 5+ pattern, not legacy collections).** Four collections defined in `src/content.config.ts` using `glob()` loader + `z` from `astro/zod` (not standalone Zod). Adding a `.md` file to the matching `src/content/<collection>/` dir auto-publishes it — no registration step. `testimonials` are `.yaml`, the rest are `.md`. **All homepage sections now consume collections via `getCollection()`** — do not re-introduce hardcoded data arrays in `RecentWork.astro`, `Services.astro`, `Testimonials.astro`, or `FeaturedArticles.astro`. The `services/index.astro` page also uses the collection.
- **Design system is intentional and load-bearing** — see `docs/kelp-design-template.md`. Do not "normalize": zero border-radius everywhere, serif (Newsreader) text inside buttons, alternating white→ink→mist section backgrounds, type-as-image hero. Styling deviations from tokens break the look more than they would in a normal project.
- **Zero JS by default — but three components now ship JS:** `RecentWork.astro` (carousel), `Header.astro` (mobile menu + dropdown menus), plus the scroll-reveal script in `BaseLayout.astro`. Astro View Transitions (`ClientRouter` in `BaseLayout.astro`) mean any client-side init **must re-run on `astro:after-swap`** or it breaks on subsequent navigations. All existing scripts follow this pattern — copy it.
- **Dynamic routes** use `getStaticPaths()` — `src/pages/work/[slug].astro` and `src/pages/resources/[slug].astro` are the only dynamic routes. `/work/clients/` is a static page, not dynamic.
- **`src/scripts/` exists but is empty.** Project-level scripts (link-checker, content validator) live in `scripts/` at the repo root, NOT in `src/scripts/`. Client JS is inlined in components, not imported from `src/scripts/`.
- **`astro.config.mjs` `site` is `https://astro.jesspete.shop`.** This is the deployed production URL. Canonical URLs, OG tags, and the sitemap all derive from it. Do not change it back to the placeholder.
- **Header height is `--header-height: 72px`** (defined in `global.css`). The mobile menu overlay uses `top: var(--header-height)`. If you change header padding, logo size, or anything else affecting header height, update the variable.
- **Services display order is defined in code, not in markdown.** `Services.astro` and `services/index.astro` both have a `desiredOrder` array of slugs (`branding-design`, `websites`, `marketing-strategy`, `media`, `ongoing-support`). To reorder, edit the array — do not rename content files.

## Layout order (apply before coding)

`Header.astro` → page body wrapped in `Section.astro` / `PageHeader.astro` → `Footer.astro`, all inside `BaseLayout.astro`. Homepage composes sections from `src/components/home/`.

## Repo-relative paths to know

- `src/styles/global.css` — design tokens + `.prose-kelp` (rendered Markdown styles) + dropdown menu styles + `--header-height` variable (edit here, not in components).
- `src/content.config.ts` — content schemas (single source for frontmatter shapes).
- `docs/kelp-design-template.md` — source-of-truth design spec; `docs/astro-7-patterns.md` is the long Astro 7 reference used during the build.
- `docs/audit/AUDIT_FINDINGS.md` + `docs/audit/REMEDIATION_PLAN.md` — the 2026-08-04 code audit and fix log. Read before making non-trivial changes.
- `scripts/link-check.mjs` + `scripts/validate-content.mjs` — the project regression tests. Run them after any structural change.
- `public/robots.txt` — crawler directives; references the sitemap.
- `.astro/` and `dist/` are generated (gitignored); `.astro/types.d.ts` is referenced by `tsconfig.json` and regenerated by `astro check`/`dev`/`build`.

## Contact form

`/contact/` is a stub HTML form with no backend. Do not assume it submits anywhere — wiring (Formspree / Netlify Forms / Astro Actions) is unconfigured.

## `skills/` directory

`skills` is a symlink to `~/.pi/agent/skills` and is gitignored. Treat it as not part of this repo; do not edit or commit it.
