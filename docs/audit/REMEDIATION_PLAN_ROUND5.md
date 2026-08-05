# Remediation Plan — Round 5 (View Transitions Re-Init Bugs + Content + Imagery + CI)

> **Paired with:** `docs/audit/AUDIT_FINDINGS.md` (round 1), `docs/audit/REMEDIATION_PLAN.md` (round 1), `docs/audit/REMEDIATION_PLAN_ROUND2.md` (round 2), `docs/audit/REMEDIATION_PLAN_ROUND3.md` (round 3), `docs/audit/REMEDIATION_PLAN_ROUND4.md` (round 4)
> **Date:** 2026-08-05
> **Trigger:** Mode C systematic code audit (per `astro-7` + `astro-7-patterns` skills compliance checklist) + `agent-browser` E2E validation against the live clone (`https://astro.jesspete.shop/`) and the original (`https://www.kelp.agency/`) + re-validation of the prior `docs/kelp_agency_comparative_analysis.md` and `docs/kelp_clone_remediation_plan.md`.
> **Operating mode:** Mode C (Audit) → Mode B (Debug) → Mode A (Generation), per the parent system prompt's Section 2.

---

## Summary

| Source | Findings | Critical | High | Medium | Low | Info |
|--------|----------|----------|------|--------|-----|------|
| Task 5-b Mode C code audit | 5 | 0 | 1 | 2 | 1 | 1 |
| Task 5-a/6 agent-browser E2E (live clone) | 2 new | 0 | 1 | 0 | 1 | 0 |
| Comparative analysis re-validation | 7 invalid + 4 out-of-scope | 0 | 0 | 0 | 0 | 0 |
| **Genuinely outstanding** | **7** | **0** | **2** | **2** | **2** | **1** |

The codebase is in strong shape after 4 remediation rounds: build is clean (21 pages, 0 type errors, 0 broken internal links, 0 content errors), `npm audit` reports 0 vulnerabilities, and the prior 14 findings across rounds 1–4 are all confirmed live with no regressions.

The standout new finding is a **High-severity View Transitions bug** in the mobile menu (`F1`): the script captures the toggle and menu elements once at script execution and only registers `closeMenu` (not a re-init function) on `astro:after-swap`. After the first View Transition, the new hamburger button has no click listener and the mobile menu becomes unresponsive. This is precisely the #1 bug class called out in `[astro-7-patterns §3]`. Verified via live reproduction on `https://astro.jesspete.shop/`.

This round addresses all genuinely outstanding items using a TDD approach (red → green → refactor): Playwright E2E tests are written first to reproduce the bugs, then the code is fixed, then the tests are re-run to confirm green.

---

## Re-validation of `docs/kelp_agency_comparative_analysis.md`

The comparative analysis report (dated 2026-08-05) was written **before** the codebase was reviewed. After re-validation against the actual codebase and live site:

| Comparative-analysis claim | Status after validation | Action |
|----------------------------|-------------------------|--------|
| Missing logomark | **INVALID** — clone has `public/favicon.svg` (K "K" wordmark) + wordmark in header; original `kelp.agency` also uses a wordmark (no separate "frond logomark" visible in the rendered header DOM — verified via `agent-browser eval`). The "three green fronds" logomark described in the report is not present in the live original's header. | **No action** |
| No portfolio | **STALE** — clone has 9 case-study markdown entries and a 9-slide carousel; the comparative analysis saw the no-JS fallback state | **No action** |
| Fictional testimonials | **FIXED (R4-1)** — fictional placeholders (Jane Doe / John Smith / Alex Sample with Example Co. / Demo LLC / Test Corp) are the intentional ethical choice for a demo clone | **No action** |
| Single-page architecture | **STALE** — clone has 21 pages (verified via build output) | **No action** |
| No services detail | **OUT OF SCOPE** — `/services/` is a single index page with anchor navigation; intentional design choice documented in `docs/kelp-design-template.md` | **No action** |
| No client logo bar | **INVALID** — original `kelp.agency` also does not have a dedicated client-logo bar (verified via `agent-browser eval` — `logosBarExists: false`). Comparative analysis was wrong about the original. | **No action** |
| Missing blog/content hub | **OUT OF SCOPE** — `/resources/` is the intentional design choice (Articles & guides per design template) | **No action** |
| Non-functional carousel | **STALE** — carousel works on initial load with prev/next buttons + counter "1 / 9"; F1 (this round) addresses the post-View-Transition breakage | **F1** |
| Markdown artifacts (`_italic_`) | **STALE** — no `_italic_` artifacts found in current source (verified via grep) | **No action** |
| Generic copy | **PARTIALLY VALID** — 6 of 9 case studies use templated bodies (F5) | **F5** |
| No multi-page navigation | **STALE** — Header.astro has 4 dropdown menus + mobile menu | **No action** |
| Missing color system | **INVALID** — clone has full `@theme` token block in `src/styles/global.css` matching the original's palette | **No action** |
| No footer | **STALE** — Footer.astro has 6 columns (CTA + Services + Contact + Work + Platforms + Social) | **No action** |
| Limited CTA strategy | **STALE** — multiple CTAs across hero, HowWeWork, footer | **No action** |
| No real imagery | **VALID** — clone uses CSS gradients for case-study cards; original has real portfolio screenshots | **F6** |

**Conclusion:** Of the 15 critical/high/medium discrepancies in the comparative analysis, **only 2 are genuinely outstanding** (carousel post-navigation breakage → F1; missing portfolio imagery → F6). The other 13 are stale, invalid, or out-of-scope.

---

## Re-validation of `docs/kelp_clone_remediation_plan.md`

The forward-looking remediation plan (also dated 2026-08-05) proposed 5 phases of new work. After re-validation:

| Plan item | Status | Action |
|-----------|--------|--------|
| 1.1 Logomark Restoration | **INVALID** (see above) | **Drop** |
| 1.2 Portfolio Imagery | **VALID** — clone uses CSS gradients, original has real images | **F6** |
| 1.3 Client Logo Bar | **INVALID** (original also doesn't have one) | **Drop** |
| 1.4 Color System Audit | **ALREADY DONE** — `@theme` block matches original | **No action** |
| 2.1 Testimonial Strategy | **FIXED (R4-1)** — fictional placeholders is the ethical choice for a demo clone | **No action** |
| 2.2 Team / About | **FIXED (R4-1)** — fictional team with explicit disclaimer | **No action** |
| 2.3 Contact Information | **FIXED (R4-1)** — real Kelp info in place across contact.astro, about.astro, JSON-LD | **No action** |
| 3.1 Testing Infrastructure | **VALID** — no Vitest/Playwright configured; needed to prevent F1/F2/F3 regressions | **F8** |
| 3.2 Performance Optimization | **PARTIALLY VALID** — no raw `<img>` to fix (site has zero local raster images); no Lighthouse CI | **F8 (Lighthouse optional)** |
| 3.3 Contact Form Backend | **OUT OF SCOPE** — intentional stub per `AGENTS.md` and `CLAUDE.md` | **Drop** |
| 3.4 Route Caching | **N/A** — `output: 'static'`, no SSR | **Drop** |
| 4.1 Blog / RSS | **OUT OF SCOPE** — `/resources/` is the intentional design choice | **Drop** |
| 4.2 Services Detail Pages | **OUT OF SCOPE** — anchor-based design choice | **Drop** |
| 4.3 Case Study Galleries | **DEFERRED** — pending F6 (imagery) | **F6** |
| 5.1 CI/CD Pipeline | **VALID** — no GitHub Actions workflow | **F9** |
| 5.2 Environment Configuration | **N/A** — static site, no env vars needed; `astro:env` is for SSR/Actions | **Drop** |
| 5.3 Security Audit | **CLEAN** — `set:html` only on JSON-LD (server-controlled); `npm audit` 0 vulnerabilities; no CSRF needed for static; no cookies | **No action** |
| 5.4 Monitoring & Analytics | **OUT OF SCOPE** for demo clone | **Drop** |

**Conclusion:** Of the 22 sub-items in the proposed remediation plan, **4 are genuinely outstanding** (F6 imagery, F8 testing, F9 CI/CD, plus the deferred F5 case-study content). The other 18 are invalid, already done, or out-of-scope.

---

## Validated Outstanding Findings

### F1 — Mobile menu script does NOT re-init on `astro:after-swap` (HIGH)

- **Location:** `src/components/Header.astro` lines 144–193 (the `<script>` block, mobile menu portion)
- **Description:** The mobile menu init queries `[data-mobile-menu-toggle]` and `[data-mobile-menu]` ONCE at script execution (lines 146–147) and captures them in the `toggle` / `menu` closure variables. A click listener is attached to that specific `toggle` element (line 173). The `astro:after-swap` listener (line 192) only calls `closeMenu` — it does NOT re-query the new toggle/menu or attach a new click listener. After a View Transition, the new header's hamburger button has no listener and is unresponsive.
- **Evidence (live reproduction):** Navigate `https://astro.jesspete.shop/` → click internal link → arrive at `/resources/manipulate-hubspot-forms-javascript/` via View Transition → click hamburger button → menu stays `hidden`, `aria-expanded` stays `"false"`, focus stays on the button instead of moving to the first menu link. Bug is reproducible 100% of the time after any View Transition.
- **Evidence (source inspection):** The bundled output (`dist/index.html` inline module script 1) shows `var e=document.querySelector('[data-mobile-menu-toggle]'),t=document.querySelector('[data-mobile-menu]');if(e&&t){...e.addEventListener('click',...);...document.addEventListener('astro:after-swap',n);}` where `n` is `closeMenu`. Only `closeMenu` is registered on swap — no re-init.
- **Impact:** Mobile users (the primary audience for a hamburger menu) cannot open the mobile menu after navigating to a second page. The hamburger button visually appears but does nothing on click. This is a core-navigation regression that affects every mobile session beyond the landing page.
- **Skill rule violated:** `[astro-7-patterns §3]` — "Every inline `<script>` that queries the DOM must re-run on `astro:after-swap`. Missing re-init is the #1 bug class." The dropdown init in the same file (`initDropdowns()` at lines 199–249) and the carousel init in `RecentWork.astro` both handle this correctly — the mobile menu init is the only one that doesn't.
- **Severity:** High
- **Recommended fix:** Wrap the mobile-menu init in an `initMobileMenu()` function (idempotent via a `dataset.mobileMenuInit` flag on the toggle, mirroring the dropdown pattern at lines 199–246). Call `initMobileMenu()` on initial load and on `astro:after-swap`. Inside `initMobileMenu`, re-query `toggle` and `menu` each time so the new elements get fresh listeners. Extract `closeMenu` and `openMenu` as standalone functions that re-query the elements they need (or accept them as args).
- **Confidence:** Verified (code inspection + live reproduction on `https://astro.jesspete.shop/`)

### F2 — Headroom scroll behavior does NOT re-init on `astro:after-swap` (MEDIUM)

- **Location:** `src/layouts/BaseLayout.astro` lines 154–211 (the `<script>` block, headroom portion)
- **Description:** The headroom script queries `.site-header` ONCE (line 155) and captures it in the `header` closure variable. A `scroll` listener is attached to `window` (line 190, correctly `{ passive: true }`) with an `onScroll` callback that mutates classes on that captured `header` element. The `astro:after-swap` handler at lines 195–211 ONLY re-initializes the IntersectionObserver for `[data-reveal]` elements — it does NOT re-query `.site-header` or re-bind the scroll listener. After a View Transition, the scroll listener still fires but mutates the now-detached OLD header; the NEW header never receives `is-scrolled`, `headroom--pinned`, or `headroom--unpinned` classes.
- **Evidence (live reproduction):** Navigate `https://astro.jesspete.shop/` → click footer link → arrive at `/about/` via View Transition → scroll 600px → header className remains just `"site-header"` (no `is-scrolled`, no `headroom--pinned`, no `headroom--unpinned`). The scroll listener is leaking (still firing on `window` forever, mutating a detached element).
- **Evidence (source inspection):** The bundled output shows `var t=document.querySelector('.site-header');if(t){...window.addEventListener('scroll',n,{passive:!0}),n()}document.addEventListener('astro:after-swap',()=>{...})` where the swap handler only re-inits `[data-reveal]` IntersectionObserver.
- **Impact:** After the first View Transition, the sticky header stops hiding on scroll-down and stops showing the scroll-shadow. The header remains sticky via CSS (`position: sticky`) so it's still visible, but the headroom enhancement (a documented part of the design — see `[astro-7-patterns §5]`) is silently lost. The scroll listener also leaks: it keeps firing on `window` forever, mutating a detached element.
- **Skill rule violated:** `[astro-7-patterns §3]` (same #1 bug class) and `[astro-7-patterns §5]` (headroom pattern requires re-init).
- **Severity:** Medium
- **Recommended fix:** Extract the headroom init into a function (e.g., `initHeadroom()`) that re-queries `.site-header` each call. Call it on initial load and inside the existing `astro:after-swap` handler (alongside the IntersectionObserver re-init). Use a `dataset.headroomInit` flag for idempotency OR remove the old `scroll` listener before attaching a new one (the closure capture makes the flag approach simpler).
- **Confidence:** Verified

### F3 — Dropdown `initDropdowns` re-attaches `document` click listener on every swap (MEDIUM)

- **Location:** `src/components/Header.astro` lines 199–249 (the `initDropdowns` function and its `astro:after-swap` registration)
- **Description:** `initDropdowns()` does two things: (1) iterate `.has-submenu` elements and attach per-trigger listeners (correctly idempotent via `trigger.dataset.dropdownInit`), and (2) attach an outside-click listener to `document` (line 235). The function is called on initial load AND on every `astro:after-swap` (line 249). The per-trigger init is idempotent, but the `document.addEventListener('click', …)` is NOT guarded — a new, identical listener is added on every swap.
- **Evidence (source inspection):** The bundled output shows `var n=()=>{document.querySelectorAll('.has-submenu').forEach(e=>{...});document.addEventListener('click',e=>{...})};n(),document.addEventListener('astro:after-swap',n)`.
- **Impact:** After N view transitions, there are N+1 identical outside-click listeners on `document`. Each one fires on every click and does the same thing (close any open submenu that doesn't contain the click target). The visible behavior is correct (idempotent effect), but it's a memory leak and a minor per-click CPU cost. No user-visible bug.
- **Skill rule violated:** `[astro-7-patterns §6 / §12]` (idempotent init pattern — the document-level listener should be attached once, not inside the per-swap re-init function).
- **Severity:** Medium (downgraded from High because there is no user-visible regression — the effect is idempotent)
- **Recommended fix:** Move the `document.addEventListener('click', …)` outside `initDropdowns()`, so it is attached only once at initial script execution. The per-trigger `forEach` stays inside `initDropdowns()` (it is correctly idempotent and needs to run on each swap to bind new triggers). Alternatively, guard the document listener with a module-level boolean flag.
- **Confidence:** Verified

### F4 — `validate-content.mjs` services schema omits required `anchor` field (LOW)

- **Location:** `scripts/validate-content.mjs` lines 36–41 (the `services` schema entry)
- **Description:** The Zod schema in `src/content.config.ts` (lines 18–27) defines services with `anchor: z.string()` — required, no `.optional()`. The validator's `services` entry lists `required: ['title', 'category', 'description']` — `anchor` is missing. A service markdown file that omits `anchor:` would pass `npm run check:content` but fail `astro build` at content-layer validation time.
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
- **Impact:** The regression-test net has a hole. If a contributor adds a service markdown file without `anchor:`, the validator won't catch it; the build will fail later with a less-friendly Astro error. The whole point of `check:content` (per round-1 TDD strategy) is to surface schema violations before `astro build` does.
- **Skill rule violated:** `[astro-7-patterns §16]` (pre-build dep guard / regression-test coverage) — the validator must stay in sync with `content.config.ts`.
- **Severity:** Low
- **Recommended fix:** Add `'anchor'` to the `required` array in the `services` schema in `scripts/validate-content.mjs`. While here, audit the other three collections for the same drift (`caseStudies` matches; `articles` matches; `testimonials` matches — only `services` is wrong).
- **Confidence:** Verified

### F5 — Case-study body content is near-duplicate across 6 of 9 files (INFORMATIONAL)

- **Location:** `src/content/case-studies/{spring-water-spirits,unprofitable,elev8-fun,mountaineer-coffee,deals-in-dirt,harts-meat-market}.md`
- **Description:** Six of the nine case-study markdown files share word-for-word-identical body paragraphs — only the client name in the opening sentence differs. The Challenge / Our Approach / The Solution / The Result sections are templated:
  > "The client needed a brand identity that would stand out in a crowded market while remaining authentic to their roots. They also required a website that could serve as both a marketing platform and a customer engagement tool."
  > "We started with a deep discovery phase — interviewing stakeholders, analyzing competitors, and mapping the customer journey."
  > "**Brand identity** — Logo, color system, typography, and brand voice guidelines"
  > "The new brand launched to positive reception from both customers and industry peers."
  The three newer case studies (`marker-48.md`, `croom-brewery.md`, `beverlin-hills-quality-goods.md`, added in round 1) each have unique, specific, plausible content and demonstrate the intended quality bar.
- **Impact:** Six case-study detail pages (`/work/spring-water-spirits/`, `/work/unprofitable/`, etc.) read as obviously templated. This was flagged as I3 in the original round-1 audit and explicitly deferred as "content work, not code work" — it is still outstanding. Not a code bug; content-quality debt.
- **Skill rule referenced:** `[astro-7-patterns §15]` (fabricated-content liability / anti-slop).
- **Severity:** Informational (deferred content work, not a code regression)
- **Recommended fix:** Replace the 6 templated bodies with client-specific content matching the quality bar set by `marker-48.md` / `croom-brewery.md` / `beverlin-hills-quality-goods.md`. Each case study should have unique Challenge / Approach / Solution / Result paragraphs grounded in the client's actual business and the actual services delivered (as documented in the frontmatter `services` array).
- **Confidence:** Verified

### F6 — Portfolio imagery is missing (HIGH — from comparative analysis, validated as real gap)

- **Location:** `src/components/home/RecentWork.astro` (case study cards use CSS gradients); `src/components/home/FeaturedArticles.astro` (article cards have no thumbnails)
- **Description:** The clone's case-study cards use a single shared CSS gradient (`linear-gradient(135deg, rgb(197, 245, 246), rgb(161, 227, 154))`) and text. The original `kelp.agency` has real portfolio screenshots for each case study (e.g., `SpringWater-01-02-scaled.png`, `Deals-In-Dirt-01-scaled.png`, `Harts-01-scaled.png`, `Elev8-01-scaled.png`, `Mountaineer-01-scaled.png`, `Unprofitable-01-scaled.png` at 351×198) plus article thumbnails (`Hubspot-Load-more.png`, `Utilizing-Photography.png`, `partners-vs-pirates.png` at 351×250) and How We Work background images.
- **Evidence (live comparison):**
  - Original: 12+ images at `https://www.kelp.agency/_astro/*.png` (verified via `agent-browser eval`)
  - Clone: 0 portfolio images (verified — `firstCardImgs: 0`, `bgImgs: ["linear-gradient(135deg, rgb(197, 245, 246), rgb(161, 227, 154))"]`)
- **Impact:** The clone looks unfinished next to the original. Visual storytelling is absent. LCP element is a `<p>` text node (LCP 128ms is fine, but the visual is flat).
- **Skill rule referenced:** `[astro-7 §A15]` (use `astro:assets` `<Image />` for local images) — but the deeper issue is the **absence** of imagery, not how it's rendered.
- **Severity:** High (brand-damaging per comparative analysis §6.1)
- **Recommended fix:** Two-part approach, respecting copyright on the original's portfolio imagery:
  1. **Per-case-study SVG cover art** — generate unique branded SVG covers for each of the 9 case studies. Each cover is an abstract composition derived from the client's category (Branding & Web Design, etc.) and the client's identity. SVG is lightweight, infinitely scalable, and avoids the copyright issue entirely. Implement as an `<CaseStudyCover client={cs.data.client} category={cs.data.category} />` Astro component rendered via `<Image />` from `astro:assets` (using `inferSize` on the SVG).
  2. **Per-article SVG cover art** — same approach for the 3 articles in `src/content/articles/`.
- **Constraint:** Do NOT download the original's copyrighted portfolio screenshots. The clone is a demo; unique SVG cover art is the ethical and legal choice.
- **Confidence:** Verified

### F8 — No testing infrastructure (HIGH — needed to prevent F1/F2/F3 regressions)

- **Location:** `package.json` (no `vitest`, no `@playwright/test`); `CLAUDE.md` Testing Strategy section explicitly says "No test runner, linter, or formatter is configured."
- **Description:** The codebase relies entirely on `astro check` + `link-check.mjs` + `validate-content.mjs` for verification. These are sufficient for type-checking, broken-link detection, and frontmatter validation, but they cannot catch the View Transitions re-init bugs (F1, F2, F3) — those require actually running the page in a browser and triggering a navigation.
- **Impact:** F1, F2, and F3 were live in production for at least 1 day before this audit caught them. Without E2E tests, future changes to `Header.astro` or `BaseLayout.astro` can silently re-introduce them.
- **Skill rule referenced:** `[astro-7 §3266–3442]` (Testing — Vitest for unit, Playwright for E2E, Lighthouse CI for perf regression) and `[astro-7-patterns §14]` (production build optimization includes a testing strategy).
- **Severity:** High (gates future code quality)
- **Recommended fix:** Add Playwright with a minimal E2E spec that covers:
  - Homepage loads with correct title and H1
  - Carousel advances on Next button click (initial load)
  - Carousel advances on Next button click (after View Transition) — regression test for the carousel init pattern
  - Mobile menu opens and closes (initial load)
  - Mobile menu opens and closes (after View Transition) — **regression test for F1**
  - Headroom adds `is-scrolled` class on scroll (initial load)
  - Headroom adds `is-scrolled` class on scroll (after View Transition) — **regression test for F2**
  - Dropdown outside-click listener is not duplicated after View Transition — **regression test for F3**
  - View Transitions do not break any of the above
- **Confidence:** Verified

### F9 — No CI/CD GitHub Actions workflow (MEDIUM)

- **Location:** No `.github/` directory exists.
- **Description:** The repo has no CI. Every check (`npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`) runs only locally. There is no automated gate on PRs or pushes to `main`.
- **Impact:** Bugs like F1/F2/F3 can be pushed to `main` without any automated check. A CI workflow that runs all checks on every push would prevent this.
- **Skill rule referenced:** `[astro-7 §3266]` (CI testing section) and `[astro-7-patterns §14]`.
- **Severity:** Medium
- **Recommended fix:** Add `.github/workflows/ci.yml` that runs on push and PR to `main`:
  - `npm install`
  - `npm run check`
  - `npm run build`
  - `npm run check:links`
  - `npm run check:content`
  - (optional) `npx playwright test` — defer until Playwright is added in F8
- **Confidence:** Verified

---

## Plan vs. Codebase Alignment (Pre-execution validation)

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| F1 fix mobile menu re-init | `src/components/Header.astro` lines 144–250 (mobile menu script + dropdown script for comparison); `astro-7-patterns §3` re-init pattern; `astro-7-patterns §6` idempotent init via `dataset` flag; live reproduction on `https://astro.jesspete.shop/` confirmed the bug | ✅ |
| F2 fix headroom re-init | `src/layouts/BaseLayout.astro` lines 136–212 (scroll reveal + headroom script); `astro-7-patterns §3` + `§5`; live reproduction confirmed the bug | ✅ |
| F3 fix dropdown document listener leak | `src/components/Header.astro` lines 199–249; `astro-7-patterns §6` idempotent init pattern | ✅ |
| F4 fix validator schema gap | `scripts/validate-content.mjs` lines 36–41; `src/content.config.ts` lines 18–27 (services schema requires `anchor`) | ✅ |
| F5 replace templated case-study bodies | `src/content/case-studies/{spring-water-spirits,unprofitable,elev8-fun,mountaineer-coffee,deals-in-dirt,harts-meat-market}.md` (templated); `src/content/case-studies/{marker-48,croom-brewery,beverlin-hills-quality-goods}.md` (unique — quality bar) | ✅ |
| F6 add SVG cover art | `src/components/home/RecentWork.astro` (currently uses CSS gradient on the slide div); `src/components/home/FeaturedArticles.astro` (no image); original's image dimensions (351×198 case study, 351×250 article) | ✅ |
| F8 add Playwright | `package.json` (no test runner); `CLAUDE.md` Testing Strategy section (documents the gap); `astro-7 §3266–3442` (testing section) | ✅ |
| F9 add CI workflow | No `.github/` directory; `astro-7 §3266` (CI section) | ✅ |

---

## TDD Strategy

Per the parent system prompt's Section 10 (Testing & Validation) and Mode B (Debugging) Section 11:

1. **F1, F2, F3 (regression-eligible bugs):** Write the failing Playwright E2E test first (red), then fix the code (green), then re-run the test to confirm green. Each test must assert the post-View-Transition behavior, not just the initial-load behavior. Per Section 11: "Bug fixes require a regression test that fails before the fix and passes after."

2. **F4 (validator schema gap):** Add a temporary service markdown file missing `anchor:` to `src/content/services/`. Run `npm run check:content` — it should pass (the bug). Fix `scripts/validate-content.mjs`. Run `npm run check:content` — it should now fail on the temporary file (confirming the fix works). Remove the temporary file. Run `npm run check:content` — should pass clean.

3. **F5 (case-study content):** Read each of the 3 quality-bar case studies (`marker-48.md`, `croom-brewery.md`, `beverlin-hills-quality-goods.md`) to internalize the pattern (unique Challenge / Approach / Solution / Result grounded in the client's actual business). Replace each of the 6 templated bodies with unique content following that pattern. Verify via `npm run check:content` (frontmatter unchanged) and `npm run build` (pages still build).

4. **F6 (SVG cover art):** Create a `<CaseStudyCover client={} category={} />` Astro component that renders a unique SVG composition per case study (deterministic based on client name hash + category color). Create a parallel `<ArticleCover title={} category={} />` for articles. Replace the CSS gradient in `RecentWork.astro` and the empty state in `FeaturedArticles.astro` with these components. Verify via `agent-browser eval` that each card now has a unique `<svg>` element.

5. **F8 (Playwright):** Install `@playwright/test` as a devDependency. Add `playwright.config.ts` with `webServer: { command: 'npm run preview', port: 4321, reuseExistingServer: !process.env.CI }`. Add `tests/` directory with E2E specs for the 8 scenarios listed in F8. Run `npx playwright test` to confirm all pass.

6. **F9 (CI):** Add `.github/workflows/ci.yml` that runs on push/PR to `main`. Steps: checkout, setup-node 22, npm install, npm run check, npm run build, npm run check:links, npm run check:content. (Defer Playwright in CI until browser binaries can be cached efficiently.)

---

## ToDo List (Execution Order)

### Phase 1 — Testing infrastructure (F8) — must come first so TDD is possible

- [ ] **T1.1** — `npm install -D @playwright/test`
- [ ] **T1.2** — Add `playwright.config.ts` with `webServer` config (preview server, port 4321, `reuseExistingServer: !process.env.CI`), projects for desktop Chrome + mobile Chrome (390×844 viewport).
- [ ] **T1.3** — Add `tests/` directory with the 8 E2E specs from F8. **These specs will FAIL for F1, F2, F3 (red).**
- [ ] **T1.4** — Run `npx playwright test` to confirm the F1/F2/F3 tests fail (red) and the rest pass. This is the "red" step of TDD.
- [ ] **T1.5** — Add `npm run test:e2e` script to `package.json` (`playwright test`).

### Phase 2 — Fix F1, F2, F3 (green)

- [ ] **T2.1 (F1)** — Refactor `src/components/Header.astro` mobile menu script (lines 144–193):
  - Extract `initMobileMenu()` function that re-queries `[data-mobile-menu-toggle]` and `[data-mobile-menu]` each call.
  - Idempotency via `toggle.dataset.mobileMenuInit === 'true'` flag (mirror the `initDropdowns` pattern).
  - Extract `closeMenu(toggle, menu)` and `openMenu(toggle, menu)` as standalone functions that accept elements as args (no closure dependency).
  - Call `initMobileMenu()` on initial load AND on `astro:after-swap`.
- [ ] **T2.2 (F2)** — Refactor `src/layouts/BaseLayout.astro` headroom script (lines 154–192):
  - Extract `initHeadroom()` function that re-queries `.site-header` each call.
  - Idempotency via `header.dataset.headroomInit === 'true'` flag.
  - Call `initHeadroom()` on initial load AND inside the existing `astro:after-swap` handler (alongside the IntersectionObserver re-init).
- [ ] **T2.3 (F3)** — Refactor `src/components/Header.astro` `initDropdowns()` (lines 199–249):
  - Move the `document.addEventListener('click', …)` outside-click listener OUT of `initDropdowns()` so it attaches only once at initial script execution.
  - Keep the per-trigger `forEach` inside `initDropdowns()` (correctly idempotent via `dataset.dropdownInit`).
- [ ] **T2.4** — Run `npx playwright test` to confirm all 8 E2E specs now pass (green).
- [ ] **T2.5** — Run `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content` to confirm no regressions.

### Phase 3 — Fix F4 (validator schema gap)

- [ ] **T3.1** — In `scripts/validate-content.mjs` line 37, add `'anchor'` to the `required` array for the `services` schema: `required: ['title', 'category', 'description', 'anchor']`.
- [ ] **T3.2** — Verify all 5 existing service markdown files have `anchor:` frontmatter (they should, since the build was passing).
- [ ] **T3.3** — Run `npm run check:content` to confirm 0 errors.

### Phase 4 — Fix F5 (templated case-study bodies)

- [ ] **T4.1** — Rewrite `src/content/case-studies/spring-water-spirits.md` body with unique content (Spring Water Spirits is a sister company to Marker 48, located in Weeki Wachee FL — per the original kelp.agency description).
- [ ] **T4.2** — Rewrite `src/content/case-studies/unprofitable.md` body with unique content grounded in the client name and category.
- [ ] **T4.3** — Rewrite `src/content/case-studies/elev8-fun.md` body with unique content.
- [ ] **T4.4** — Rewrite `src/content/case-studies/mountaineer-coffee.md` body with unique content.
- [ ] **T4.5** — Rewrite `src/content/case-studies/deals-in-dirt.md` body with unique content.
- [ ] **T4.6** — Rewrite `src/content/case-studies/harts-meat-market.md` body with unique content.
- [ ] **T4.7** — Run `npm run check:content` (frontmatter unchanged) and `npm run build` (pages still build).

### Phase 5 — Fix F6 (SVG cover art)

- [ ] **T5.1** — Create `src/components/CaseStudyCover.astro` — a deterministic SVG cover component. Props: `client: string`, `category: string`, `seed?: string`. Renders a 351×198 SVG with abstract shapes derived from a hash of the client name (for unique color palette + composition per case study) and the category (for iconography).
- [ ] **T5.2** — Create `src/components/ArticleCover.astro` — a parallel component for articles. Props: `title: string`, `category: string`. Renders a 351×250 SVG.
- [ ] **T5.3** — Update `src/components/home/RecentWork.astro` to render `<CaseStudyCover>` inside each carousel slide, replacing the CSS gradient.
- [ ] **T5.4** — Update `src/components/home/FeaturedArticles.astro` to render `<ArticleCover>` for each article card.
- [ ] **T5.5** — Update `src/pages/work/[slug].astro` and `src/pages/resources/[slug].astro` to render the cover at the top of the detail page.
- [ ] **T5.6** — Verify via `agent-browser eval` that each card now has a unique `<svg>` element.

### Phase 6 — Fix F9 (CI workflow)

- [ ] **T6.1** — Create `.github/workflows/ci.yml`:
  - Triggers: `push` to `main`, `pull_request` to `main`.
  - Steps: checkout, setup-node@v4 with `node-version: 22`, `npm install`, `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`.
  - Do NOT include Playwright in CI yet (browser binaries are heavy; defer to a future round).

### Phase 7 — Documentation

- [ ] **T7.1** — Update `README.md` changelog with round-5 entry. Update the "Testing Strategy" section to reflect Playwright addition. Update the "Verify Setup" table to include `npm run test:e2e`.
- [ ] **T7.2** — Update `AGENTS.md` with new commands (`npm run test:e2e`) and the new gotcha about `astro:after-swap` re-init (reference F1/F2/F3 as cautionary tales).
- [ ] **T7.3** — Update `CLAUDE.md` Testing Strategy section (was "No test runner configured" — now "Playwright for E2E; no unit test runner yet").
- [ ] **T7.4** — Add `docs/audit/REMEDIATION_PLAN_ROUND5.md` (this document).
- [ ] **T7.5** — Add `docs/audit/AUDIT_ROUND5_FINDINGS.md` — the standalone audit report from Task 5-b.

### Phase 8 — Final verification

- [ ] **T8.1** — Run full suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`, `npm run test:e2e`. All must pass.
- [ ] **T8.2** — E2E verify via `agent-browser` on local preview:
  - Mobile menu opens after View Transition (F1 fixed).
  - Headroom adds `is-scrolled` class after View Transition (F2 fixed).
  - Dropdown outside-click still works after multiple View Transitions (F3 fixed).
  - Case study cards have unique SVG covers (F6 fixed).
- [ ] **T8.3** — Run `npm audit` to confirm 0 vulnerabilities.

### Phase 9 — Commit + push

- [ ] **T9.1** — Commit in atomic units:
  - `test(e2e): add Playwright with regression tests for F1, F2, F3 (red)`
  - `fix(header): re-init mobile menu on astro:after-swap (F1, high)`
  - `fix(layout): re-init headroom on astro:after-swap (F2, medium)`
  - `fix(header): attach dropdown outside-click listener once, not per-swap (F3, medium)`
  - `fix(scripts): add 'anchor' to services schema in validate-content.mjs (F4, low)`
  - `content(case-studies): replace 6 templated bodies with unique client-specific content (F5)`
  - `feat(components): add CaseStudyCover + ArticleCover SVG components (F6)`
  - `ci: add GitHub Actions workflow for check + build + link/content checks (F9)`
  - `docs: update for round-5 remediation`
- [ ] **T9.2** — Push to `main` via SSH wrapper per `skills/how-to-git-push-using-ssh-wrapper`:
  - Verify `python3 -c "import paramiko"` works.
  - Verify `docs/ssh-key.txt` is the SSH private key.
  - Set `git remote set-url origin git@github.com:nordeim/astro-web.git` (if not already SSH).
  - `GIT_SSH_COMMAND="/home/z/my-project/astro-web/skills/how-to-git-push-using-ssh-wrapper/scripts/ssh_git_wrapper_v3.py -i /path/to/key -o StrictHostKeyChecking=accept-new" git push origin main`.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Playwright browser binary download fails in the sandbox | Install with `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium` (just one browser, not all 3) |
| F1 fix introduces a duplicate-listener bug (like F3) | Use `dataset.mobileMenuInit` flag for idempotency, mirror the existing `initDropdowns` pattern |
| F2 fix leaves the old scroll listener leaking | Use `dataset.headroomInit` flag — when set, skip re-attaching; OR explicitly remove the old listener before re-attaching |
| F5 case-study content invents facts that create misattribution risk (like R4-1) | Ground each case study in the client's publicly-known business (per the original kelp.agency descriptions); avoid inventing specific metrics, names, or quotes |
| F6 SVG covers look generic | Use a deterministic hash of the client name to vary palette + composition; manually verify each of the 9 covers looks distinct |
| Push fails with `Permission denied (publickey)` | Verify `docs/ssh-key.txt` is in OpenSSH format, `chmod 600`, and the public key is registered at github.com/settings/keys |
| Push fails with `Invalid command: 'git-receive-pack...` | The wrapper v3 already has the `shlex.join()` fix; if it still happens, use `shlex.split()` → `shlex.join()` normalization (per `how-to §D.5`) |

---

## Definition of Done

The remediation is complete when:

- [ ] All 🔴 Critical and 🟠 High tasks (F1, F6, F8) are resolved
- [ ] All 🟡 Medium tasks (F2, F3, F9) are resolved
- [ ] All 🟢 Low tasks (F4) are resolved
- [ ] F5 (Informational) content debt is resolved
- [ ] `npm run check` passes (0 errors, 0 hints)
- [ ] `npm run build` produces 21+ pages with 0 warnings
- [ ] `npm run check:links` reports 0 broken internal links
- [ ] `npm run check:content` reports 0 validation errors
- [ ] `npm run test:e2e` (Playwright) passes all 8 E2E specs
- [ ] `npm audit` reports 0 critical vulnerabilities
- [ ] Live site `https://astro.jesspete.shop/` (after deploy) confirms: mobile menu works after View Transition, headroom works after View Transition, case study cards have unique SVG covers
- [ ] All changes committed to `main` in atomic units and pushed via SSH wrapper

---

*End of round-5 remediation plan. Proceeding to execution.*
