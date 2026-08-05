# Audit Round 6 — Findings

> **Paired with:** `docs/audit/REMEDIATION_PLAN_ROUND6.md` (the fix plan + TDD execution log)
> **Date:** 2026-08-05
> **Auditor:** Mode C re-audit (round 6) + agent-browser E2E on live site
> **Scope:** Read-only systematic code audit of `/home/z/my-project/astro-web` focusing on what is genuinely outstanding after round 5, plus `agent-browser` E2E on the live `https://astro.jesspete.shop/` deployment.
> **Method:** Read-only. Cross-checked every candidate finding against `docs/audit/AUDIT_ROUND5_FINDINGS.md` + `docs/audit/REMEDIATION_PLAN_ROUND5.md` to avoid re-flagging fixed items. Re-validated against `skills/astro-7/SKILL.md` + `skills/astro-7-patterns/SKILL.md` + `skills/skills-catalog.md`.
> **Build state at audit time:** `npm run check` 0/0/0; `npm run build` 21 pages in 1.94s; `npm run check:links` 0 broken; `npm run check:content` 0 errors; `npm audit` 0 vulnerabilities. `npm_log.txt` shows a clean production deployment with zero warnings. Live site `https://astro.jesspete.shop/` verified via curl — all round-5 fixes (F1/F2/F3/F4/F5/F6/F8/F9) confirmed deployed.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 6 |
| Informational | 2 |
| **Total** | **11** |

**Round-5 fixes verified intact and live** on `https://astro.jesspete.shop/`:
- F1 mobile menu re-init — verified via agent-browser (menu opens after View Transition, focus moves to first link)
- F2 headroom re-init — verified via agent-browser (header gets `is-scrolled` + `headroom--unpinned` classes after View Transition + scroll)
- F3 dropdown outside-click — verified via source inspection (module-level listener)
- F4 validator schema — verified via `npm run check:content` (0 errors)
- F5 case-study content — verified via curl (unique bodies present)
- F6 SVG covers — verified via curl + agent-browser (all 9 carousel slides + 9 work-index cards + 3 article cards have unique SVG covers)
- F8 Playwright suite — 42/42 specs pass locally (before round-6 additions)
- F9 CI workflow — runs on every push/PR

**What this round found:** The round-5 fix pattern (idempotency flag on the *swapped* element) was applied correctly to prevent double-attachment to the *same* element, but it does NOT prevent listener leaks on the *persistent* `window`/`document` objects. The F3 fix correctly moved `document.addEventListener('click', …)` to module level because `document` persists across swaps — but the same treatment was NOT applied to three other listeners that attach to persistent objects inside the re-init functions. These are the same anti-pattern class as F3, missed because they were inside functions that round 5 newly extracted. Plus a contact-form UX gap found via live E2E, an a11y smell on the SVG covers, CI/test-suite gaps, and documentation drift.

---

## Findings (ordered by severity)

### R6-11 — Contact form submit causes form to disappear with no feedback (HIGH — found via live E2E)

- **Location:** `src/pages/contact.astro` line 52 (`<form method="POST" action="/contact/">`)
- **Description:** The contact form posts to `/contact/` (itself). Since this is a static site with no backend, the POST results in Astro's static server returning the page again. The form disappears (because the POST body is consumed but the page re-renders from scratch), with no error message, no success state, no indication of what happened. The user has no idea whether their submission was received.
- **Evidence (live site reproduction on https://astro.jesspete.shop/contact/):** Filled the form with valid data (name, email, message), clicked "Send Project Brief →". Result via agent-browser: `formStillVisible: false`, `anyErrorMessage: null`, URL stays at `/contact/`. The form just vanishes.
- **Impact:** Any user who fills out the contact form and submits it gets zero feedback. They may re-submit (thinking it failed) or leave the site (thinking it didn't work). For a marketing site whose primary conversion goal is the contact form, this is a significant UX failure. AGENTS.md and CLAUDE.md both document the form as "a stub HTML form with no backend" — but the stub should at minimum show a "this form is not yet wired up" message on submit, not silently fail.
- **Skill rule violated:** `[astro-7 §3119]` (Forms section — progressive enhancement, success/error states) and `[astro-7-patterns §15]` (anti-slop — "never leave placeholder values in final deliverables").
- **Severity:** High (conversion-critical UX failure on a deployed marketing site)
- **Recommended fix:** Add a small inline `<script>` that intercepts the form submit, calls `e.preventDefault()`, and shows a `aria-live="polite"` message: "This form is a demo and doesn't submit anywhere. Email info@kelp.agency directly." Hides the form, shows the message.
- **Confidence:** Verified (live reproduction on `https://astro.jesspete.shop/contact/`)

### R6-1 — `initHeadroom()` scroll listener leaks on `window` across View Transitions (MEDIUM)

- **Location:** `src/layouts/BaseLayout.astro` lines 166–208 (the `initHeadroom` function), specifically line 206: `window.addEventListener('scroll', onScroll, { passive: true });`
- **Description:** Round 5 extracted the headroom init into `initHeadroom()` and added an idempotency guard via `header.dataset.headroomInit = 'true'` (lines 170–171). The function is called on initial load AND on `astro:after-swap` (line 218–221). The guard prevents re-attaching a scroll listener to the *same* header element. **But the guard is on the header element, which is REPLACED on every View Transition.** The new header has no `dataset.headroomInit` flag, so `initHeadroom()` runs past the guard and attaches a NEW `scroll` listener to `window`. The OLD listener is still on `window` (which persists across swaps), capturing the OLD (now-detached) header in its closure. After N view transitions, there are N+1 scroll listeners on `window`, each firing on every scroll event, each mutating a different (mostly detached) header element.
- **Evidence (live site verification):** Navigated 5 times via View Transitions on `https://astro.jesspete.shop/`. Heap grew from 1,465,036 bytes → 1,573,201 bytes (~108KB delta). Small but real — the OLD header elements + their closures are retained.
- **Evidence (source inspection):** Grep for `removeEventListener` across `src/`: **0 matches**. The old scroll listener is never removed.
- **Impact:** After 10 navigations, 11 scroll listeners fire on every scroll event. Each does a `window.scrollY` read + 2–4 `classList.add/remove` calls on a detached element. Scroll events fire at ~60Hz during active scrolling. On a low-end mobile device, this could cause visible jank after extended navigation. The visible behavior is correct (the NEW header gets the right classes because the NEW listener mutates it), so there is no functional bug — only a performance/memory leak. The OLD detached header elements are also retained in memory (held by the listener closures), preventing GC.
- **Skill rule violated:** `[astro-7-patterns §3]` (re-init pattern) and `[astro-7-patterns §15]` (cleanup of persistent-object listeners). The F3 finding in `AUDIT_ROUND5_FINDINGS.md` explicitly called out this exact class: "the document-level listener should be attached once, not inside the per-swap re-init function." The same logic applies to `window`-level listeners.
- **Severity:** Medium (no functional bug; CPU + memory leak that scales with navigation count on a high-frequency event)
- **Recommended fix:** Move the scroll listener to module level (mirrors the F3 fix for the dropdown outside-click). Re-query `.site-header` inside the handler. The `lastScroll` state and the `threshold` constant move to module scope. The `initHeadroom()` function then becomes unnecessary (or reduces to just calling `onScroll()` once to set the initial class state).
- **Confidence:** Verified (source inspection + live heap measurement)

### R6-2 — CI workflow does not run the Playwright E2E regression suite (MEDIUM)

- **Location:** `.github/workflows/ci.yml` lines 10–14 (the comment block) and lines 44–67 (the `verify` job steps — no `npm run test:e2e` step)
- **Description:** Round 5 added a 42-spec Playwright suite (`tests/*.spec.ts`) specifically to catch the F1/F2/F3 View Transitions re-init regressions. The suite is wired as `npm run test:e2e` in `package.json`. However, the CI workflow at `.github/workflows/ci.yml` did NOT run `npm run test:e2e`. The comment at lines 10–14 explicitly excluded it.
- **Impact:** The F1/F2/F3 regression tests — the entire reason round 5 added the Playwright suite — did not gate pushes to `main`. A developer could re-introduce the F1 mobile-menu bug (or the F2 headroom bug, or the R6-1 scroll-leak bug above) and CI would pass green. The regression tests were only useful for local development, not for preventing re-introduction.
- **Severity:** Medium (the F1/F2/F3 regression net exists but is not enforced; a future regression could ship to production)
- **Recommended fix:** Add a separate `e2e` job to `ci.yml` with `actions/cache` for `~/.cache/playwright`, `npx playwright install --with-deps chromium`, and `npm run test:e2e`. Runs in parallel with the `verify` job.
- **Confidence:** Verified

### R6-3 — `initMobileMenu()` Escape keydown listener leaks on `document` across View Transitions (LOW)

- **Location:** `src/components/Header.astro` lines 191–195 (inside `initMobileMenu()`)
- **Description:** Same anti-pattern class as R6-1 and the round-5 F3 finding. The Escape keydown listener was attached to `document` INSIDE `initMobileMenu()`, after the idempotency guard on the toggle element. After N swaps, N+1 Escape listeners on `document`.
- **Severity:** Low (memory leak only; no CPU impact on a high-frequency event; no visible bug)
- **Recommended fix:** Move the Escape keydown listener OUT of `initMobileMenu()` to module level (mirrors the F3 fix exactly). Re-query the toggle inside the handler.
- **Confidence:** Verified

### R6-4 — `initScrollReveal()` IntersectionObserver leaks across View Transitions (LOW)

- **Location:** `src/layouts/BaseLayout.astro` lines 141–156 (the `initScrollReveal` function)
- **Description:** Each call to `initScrollReveal()` created a NEW `IntersectionObserver` and observed all `[data-reveal]` elements. No idempotency guard and no `disconnect()` call on the previous observer. After N swaps, N+1 IntersectionObservers exist, each holding references to detached elements.
- **Evidence (source inspection):** Grep for `disconnect()` across `src/`: **0 matches**.
- **Severity:** Low (memory leak only; no CPU impact; no visible bug)
- **Recommended fix:** Store the observer in a module-level variable and `disconnect()` it before creating a new one.
- **Confidence:** Verified

### R6-5 — SVG cover art exposes redundant `role="img"` + `<title>` next to visible heading text (LOW)

- **Location:** `src/components/CaseStudyCover.astro` lines 103–112 and `src/components/ArticleCover.astro` lines 73–82
- **Description:** Round 5 added `role="img"` + `aria-labelledby` + `<title>` + `<desc>` to the SVG cover components. However, the covers are rendered ALONGSIDE visible heading text in every consumption site. The cover SVGs are **decorative** — the same information (title, category) is already present as visible text. Per WCAG 2.2 SC 1.1.1, decorative images should be hidden from AT to avoid redundant announcements. The current implementation causes screen readers to announce the title/category twice (once from the SVG `<title>`, once from the visible heading). On the RecentWork carousel, each slide's `aria-label="Slide N of 9: {title}"` adds a THIRD announcement.
- **Evidence (consistency check):** Every other decorative SVG in `src/` uses `aria-hidden="true"`: Header chevron, hamburger icon, HeroWave, Testimonials leaf SVG. The cover SVGs were the **only** decorative images in `src/` that used `role="img"` instead of `aria-hidden="true"`.
- **Severity:** Low (verbose AT output, not a barrier)
- **Recommended fix:** Mark the SVGs `aria-hidden="true"` and remove `role="img"` / `aria-labelledby` / `<title>` / `<desc>`. Matches the pattern used by every other decorative SVG in the codebase.
- **Confidence:** Verified

### R6-6 — CLAUDE.md has multiple stale claims that contradict the round-5 state (LOW)

- **Location:** `CLAUDE.md` lines 7, 19, 25, 34
- **Description:** Four stale claims:
  1. Line 7: "17 static pages" — should be 21.
  2. Line 19: "Run `npm run check` (this is the only verification step — no tests/lint/format exist)" — contradicts the same file's Testing Strategy section.
  3. Line 25: "Only `RecentWork.astro` (carousel), `Header.astro` (mobile menu), and the scroll-reveal script in `BaseLayout.astro` ship JS" — missing dropdown menus and headroom script.
  4. Line 34: "The Header dropdown script, mobile menu script, and carousel init script all follow this pattern" — doesn't mention headroom.
- **Severity:** Low (documentation inaccuracy; could mislead an agent)
- **Recommended fix:** Update the four lines.
- **Confidence:** Verified

### R6-7 — README.md "only a carousel and mobile menu opt in" understates the JS surface (LOW)

- **Location:** `README.md` line 23 (Overview section)
- **Description:** The Overview said: "The whole site ships zero JavaScript by default (only a carousel and mobile menu opt in)". This was accurate at initial build but was stale. The actual JS-shipping components are: carousel, mobile menu, dropdown menus, scroll-reveal + headroom. `AGENTS.md` line 37 correctly listed all four; `README.md` line 23 listed only two.
- **Severity:** Low (documentation drift)
- **Recommended fix:** Update line 23.
- **Confidence:** Verified

### R6-8 — Playwright test suite has coverage gaps (LOW)

- **Location:** `tests/dropdowns.spec.ts`, `tests/carousel.spec.ts`, `tests/headroom.spec.ts`
- **Description:** Four specific gaps:
  1. Dropdown click-toggle behavior was untested (test name said "toggles aria-expanded on click" but only hovered).
  2. Carousel ArrowLeft keyboard nav was untested.
  3. Headroom scroll-up→pinned cycle was untested.
  4. No test for listener leaks (R6-1, R6-3, R6-4).
- **Severity:** Low (the behaviors were exercised manually via agent-browser but not codified as automated regression tests)
- **Recommended fix:** Add the missing tests + a side-effect-based listener-leak test.
- **Confidence:** Verified

### R6-9 — Playwright `test.use({ viewport })` overrides make 9 of 42 test runs redundant (INFORMATIONAL)

- **Location:** `tests/mobile-menu.spec.ts` line 21, `tests/dropdowns.spec.ts` line 26, `playwright.config.ts` lines 32–44
- **Description:** `mobile-menu.spec.ts` always ran at 390×844 on BOTH projects (5 redundant runs); `dropdowns.spec.ts` always ran at 1280×800 on BOTH projects (4 redundant runs). Total: 9 redundant runs (~21% of suite time).
- **Severity:** Informational (test efficiency, not a bug)
- **Recommended fix:** Use project-level `testMatch`/`testIgnore` to scope mobile-menu specs to `mobile-chrome` and dropdown specs to `desktop-chrome`. Remove `test.use({ viewport })` overrides.
- **Confidence:** Reasoned (Playwright behavior per docs)

### R6-10 — CI runs `check:content` sequentially after `check:links`, but they could run in parallel (INFORMATIONAL)

- **Location:** `.github/workflows/ci.yml` lines 63–67
- **Description:** `check:content` reads `src/content/` directly (no build dependency) but ran sequentially after `check:links` (which depends on `build`).
- **Severity:** Informational (CI efficiency; ~2–3s waste per run)
- **Recommended fix:** Optional judgment call — split into two jobs or leave as-is for simplicity.
- **Confidence:** Verified

---

## Clean dimensions (no findings)

The following areas were re-verified and remain clean after round 5:

1. **Round-5 F1 fix (mobile menu re-init)** — `initMobileMenu()` structurally correct: idempotent via `dataset.mobileMenuInit`, re-queries toggle/menu on every call, called on load + `astro:after-swap`. The close-on-swap handler is correctly at module level. (The Escape listener leak is R6-3 above, a separate concern.)

2. **Round-5 F2 fix (headroom re-init)** — `initHeadroom()` structurally correct: idempotent via `dataset.headroomInit`, re-queries `.site-header` on every call. The visible behavior works. (The scroll listener leak is R6-1 above, a separate concern.)

3. **Round-5 F3 fix (dropdown outside-click)** — Correctly moved `document.addEventListener('click', …)` to module level. Per-trigger listeners in `initDropdowns()` are idempotent via `dataset.dropdownInit`. No leak. This is the model fix that R6-1/R6-3 should follow.

4. **Round-5 F4 fix (validator schema)** — `'anchor'` is in the `required` array for the services schema. Verified against `src/content.config.ts`. No drift.

5. **Round-5 F5 fix (case-study content)** — Not re-audited in detail (content quality, not code). The round-5 worklog confirms 6 templated bodies were replaced.

6. **Round-5 F6 fix (SVG covers)** — `CaseStudyCover.astro` and `ArticleCover.astro` are well-structured: deterministic hash → palette + layout, category-specific iconography, proper SVG namespace. No XSS risk. The a11y concern (R6-5) is about the `role="img"` choice, not the SVG structure.

7. **Round-5 F8 fix (Playwright suite)** — 5 spec files, 21 specs, 42 runs across 2 projects. `playwright.config.ts` correctly configured. The suite covers F1/F2/F3 regressions. (Coverage gaps in R6-8 above are incremental improvements.)

8. **Round-5 F9 fix (CI workflow)** — `.github/workflows/ci.yml` is well-structured: `concurrency: cancel-in-progress: true`, `permissions: contents: read`, `cache: 'npm'`, Node 22, all four static checks. The gap was R6-2 (no Playwright in CI).

9. **Build & deployment** — `npm_log.txt` shows a clean production build: 21 pages in 1.94s, sitemap generated, 0 warnings, 0 errors. No deprecation notices. No security advisories.

10. **Security** — No new `set:html` usages added in round 5. The SVG cover components interpolate text via `{}` (auto-escaped). The `glyph` strings are hardcoded path data, not user input. No new attack surface.

11. **`astro-7` / `astro-7-patterns` skill compliance** — Re-verified against §3 (re-init pattern — structurally correct, with the leak caveats above), §5 (headroom — `{ passive: true }` present), §6 (carousel — idempotent via `dataset.carouselInit`), §7 (mobile menu a11y — all 11 checklist items met), §12 (dataset idempotency), §15 (anti-patterns — none newly introduced), §16 (dep guard), §17 (JSON-LD).

---

## Cross-check against round-5 audit

| Round-5 finding | Status at round 6 | Notes |
|-----------------|-------------------|-------|
| F1 (mobile menu re-init) | ✅ Fix intact, verified | `initMobileMenu()` structurally correct. R6-3 (Escape leak) is a NEW finding in the same function, not a regression of F1. |
| F2 (headroom re-init) | ✅ Fix intact, verified | `initHeadroom()` structurally correct. R6-1 (scroll leak) is a NEW finding in the same function, not a regression of F2. |
| F3 (dropdown outside-click leak) | ✅ Fix intact, verified | Outside-click moved to module level. No regression. R6-1/R6-3 are the SAME anti-pattern class but in DIFFERENT functions. |
| F4 (validator `anchor` field) | ✅ Fix intact, verified | `anchor` in `required` array. No drift. |
| F5 (templated case-study bodies) | ✅ Fix intact (not re-audited in detail) | Out of scope for code audit. |
| F6 (portfolio imagery) | ✅ Fix intact, verified | SVG covers render correctly. R6-5 (a11y) is a refinement, not a regression. |
| F8 (testing infra) | ✅ Fix intact, verified | 42 specs pass. R6-8 (coverage gaps) is incremental. |
| F9 (CI workflow) | ✅ Fix intact, verified | Workflow runs all static checks. R6-2 (no Playwright in CI) was the outstanding gap. |

**None of the 11 round-6 findings are regressions of round-5 fixes.** All 11 are new findings — 3 are subtle bugs introduced BY the round-5 fix pattern (R6-1, R6-3, R6-4 — the idempotency-flag-on-swapped-element approach doesn't prevent listener leaks on persistent `window`/`document`), 1 is an a11y smell introduced by the round-5 SVG covers (R6-5), 1 is a contact-form UX gap found via live E2E (R6-11), 2 are CI/test-suite gaps that round 5 acknowledged but deferred (R6-2, R6-8), and 4 are documentation/efficiency items (R6-6, R6-7, R6-9, R6-10).

---

*End of round-6 audit findings. The remediation plan + TDD execution log is in `docs/audit/REMEDIATION_PLAN_ROUND6.md`.*
