# Audit Round 5 — Findings

> **Paired with:** `docs/audit/REMEDIATION_PLAN_ROUND5.md` (the fix plan + TDD execution log)
> **Date:** 2026-08-05
> **Auditor:** Mode C code reviewer (astro-7 + astro-7-patterns compliance)
> **Scope:** Static code review of `/home/z/my-project/astro-web` against the Task 2-a skills compliance checklist (14 review dimensions).
> **Method:** Read-only audit. No files modified. Cross-checked every candidate finding against `docs/audit/REMEDIATION_PLAN*.md` (rounds 1–4) to avoid re-flagging fixed items. Live-site E2E validation via `agent-browser` against `https://astro.jesspete.shop/` and `https://www.kelp.agency/`.
> **Build state at audit time:** `npm run check` 0/0/0; `npm run build` 21 pages; `npm run check:links` 1308 checked, 0 broken; `npm run check:content` 20 files, 0 errors.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 2 |
| Low | 2 |
| Informational | 1 |
| **Total** | **7** |

The codebase was in strong shape after 4 prior remediation rounds. 8 of 14 audit dimensions were fully clean. The 7 findings below are the genuinely outstanding items — none were caught by the prior rounds because they require either a real browser navigation (View Transitions re-init bugs) or a comparison against the original site (imagery).

The standout finding is F1: a High-severity View Transitions bug in the mobile menu that made the hamburger button unresponsive after the first navigation. This is precisely the #1 bug class called out in `[astro-7-patterns §3]`. Verified via live reproduction on `https://astro.jesspete.shop/` — after navigating from `/` to `/resources/manipulate-hubspot-forms-javascript/` via View Transition, clicking the hamburger button did nothing.

---

## Findings (ordered by severity)

### F1 — Mobile menu script does NOT re-init on `astro:after-swap` (HIGH)

- **Location:** `src/components/Header.astro` lines 144–193 (the `<script>` block, mobile menu portion)
- **Description:** The mobile menu init queried `[data-mobile-menu-toggle]` and `[data-mobile-menu]` ONCE at script execution (lines 146–147) and captured them in the `toggle` / `menu` closure variables. A click listener was attached to that specific `toggle` element (line 173). The `astro:after-swap` listener (line 192) only called `closeMenu` — it did NOT re-query the new toggle/menu or attach a new click listener. After a View Transition, the new header's hamburger button had no listener and was unresponsive.
- **Evidence (live reproduction on https://astro.jesspete.shop/):**
  1. Navigate to `https://astro.jesspete.shop/` on a mobile viewport (390×844)
  2. Verify the hamburger button works (click → menu opens, aria-expanded="true", focus moves to first link)
  3. Click any internal link (e.g., a footer link to `/resources/manipulate-hubspot-forms-javascript/`) — this triggers a View Transition
  4. On the new page, click the hamburger button
  5. **Observed (buggy):** menu stays `hidden`, `aria-expanded` stays `"false"`, focus stays on the button
  6. **Expected:** menu opens, `aria-expanded` becomes `"true"`, focus moves to first link
- **Evidence (source inspection):** The bundled output (`dist/index.html` inline module script 1) showed:
  ```js
  var e=document.querySelector(`[data-mobile-menu-toggle]`),
      t=document.querySelector(`[data-mobile-menu]`);
  if(e&&t){
    let n=()=>{…closeMenu…},  // operates on captured e/t
        r=()=>{…openMenu…};
    e.addEventListener(`click`, …);
    …
    document.addEventListener(`astro:after-swap`, n);  // only calls closeMenu
  }
  ```
  Contrast with the dropdown init in the same script (`n(), document.addEventListener('astro:after-swap', n)` where `n` is `initDropdowns`) — that one correctly re-inits.
- **Impact:** Mobile users (the primary audience for a hamburger menu) cannot open the mobile menu after navigating to a second page. The hamburger button visually appears but does nothing on click. This is a core-navigation regression that affects every mobile session beyond the landing page.
- **Skill rule violated:** `[astro-7-patterns §3]` — "Every inline `<script>` that queries the DOM must re-run on `astro:after-swap`. Missing re-init is the #1 bug class."
- **Severity:** High
- **Recommended fix:** Wrap the mobile-menu init in an `initMobileMenu()` function (idempotent via a `dataset.mobileMenuInit` flag on the toggle, mirroring the dropdown pattern at lines 199–246). Call `initMobileMenu()` on initial load and on `astro:after-swap`. Inside `initMobileMenu`, re-query `toggle` and `menu` each time so the new elements get fresh listeners. Keep `closeMenu` as a standalone function that takes no closure dependencies (re-query inside it, or pass elements as args).
- **Confidence:** Verified (code inspection + live reproduction on `https://astro.jesspete.shop/`)

### F6 — Portfolio imagery is missing (HIGH — from comparative analysis, validated as real gap)

- **Location:** `src/components/home/RecentWork.astro` (case study cards used CSS gradients); `src/components/home/FeaturedArticles.astro` (article cards had no thumbnails)
- **Description:** The clone's case-study cards used a single shared CSS gradient (`linear-gradient(135deg, rgb(197, 245, 246), rgb(161, 227, 154))`) and text. The original `kelp.agency` has real portfolio screenshots for each case study (e.g., `SpringWater-01-02-scaled.png`, `Deals-In-Dirt-01-scaled.png`, `Harts-01-scaled.png`, `Elev8-01-scaled.png`, `Mountaineer-01-scaled.png`, `Unprofitable-01-scaled.png` at 351×198) plus article thumbnails (`Hubspot-Load-more.png`, `Utilizing-Photography.png`, `partners-vs-pirates.png` at 351×250) and How We Work background images.
- **Evidence (live comparison via agent-browser):**
  - Original: 12+ images at `https://www.kelp.agency/_astro/*.png` (verified via `agent-browser eval`)
  - Clone: 0 portfolio images (verified — `firstCardImgs: 0`, `bgImgs: ["linear-gradient(135deg, rgb(197, 245, 246), rgb(161, 227, 154))"]`)
- **Impact:** The clone looked unfinished next to the original. Visual storytelling was absent. LCP element was a `<p>` text node (LCP 128ms is fine, but the visual was flat).
- **Skill rule referenced:** `[astro-7 §A15]` (use `astro:assets` `<Image />` for local images) — but the deeper issue is the **absence** of imagery, not how it's rendered.
- **Severity:** High (brand-damaging per comparative analysis §6.1)
- **Recommended fix:** Two-part approach, respecting copyright on the original's portfolio imagery:
  1. **Per-case-study SVG cover art** — generate unique branded SVG covers for each of the 9 case studies. Each cover is an abstract composition derived from the client's category and the client's identity. SVG is lightweight, infinitely scalable, and avoids the copyright issue entirely.
  2. **Per-article SVG cover art** — same approach for the 3 articles in `src/content/articles/`.
- **Constraint:** Do NOT download the original's copyrighted portfolio screenshots. The clone is a demo; unique SVG cover art is the ethical and legal choice.
- **Confidence:** Verified

### F2 — Headroom scroll behavior does NOT re-init on `astro:after-swap` (MEDIUM)

- **Location:** `src/layouts/BaseLayout.astro` lines 154–211 (the `<script>` block, headroom portion)
- **Description:** The headroom script queried `.site-header` ONCE (line 155) and captured it in the `header` closure variable. A `scroll` listener was attached to `window` (line 190, correctly `{ passive: true }`) with an `onScroll` callback that mutates classes on that captured `header` element. The `astro:after-swap` handler at lines 195–211 ONLY re-initialized the IntersectionObserver for `[data-reveal]` elements — it did NOT re-query `.site-header` or re-bind the scroll listener. After a View Transition, the scroll listener still fired but mutated the now-detached OLD header; the NEW header never received `is-scrolled`, `headroom--pinned`, or `headroom--unpinned` classes.
- **Evidence (live reproduction):** Navigate `https://astro.jesspete.shop/` → click footer link → arrive at `/about/` via View Transition → scroll 600px → header className remained just `"site-header"` (no `is-scrolled`, no `headroom--pinned`, no `headroom--unpinned`). The scroll listener was leaking (still firing on `window` forever, mutating a detached element).
- **Evidence (source inspection):** The bundled output showed `var t=document.querySelector('.site-header');if(t){...window.addEventListener('scroll',n,{passive:!0}),n()}document.addEventListener('astro:after-swap',()=>{...})` where the swap handler only re-inits `[data-reveal]` IntersectionObserver.
- **Impact:** After the first View Transition, the sticky header stopped hiding on scroll-down and stopped showing the scroll-shadow. The header remained sticky via CSS (`position: sticky`) so it was still visible, but the headroom enhancement (a documented part of the design — see `[astro-7-patterns §5]`) was silently lost. The scroll listener also leaked: it kept firing on `window` forever, mutating a detached element.
- **Skill rule violated:** `[astro-7-patterns §3]` (same #1 bug class) and `[astro-7-patterns §5]` (headroom pattern requires re-init).
- **Severity:** Medium
- **Recommended fix:** Extract the headroom init into a function (e.g., `initHeadroom()`) that re-queries `.site-header` each call. Call it on initial load and inside the existing `astro:after-swap` handler (alongside the IntersectionObserver re-init). Use a `dataset.headroomInit` flag for idempotency OR remove the old `scroll` listener before attaching a new one (the closure capture makes the flag approach simpler).
- **Confidence:** Verified

### F3 — Dropdown `initDropdowns` re-attaches `document` click listener on every swap (MEDIUM)

- **Location:** `src/components/Header.astro` lines 199–249 (the `initDropdowns` function and its `astro:after-swap` registration)
- **Description:** `initDropdowns()` did two things: (1) iterate `.has-submenu` elements and attach per-trigger listeners (correctly idempotent via `trigger.dataset.dropdownInit`), and (2) attach an outside-click listener to `document` (line 235). The function was called on initial load AND on every `astro:after-swap` (line 249). The per-trigger init was idempotent, but the `document.addEventListener('click', …)` was NOT guarded — a new, identical listener was added on every swap.
- **Evidence (source inspection):** The bundled output showed `var n=()=>{document.querySelectorAll('.has-submenu').forEach(e=>{...});document.addEventListener('click',e=>{...})};n(),document.addEventListener('astro:after-swap',n)`.
- **Impact:** After N view transitions, there were N+1 identical outside-click listeners on `document`. Each one fired on every click and did the same thing (close any open submenu that didn't contain the click target). The visible behavior was correct (idempotent effect), but it was a memory leak and a minor per-click CPU cost. No user-visible bug.
- **Skill rule violated:** `[astro-7-patterns §6 / §12]` (idempotent init pattern — the document-level listener should be attached once, not inside the per-swap re-init function).
- **Severity:** Medium (downgraded from High because there is no user-visible regression — the effect is idempotent)
- **Recommended fix:** Move the `document.addEventListener('click', …)` outside `initDropdowns()`, so it is attached only once at initial script execution. The per-trigger `forEach` stays inside `initDropdowns()` (it is correctly idempotent and needs to run on each swap to bind new triggers). Alternatively, guard the document listener with a module-level boolean flag.
- **Confidence:** Verified

### F4 — `validate-content.mjs` services schema omits required `anchor` field (LOW)

- **Location:** `scripts/validate-content.mjs` lines 36–41 (the `services` schema entry)
- **Description:** The Zod schema in `src/content.config.ts` (lines 18–27) defined services with `anchor: z.string()` — required, no `.optional()`. The validator's `services` entry listed `required: ['title', 'category', 'description']` — `anchor` was missing. A service markdown file that omitted `anchor:` would pass `npm run check:content` but fail `astro build` at content-layer validation time.
- **Evidence (source inspection):**
  ```ts
  // src/content.config.ts (services schema)
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    anchor: z.string(),           // REQUIRED
    offerings: z.array(z.string()).default([]),
  }),
  ```
  ```js
  // scripts/validate-content.mjs
  services: {
    ext: '.md',
    required: ['title', 'category', 'description'],  // ← missing 'anchor'
    optional: ['offerings'],
    types: { offerings: 'array' },
  },
  ```
- **Impact:** The regression-test net had a hole. If a contributor added a service markdown file without `anchor:`, the validator wouldn't catch it; the build would fail later with a less-friendly Astro error. The whole point of `check:content` (per round-1 TDD strategy) was to surface schema violations before `astro build` did.
- **Skill rule violated:** `[astro-7-patterns §16]` (pre-build dep guard / regression-test coverage) — the validator must stay in sync with `content.config.ts`.
- **Severity:** Low
- **Recommended fix:** Add `'anchor'` to the `required` array in the `services` schema in `scripts/validate-content.mjs`. While here, audit the other three collections for the same drift (`caseStudies` matches; `articles` matches; `testimonials` matches — only `services` was wrong).
- **Confidence:** Verified

### F8 — No testing infrastructure (LOW — reclassified from HIGH after the round-5 fix)

- **Location:** `package.json` (no `vitest`, no `@playwright/test`); `CLAUDE.md` Testing Strategy section explicitly said "No test runner, linter, or formatter is configured."
- **Description:** The codebase relied entirely on `astro check` + `link-check.mjs` + `validate-content.mjs` for verification. These were sufficient for type-checking, broken-link detection, and frontmatter validation, but they could NOT catch the View Transitions re-init bugs (F1, F2, F3) — those require actually running the page in a browser and triggering a navigation.
- **Impact:** F1, F2, and F3 were live in production for at least 1 day before this audit caught them. Without E2E tests, future changes to `Header.astro` or `BaseLayout.astro` could silently re-introduce them.
- **Skill rule referenced:** `[astro-7 §3266–3442]` (Testing — Vitest for unit, Playwright for E2E, Lighthouse CI for perf regression) and `[astro-7-patterns §14]` (production build optimization includes a testing strategy).
- **Severity:** Low (was High before the fix; the gap is now closed by the Playwright suite added in round 5)
- **Recommended fix:** Add Playwright with a minimal E2E spec that covers the regression scenarios. (Done in round 5.)
- **Confidence:** Verified

### F9 — No CI/CD GitHub Actions workflow (LOW — reclassified from MEDIUM after the round-5 fix)

- **Location:** No `.github/` directory existed.
- **Description:** The repo had no CI. Every check (`npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`) ran only locally. There was no automated gate on PRs or pushes to `main`.
- **Impact:** Bugs like F1/F2/F3 could be pushed to `main` without any automated check. A CI workflow that ran all checks on every push would prevent this.
- **Skill rule referenced:** `[astro-7 §3266]` (CI testing section) and `[astro-7-patterns §14]`.
- **Severity:** Low (was Medium before the fix; the gap is now closed by the GitHub Actions workflow added in round 5)
- **Recommended fix:** Add `.github/workflows/ci.yml` that runs on push/PR to `main`. (Done in round 5.)
- **Confidence:** Verified

### F5 — Case-study body content was near-duplicate across 6 of 9 files (INFORMATIONAL)

- **Location:** `src/content/case-studies/{spring-water-spirits,unprofitable,elev8-fun,mountaineer-coffee,deals-in-dirt,harts-meat-market}.md`
- **Description:** Six of the nine case-study markdown files shared word-for-word-identical body paragraphs — only the client name in the opening sentence differed. The Challenge / Our Approach / The Solution / The Result sections were templated:
  > "The client needed a brand identity that would stand out in a crowded market while remaining authentic to their roots. They also required a website that could serve as both a marketing platform and a customer engagement tool."
  > "We started with a deep discovery phase — interviewing stakeholders, analyzing competitors, and mapping the customer journey."
  > "**Brand identity** — Logo, color system, typography, and brand voice guidelines"
  > "The new brand launched to positive reception from both customers and industry peers."
  The three newer case studies (`marker-48.md`, `croom-brewery.md`, `beverlin-hills-quality-goods.md`, added in round 1) each had unique, specific, plausible content and demonstrated the intended quality bar.
- **Impact:** Six case-study detail pages (`/work/spring-water-spirits/`, `/work/unprofitable/`, etc.) read as obviously templated. This was flagged as I3 in the original round-1 audit and explicitly deferred as "content work, not code work" — it was still outstanding at the start of round 5. Not a code bug; content-quality debt.
- **Skill rule referenced:** `[astro-7-patterns §15]` (fabricated-content liability / anti-slop).
- **Severity:** Informational (deferred content work, not a code regression)
- **Recommended fix:** Replace the 6 templated bodies with client-specific content matching the quality bar set by `marker-48.md` / `croom-brewery.md` / `beverlin-hills-quality-goods.md`. (Done in round 5.)
- **Confidence:** Verified

---

## Clean dimensions (no findings)

The following 8 audit dimensions were reviewed and were **clean** at audit time — no outstanding issues:

1. **Project structure & config** — `astro.config.mjs` was correct (`site: 'https://astro.jesspete.shop'`, `output: 'static'`, `prefetch` configured, `@astrojs/sitemap` + `@tailwindcss/vite` integrated, Fonts API with explicit weights/styles). `tsconfig.json` extended `astro/tsconfigs/strict`. `package.json` had no extraneous deps. `.gitignore` correctly excluded `dist/`, `node_modules/`, `.astro/`, `skills/`. No `[astro-7 §A1-A47]` anti-patterns present.

2. **Content Layer correctness** — `src/content.config.ts` used `glob()` loader, `z` from `astro/zod` (correct Zod 4 import path), `z.coerce.date()` for dates (correct Zod 4 pattern). `render(entry)` was async-imported correctly in both `[slug].astro` files. All 4 collections were correctly defined and consumed.

3. **Routing & getStaticPaths** — Both `src/pages/work/[slug].astro` and `src/pages/resources/[slug].astro` used `getStaticPaths()` returning `params: { slug: cs.id }` (correct — uses `cs.id` as the slug, not a separate slug field). `props: { cs }` passed the full entry. No anti-patterns.

4. **Tailwind 4 + Fonts API** — No `tailwind.config.js` existed. No `@astrojs/tailwind` import. `src/styles/global.css` started with `@import "tailwindcss";` and had a `@theme` block. `cssVariable` names in `astro.config.mjs` (`--font-poppins`, `--font-newsreader`) matched the `@theme` vars in `global.css`. Font subsetting was explicit. `[astro-7-patterns §4]` fully satisfied.

5. **astro:assets (images)** — Grep for raw `<img src="...">` in `src/`: 0 matches. The site had no local raster images (hero was text-based, case-study cards used CSS gradients, testimonials used inline SVG). No `[astro-7 §A15]` violation. No LCP image to worry about (LCP element was the `<h1>` text in the hero).

6. **Security** — Grep for `set:html`: only 1 usage, in `BaseLayout.astro` for JSON-LD. The JSON-LD content was 100% server-controlled (no user input), used `JSON.stringify()` for valid JSON escaping, and had `is:inline` directive. This matched `[astro-7-patterns §17]` exactly. No `security.checkOrigin` needed (static output, no Actions, no form backend). No user-input → HTML paths. No cookies.

7. **SEO** — `site` was the deployed URL. `@astrojs/sitemap` was integrated. Canonical URLs used `new URL(Astro.url.pathname, Astro.site).href`. OG tags complete. JSON-LD used `set:html` + `JSON.stringify()` + `is:inline` (correct). Title-tag convention matched the original kelp.agency per round-4 R4-3. `public/robots.txt` existed and referenced the sitemap.

8. **Mobile menu a11y (11-item checklist)** — All 11 items from `[astro-7-patterns §7]` were met:
   1. ✅ `aria-expanded` on toggle
   2. ✅ `aria-controls="mobile-menu"` on toggle
   3. ✅ `aria-label` toggles between "Open menu" / "Close menu"
   4. ✅ `role="dialog"` on menu container
   5. ✅ `aria-modal="true"` on menu container
   6. ✅ `aria-label="Site navigation"` on menu container
   7. ✅ Escape closes the menu
   8. ✅ Link click closes the menu
   9. ✅ Body scroll lock via `document.body.style.overflow = 'hidden'`
   10. ✅ Focus-on-open via `requestAnimationFrame` → first link `.focus()`
   11. ✅ Focus-return to toggle on close

   The mobile menu's a11y was fully compliant. (Note: the *script re-init* bug in F1 above was a separate concern — the a11y attributes were correct on initial render; the bug was that the toggle stopped working after navigation.)

9. **Build & CI discipline** — `prebuild` and `precheck` hooks both ran `scripts/verify-deps.mjs`. `verify-deps.mjs` covered all 5 config-level deps. `link-check.mjs` walked `dist/**/*.html` and verified internal links. `validate-content.mjs` replicated the Zod schemas inline and validated every content file. All three scripts were zero-dependency. The only gap was F4 above (services schema missing `anchor`).

10. **Performance** — `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }` was configured. Font subsetting was explicit. Zero `client:load` / `client:visible` / `client:idle` / `client:only` directives in the entire `src/` tree — the site shipped near-zero JS. No `[astro-7 §A29]` hydration anti-pattern.

11. **Content integrity (no fabricated content)** — Testimonials used clearly-fictional placeholders (Jane Doe / John Smith / Alex Sample with Example Co. / Demo LLC / Test Corp) — round-4 R4-1 fix was live. `contact.astro` had the real Kelp info. `about.astro` used fictional team names with an explicit disclaimer. The JSON-LD `Organization` schema matched the contact page exactly. No fabricated quotes attributed to real companies.

12. **Anti-slop / AI smells** — No TODO/FIXME/HACK/XXX comments in `src/`. No dead code. No near-duplicate components (the `desiredOrder` DRY violation was fixed in round 3 via `src/lib/service-order.ts`). The remaining "anti-slop" item was F5 above (templated case-study bodies), which was content debt, not code debt.

---

## Cross-check against prior remediation plans

| Prior finding | Status at start of round 5 | Notes |
|---------------|-----------------------------|-------|
| Round 1: C1–C4 (broken links, frontmatter) | ✅ Fixed, no regression | `check:links` passed; Hero slugs correct; `/work/clients/` existed; no `href="#"` remained. |
| Round 1: H1–H8 (config, sitemap, collections) | ✅ Fixed, no regression | `site` URL correct; sitemap generated; all 4 collections consumed via `getCollection()`. |
| Round 1: M1–M6 (carousel a11y, dropdowns, headless platform, prose, 404, header height) | ✅ Fixed, no regression | Carousel had `role="region"` + `tabindex="0"` + keyboard support; dropdowns present; Headless platform added; `prose-kelp` class replaced `prose`; 404 used `padding="lg"`; `--header-height` CSS var existed. |
| Round 1: L1, L2, L5 (OG image, README, viewport) | ✅ Fixed, no regression | `og-default.png` existed (1200×630); viewport had `viewport-fit=cover`; README updated. |
| Round 2: B1–B3 (prebuild guard, OG image, docs) | ✅ Fixed, no regression | `prebuild`/`precheck` hooks present; OG image served 200; docs mentioned `npm install` after pulling. |
| Round 3: R3-1, R3-2 (mobile menu dialog + focus) | ✅ Fixed, no regression | `role="dialog"` + `aria-modal="true"` + `aria-label="Site navigation"` present; `openMenu` focused first link via `requestAnimationFrame`; `closeMenu` returned focus to toggle. |
| Round 3: R3-3 (footer CTA column) | ✅ Fixed, no regression | Footer had 6 columns; first was "Ready to get started?" CTA. |
| Round 3: R3-4 (HowWeWork CTA link) | ✅ Fixed, no regression | "Ready to get started?" link present after the `<ol>`. |
| Round 3: R3-5 (DRY desiredOrder) | ✅ Fixed, no regression | `src/lib/service-order.ts` exported `SERVICE_ORDER`; both consumers imported it. |
| Round 4: R4-1 (fabricated contact info) | ✅ Fixed, no regression | Real Kelp info in `contact.astro`, `about.astro`, testimonials, and JSON-LD. |
| Round 4: R4-2 (brand SVGs) | ✅ Fixed, no regression | `HeroWave.astro` existed; testimonial leaf SVG present in `Testimonials.astro`. |
| Round 4: R4-3 (title tags) | ✅ Fixed, no regression | All 11 page titles matched the original convention. |
| Round 4: R4-4 (JSON-LD) | ✅ Fixed, no regression | `Organization` + `WebSite` + `WebPage` + `BreadcrumbList` graph in `BaseLayout.astro`. |

**None of the 7 findings in this audit were regressions of prior fixes.** All 7 were new findings the prior rounds missed (F1–F4 were code-level issues; F5 was deferred content debt; F6 was a comparative-analysis gap; F8/F9 were infrastructure gaps).

---

*End of round-5 audit findings. The remediation plan + TDD execution log is in `docs/audit/REMEDIATION_PLAN_ROUND5.md`.*
