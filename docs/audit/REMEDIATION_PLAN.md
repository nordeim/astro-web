# Remediation Plan — Astro-Web Clone

> **Paired with:** `docs/audit/AUDIT_FINDINGS.md`
> **Date:** 2026-08-04
> **Approach:** Conservative remediation — fix the verified defects, do not refactor for its own sake, preserve the intentional design system documented in `docs/kelp-design-template.md`.
> **Verification gate:** `npm run check` (TypeScript + Astro diagnostics) is the only configured verification step (per `AGENTS.md`). This plan adds a link-checker script as a regression test for the broken-link defects (C1, C2, C3, C4, H1).

---

## Plan vs. Codebase Alignment (Pre-execution validation)

Each fix below was re-validated against the actual source files before inclusion:

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| C1 add 3 case studies + fix Hero slugs | `src/content/case-studies/` (6 files), `src/components/home/Hero.astro` (3 client links), original kelp.agency `/work/` page (9 case studies, slugs verified) | ✅ |
| C2 add `/work/clients/` page | `src/pages/work/` (only `index.astro` + `[slug].astro`), `src/components/Footer.astro` line 38 references `/work/clients/` | ✅ |
| C3 fix placeholder `#` links | `src/components/Footer.astro` lines 52–55, `src/pages/contact.astro` line 155 | ✅ |
| C4 fix `partners-vs-pirates.md` frontmatter | `src/content/articles/partners-vs-pirates.md`, `src/components/home/FeaturedArticles.astro` lines 21–24 (correct values) | ✅ |
| H1 fix `site` URL | `astro.config.mjs` line 8 | ✅ |
| H2 add `robots.txt` | `public/` (only `favicon.svg` present) | ✅ |
| H3 add `@astrojs/sitemap` | `package.json` (not in deps), `astro.config.mjs` (no integration) | ✅ |
| H4 fix `theme-color` | `src/layouts/BaseLayout.astro` line 38 | ✅ |
| H5 use testimonials collection | `src/content/testimonials/*.yaml` (3 files), `src/components/home/Testimonials.astro` (hardcodes 1) | ✅ |
| H6 use services collection (or remove dead collection) | `src/content/services/*.md` (5 files, all `offerings: []`), `src/components/home/Services.astro`, `src/pages/services/index.astro` | ✅ Decision: **populate the services collection with real offerings** and use `getCollection()` in both consumers. This preserves the content-first architecture documented in `AGENTS.md`. |
| H7 use articles collection in FeaturedArticles | `src/content/articles/*.md` (3 files), `src/components/home/FeaturedArticles.astro` (hardcodes 3) | ✅ |
| H8 use caseStudies collection in RecentWork | `src/content/case-studies/*.md` (6 files), `src/components/home/RecentWork.astro` (hardcodes 6) | ✅ |
| M1 carousel a11y | `src/components/home/RecentWork.astro` lines 55–83, `src/styles/global.css` | ✅ |
| M2 add dropdown menus | `src/components/Header.astro` lines 22–41 (plain links), original kelp.agency nav HTML (verified `<ul>` submenus) | ✅ |
| M3 add Headless platform | `src/pages/platforms/index.astro` (3 platforms), `src/components/Footer.astro` (3 links) | ✅ |
| M4 remove `prose prose-lg` OR install typography plugin | `package.json`, `src/pages/work/[slug].astro`, `src/pages/resources/[slug].astro` | ✅ Decision: **remove the classes** — the inline `style` already handles typography, and adding a plugin for one feature is over-engineering. |
| M5 404 padding | `src/pages/404.astro` line 7 | ✅ |
| M6 mobile menu offset | `src/components/Header.astro` line 62 | ✅ Decision: **extract header height to a CSS variable** so the menu offset is coupled to the actual header height. |
| L1 OG image | `src/layouts/BaseLayout.astro` line 34 | ✅ Decision: **add a default OG image path** (`/og-default.png` in `public/`) and pass it as the default in BaseLayout. Will not create the actual image (content work) but the meta tag will be present. |
| L2 README status | `README.md` line 15 | ✅ |
| L4 prefetch scope | `astro.config.mjs` lines 9–12 | ✅ Decision: **leave as-is** — `prefetchAll: true` is intentional for a 17-page site; the bandwidth concern is minor. |
| L5 viewport meta | `src/layouts/BaseLayout.astro` line 22 | ✅ |

---

## TDD Strategy

Per the coding specialist manual Section 10 ("Testing & Validation") and the project's `AGENTS.md` note that `npm run check` is the only verification step, this plan adds:

1. **A link-checker script** (`scripts/link-check.mjs`) that scans the built `dist/` directory for internal links and verifies each one resolves to an existing file. This is the regression test for C1, C2, C3 (partial), H1, H2, H3.
2. **A frontmatter validator** (`scripts/validate-content.mjs`) that loads each content collection entry and asserts the schema-critical fields are non-empty and correctly typed. This is the regression test for C4 and the H5/H6/H7 collection fixes.

Both scripts are runnable via `npm run check:links` and `npm run check:content` (added to `package.json` scripts). They run BEFORE any code changes (red), then AFTER each fix (green) to confirm the fix worked.

For type-level and component-level changes (M1, M2, M6), `npm run check` (the existing `astro check`) is the regression gate.

---

## ToDo List (Execution Order)

Each ToDo is atomic (one logical change, one commit). Commits are conventional-commit formatted and target `main` only.

### Phase 0 — Add regression test harness (RED)

- [ ] **T0.1** — Create `scripts/link-check.mjs` (Node ESM script that walks `dist/**/*.html`, extracts `href`/`src` attributes, classifies each as internal/external, and verifies internal links resolve to a file). Output: list of broken links with source file + line.
- [ ] **T0.2** — Create `scripts/validate-content.mjs` (Node ESM script that imports `src/content.config.ts` schemas via dynamic `import()` and asserts each collection entry has non-empty required fields). Output: list of validation failures.
- [ ] **T0.3** — Add `npm run check:links` and `npm run check:content` scripts to `package.json`. Do NOT add new dependencies.
- [ ] **T0.4** — Run both scripts against the current build. **Expect failures** (this is the RED state). Record the failure list to compare against after fixes.

### Phase 1 — Critical fixes (C1–C4)

- [ ] **T1.1** — **C4 fix:** Correct `src/content/articles/partners-vs-pirates.md` frontmatter: `title: "Partners VS Pirates: Navigating an Ocean of Digital Agencies"`, `category: "Agency Life"`, `excerpt: "How to tell a true agency partner from a pirate in sheep's clothing."`.
- [ ] **T1.2** — **C1 fix (part A):** Create 3 missing case study markdown files matching the existing pattern in `src/content/case-studies/`:
  - `marker-48-brewing.md` — title "Marker 48 Brewing", category "Branding & Web Design", slug-derived URL `/work/marker-48-brewing/`. Wait — the Hero link is `/work/marker-48/`, not `/work/marker-48-brewing/`. The original uses slug `marker-48`. So the file must be `marker-48.md` (slug = filename without extension). Verify by checking `getStaticPaths` in `src/pages/work/[slug].astro` — it uses `cs.id` (the filename without extension) as the slug. So filename = slug.
  - **Correction:** Create files `marker-48.md`, `croom-brewery.md`, `beverlin-hills-quality-goods.md`.
- [ ] **T1.3** — **C1 fix (part B):** Update `src/components/home/Hero.astro` to fix the Beverlin Hills link: change `/work/beverlin-hills/` to `/work/beverlin-hills-quality-goods/`. The other two slugs (`/work/elev8-fun/`, `/work/marker-48/`) are already correct.
- [ ] **T1.4** — **C2 fix:** Create `src/pages/work/clients.astro` — a simple page listing all case study clients (uses `getCollection('caseStudies')`), with PageHeader + Section + a grid of client name cards linking to their case study. Title: "Kelp Client List".
- [ ] **T1.5** — **C3 fix:** Replace 5 placeholder `#` links:
  - `src/components/Footer.astro` lines 52–55 (Instagram, LinkedIn, Facebook, YouTube): point to platform homepages (`https://instagram.com/`, `https://linkedin.com/`, `https://facebook.com/`, `https://youtube.com/`) as safe defaults. Add `rel="noopener noreferrer"` and `target="_blank"`.
  - `src/pages/contact.astro` line 155 ("Schedule a 30-minute discovery call"): point to `/contact/` (the same page, but anchored at the form) or simply remove the link text. Better: change href to `#project-brief` (the form's anchor) for in-page navigation. Add `id="project-brief"` to the form's containing `<div>`.
- [ ] **T1.6** — Run `npm run check:links` and `npm run check:content`. **Expect GREEN** for C1, C2, C3, C4.

### Phase 2 — High config fixes (H1–H4)

- [ ] **T2.1** — **H1 fix:** Change `astro.config.mjs` line 8: `site: 'https://astro.jesspete.shop'`.
- [ ] **T2.2** — **H2 fix:** Create `public/robots.txt` with:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://astro.jesspete.shop/sitemap-index.xml
  ```
- [ ] **T2.3** — **H3 fix:** Install `@astrojs/sitemap` via `npm install @astrojs/sitemap` (this updates `package.json` + `package-lock.json` automatically — no hand-editing per Section 6 of the coding manual). Add `sitemap()` to the `integrations` array in `astro.config.mjs`. Verify build produces `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
- [ ] **T2.4** — **H4 fix:** Change `src/layouts/BaseLayout.astro` line 38: `<meta name="theme-color" content="#ffffff" />` (matches default page bg). Add a second `theme-color` meta with `media="(prefers-color-scheme: dark)"` set to `#0d1726` for forward-compat.
- [ ] **T2.5** — Run `npm run build`, then `npm run check:links`. Confirm canonical URLs now point to `https://astro.jesspete.shop/...` and robots.txt + sitemap are present.

### Phase 3 — High architecture fixes (H5–H8) — single source of truth

- [ ] **T3.1** — **H5 fix:** Refactor `src/components/home/Testimonials.astro` to use `getCollection('testimonials')`. Render all entries (currently 3). Sort by stable order (filename or a new `order` field — use filename asc for now).
- [ ] **T3.2** — **H6 fix (part A):** Populate the `offerings` arrays in all 5 `src/content/services/*.md` files with the actual service lists (currently hardcoded in `Services.astro` and `services/index.astro`):
  - `branding-design.md`: `['Apparel Design', 'Company Branding', 'Digital Design', 'Print Design', 'Web Design']`
  - `websites.md`: `['App Development', 'Web Design', 'Web Development', 'Ecommerce']`
  - `marketing-strategy.md`: `['Audience Targeting', 'Campaign Management', 'Copywriting', 'Digital Marketing', 'Social Campaigns & PPC', 'Social Media Content', 'Reporting']`
  - `media.md`: `['Motion Graphics', 'Photography', 'Videography']`
  - `ongoing-support.md`: `['Ongoing Retainers', 'Web Hosting', 'Web Support & Maintenance']`
- [ ] **T3.3** — **H6 fix (part B):** Add `anchor` field to the services schema in `src/content.config.ts` (e.g. `anchor: z.string().default(...)`) — or derive it from the slug. Then refactor `src/components/home/Services.astro` and `src/pages/services/index.astro` to use `getCollection('services')` and read `title`, `description`, `offerings`, `anchor` from the collection.
- [ ] **T3.4** — **H7 fix:** Refactor `src/components/home/FeaturedArticles.astro` to use `getCollection('articles')`, sort by `publishDate` desc, take the first 3.
- [ ] **T3.5** — **H8 fix:** Refactor `src/components/home/RecentWork.astro` to use `getCollection('caseStudies')`, sort by `publishDate` desc. Keep the same carousel structure (6 slides).
- [ ] **T3.6** — Run `npm run check` (TypeScript must pass). Run `npm run build`. Run `npm run check:links`. **Expect GREEN**.

### Phase 4 — Medium fixes (M1–M6)

- [ ] **T4.1** — **M1 fix:** In `src/components/home/RecentWork.astro`:
  - Add `role="region"` and `aria-label="Recent work carousel"` and `tabindex="0"` to the `.carousel-wrapper` div.
  - Add `role="group"`, `aria-roledescription="slide"`, and `aria-label="Slide N of M: {title}"` to each `.carousel-slide` article.
- [ ] **T4.2** — **M2 fix:** Refactor `src/components/Header.astro` to add dropdown menus for Services, Work, Platforms, Resources:
  - Each top-level nav item with `hasDropdown: true` becomes a `<li>` with nested `<ul>` submenu.
  - Add `aria-expanded="false"` and `aria-controls="submenu-{id}"` to the parent `<a>`/`<button>`.
  - Add a small inline `<script>` (re-bound on `astro:after-swap`) that toggles `aria-expanded` on click, closes on Escape, closes on outside-click, and closes on link-click inside the submenu.
  - On desktop, also open on hover/focus (CSS or JS — prefer CSS `:hover` + `:focus-within` to avoid extra JS).
  - Submenu links:
    - **Services:** Branding & Design (`/services/#branding-design`), Websites (`/services/#websites`), Marketing & Strategy (`/services/#marketing-strategy`), Video & Photo (`/services/#media`), Ongoing Support (`/services/#ongoing-support`).
    - **Work:** Case Studies (`/work/`), Clients (`/work/clients/`).
    - **Platforms:** HubSpot (`/platforms/#hubspot`), Shopify (`/platforms/#shopify`), WordPress (`/platforms/#wordpress`), Headless (`/platforms/#headless`).
    - **Resources:** Articles (`/resources/`).
- [ ] **T4.3** — **M3 fix:** Add a 4th platform "Headless" to `src/pages/platforms/index.astro` with `anchor: 'headless'`. Add a corresponding entry to the Footer Platforms column (`src/components/Footer.astro` line 47).
- [ ] **T4.4** — **M4 fix:** Remove `prose prose-lg` classes from `src/pages/work/[slug].astro` line 39 and `src/pages/resources/[slug].astro` line 39. The inline `style` already handles body typography. Add minimal Markdown element styles to `src/styles/global.css` (a small `.prose-kelp` class or just style `.max-w-3xl` children: `h2`, `h3`, `p`, `ul`, `blockquote`).
- [ ] **T4.5** — **M5 fix:** Change `src/pages/404.astro` line 7 from `padding="xl"` to `padding="lg"` (128px top, more balanced).
- [ ] **T4.6** — **M6 fix:** Extract header height to a CSS variable. In `src/styles/global.css`:
  - Add `--header-height: 72px;` (compute from `24px top padding + 24px logo line + 24px bottom padding`).
  - Add `--header-height` to `.site-header { height: var(--header-height); }` (replacing the implicit height from padding).
  - Adjust `.site-header` to use `padding: 0;` and `display: flex; align-items: center;` to make the height deterministic.
  - Update `src/components/Header.astro` line 62 mobile menu `top-[72px]` to `top-[var(--header-height)]` (or `style="top: var(--header-height);"`).
- [ ] **T4.7** — Run `npm run check`, `npm run build`, `npm run check:links`. **Expect GREEN**.

### Phase 5 — Low fixes (L1, L2, L5)

- [ ] **T5.1** — **L1 fix:** In `src/layouts/BaseLayout.astro`, default `ogImage` to `/og-default.png` so the OG image meta always renders. Do NOT create the actual image (content work — note in README that the maintainer should add `public/og-default.png` sized 1200×630).
- [ ] **T5.2** — **L5 fix:** Update viewport meta in `src/layouts/BaseLayout.astro` line 22: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`.
- [ ] **T5.3** — **L2 fix:** Update `README.md`:
  - Change line 15 "Status: ✅ Complete — 17 pages built..." to reflect actual post-remediation state (20 pages including new clients page, 9 case studies, 4 platforms, sitemap, robots.txt).
  - Update the Changelog section with a 2026-08-04 entry summarizing the remediation.
  - Update the File Hierarchy to reflect new files.

### Phase 6 — Documentation updates

- [ ] **T6.1** — Update `AGENTS.md`:
  - Mention the new `npm run check:links` and `npm run check:content` commands in the Commands section.
  - Mention the dropdown menu JS in the "Zero JS by default" gotcha (Header now ships a small dropdown script).
  - Update the "Repo-relative paths" section to mention `scripts/link-check.mjs` and `scripts/validate-content.mjs`.
- [ ] **T6.2** — Update `CLAUDE.md`:
  - Add the new commands to the Build Commands table.
  - Add a note in the Architecture section that all homepage sections now consume content collections (single source of truth).
  - Update the Header description to mention dropdown menus.
- [ ] **T6.3** — Update `docs/kelp-design-template.md`:
  - Add a note in the Header section about the dropdown menus (now implemented in the clone).
  - Update the Verification Checklist with the new items.

### Phase 7 — Final verification

- [ ] **T7.1** — Run full verification suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`. All must pass.
- [ ] **T7.2** — Re-run `agent-browser` E2E against the deployed site (or local `npm run preview` if deployed site hasn't been updated yet — but the user can deploy after the push). Verify:
  - `/work/marker-48/` returns 200
  - `/work/beverlin-hills-quality-goods/` returns 200
  - `/work/croom-brewery/` returns 200
  - `/work/clients/` returns 200
  - Social links no longer have `href="#"`
  - Canonical URL on homepage is `https://astro.jesspete.shop/`
  - `robots.txt` is non-empty
  - `sitemap-index.xml` returns 200
  - Header dropdown menus open and close (click + Escape)
  - Carousel responds to arrow keys when focused

### Phase 8 — Commit and push

- [ ] **T8.1** — Stage all changes: `git add -A`.
- [ ] **T8.2** — Verify `.gitignore` excludes `node_modules/`, `dist/`, `.astro/`, `skills/` (already does).
- [ ] **T8.3** — Commit in logical atomic units (one per phase or per fix group). Suggested commit messages:
  - `test: add link-checker and content-validator scripts`
  - `fix(content): correct partners-vs-pirates frontmatter (C4)`
  - `feat(content): add 3 missing case studies (marker-48, croom-brewery, beverlin-hills-quality-goods) (C1)`
  - `fix(hero): correct Beverlin Hills link slug (C1)`
  - `feat(pages): add /work/clients/ page (C2)`
  - `fix(footer,contact): replace placeholder # links with real destinations (C3)`
  - `fix(config): set site URL to deployed domain (H1)`
  - `feat(seo): add robots.txt and @astrojs/sitemap (H2, H3)`
  - `fix(layout): correct theme-color to match page bg (H4)`
  - `refactor(home): use testimonials collection in Testimonials.astro (H5)`
  - `refactor(content): populate services offerings + use collection in Services components (H6)`
  - `refactor(home): use articles collection in FeaturedArticles.astro (H7)`
  - `refactor(home): use caseStudies collection in RecentWork.astro (H8)`
  - `fix(a11y): add carousel keyboard nav and slide semantics (M1)`
  - `feat(header): add dropdown menus for Services/Work/Platforms/Resources (M2)`
  - `feat(platforms): add Headless platform section (M3)`
  - `fix(typo): remove unused prose classes from detail pages (M4)`
  - `fix(404): reduce excessive top padding (M5)`
  - `fix(header): extract header height to CSS variable (M6)`
  - `fix(layout): default OG image + viewport-fit=cover (L1, L5)`
  - `docs: update README, AGENTS, CLAUDE, design template`
- [ ] **T8.4** — Configure git remote for SSH (per `skills/how-to-git-push-using-ssh-wrapper/SKILL.md`):
  - `git remote set-url origin git@github.com:nordeim/astro-web.git`
- [ ] **T8.5** — Push using the SSH wrapper:
  - `GIT_SSH_COMMAND="/home/z/my-project/workspace/astro-web/skills/how-to-git-push-using-ssh-wrapper/scripts/ssh_git_wrapper_v3.py -i ~/.ssh/id_github -o StrictHostKeyChecking=accept-new" git push origin main`
- [ ] **T8.6** — Verify push: `git status -sb` should show `## main...origin/main` with no ahead/behind.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Adding dropdown menus introduces JS that must re-bind on `astro:after-swap` | The dropdown script will follow the same pattern as the existing mobile menu script (line 118 of Header.astro): bind on load + re-bind on `astro:after-swap`. |
| Refactoring `Services.astro` to use the collection may break the `/services/#anchor` links if anchors change | The `anchor` field will be added to the schema with the same values currently hardcoded (`branding-design`, `websites`, `marketing-strategy`, `media`, `ongoing-support`). No URL change. |
| Adding `@astrojs/sitemap` adds a dependency | It's the official Astro integration, maintained by the Astro team. Low risk. |
| Adding 3 case study files with placeholder body content is content work, not code work | The case studies will follow the same template as the existing 6 (Challenge / Approach / Solution / Result). Body content will be plausible but generic, matching the existing quality bar. The user can replace with real content later. |
| The `npm run check:links` script may report external links as broken if no network is available | The script will only check INTERNAL links (same-origin or relative). External links (`https://...`) are skipped. |
| The `npm run check:content` script needs to import the Zod schemas from `src/content.config.ts` | The script will use `await import('../src/content.config.ts')` via a dynamic import. Astro's content config uses `astro:content` and `astro/zod` imports which only work in the Astro runtime — so the script will instead replicate the schema checks inline (string non-empty, date valid, array of strings). This is a tradeoff documented in the script header. |

---

## Out-of-Scope (intentionally deferred)

- **Real article body content** — the 3 article markdown files have placeholder bodies. Content work, not code work.
- **Real OG image** — creating a 1200×630 branded image. Content work, not code work. The meta tag will be wired; the maintainer adds the image.
- **Real social media profile URLs** — pointing social links to the actual Kelp agency profiles requires knowing them. Defaults to platform homepages.
- **SVG logo** — the text "Kelp" wordmark is documented as intentional. Leave as-is.
- **`prefers-color-scheme` dark mode** — the original is light-mode only. Leave as-is.
- **`prefetchAll: true` bandwidth concern** — minor; leave as-is for a 17-page site (will be 20 pages after remediation — still small).

---

*End of remediation plan. Proceeding to execution.*
