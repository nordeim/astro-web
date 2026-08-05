# Remediation Plan — Round 6 (Listener Leaks + SVG A11y + Contact Form UX + CI E2E + Docs)

> **Paired with:** `docs/audit/AUDIT_ROUND5_FINDINGS.md` + `docs/audit/REMEDIATION_PLAN_ROUND5.md` (round 5), and earlier rounds.
> **Date:** 2026-08-05
> **Trigger:** Round-6 Mode C re-audit (Task 5-round6) + `agent-browser` E2E on the live `https://astro.jesspete.shop/` deployment (which now has all round-5 fixes live, verified via curl).
> **Operating mode:** Mode C (Audit) → Mode B (Debug) → Mode A (Generation), per the parent system prompt's Section 2.

---

## Summary

| Source | Findings | Critical | High | Medium | Low | Info |
|--------|----------|----------|------|--------|-----|------|
| Round-6 code audit (Task 5-round6) | 10 | 0 | 0 | 2 | 6 | 2 |
| Round-6 agent-browser E2E (live site) | 1 new | 0 | 1 | 0 | 0 | 0 |
| **Genuinely outstanding** | **11** | **0** | **1** | **2** | **6** | **2** |

**Round-5 fixes verified intact and live** on `https://astro.jesspete.shop/`:
- F1 mobile menu re-init — verified via agent-browser (menu opens after View Transition, focus moves to first link)
- F2 headroom re-init — verified via agent-browser (header gets `is-scrolled` + `headroom--unpinned` classes after View Transition + scroll)
- F3 dropdown outside-click — verified via source inspection (module-level listener)
- F4 validator schema — verified via `npm run check:content` (0 errors)
- F5 case-study content — verified via curl (unique bodies present)
- F6 SVG covers — verified via curl + agent-browser (all 9 carousel slides + 9 work-index cards + 3 article cards have unique SVG covers with `<title>`)
- F8 Playwright suite — 42/42 specs pass locally
- F9 CI workflow — runs on every push/PR

**What this round addresses:** The round-5 fix pattern (idempotency flag on the *swapped* element) was applied correctly to prevent double-attachment to the *same* element, but it does NOT prevent listener leaks on the *persistent* `window`/`document` objects. The F3 fix correctly moved `document.addEventListener('click', …)` to module level because `document` persists across swaps — but the same treatment was NOT applied to three other listeners that attach to persistent objects inside the re-init functions. These are the same anti-pattern class as F3, missed because they were inside functions that round 5 newly extracted. Plus a contact-form UX gap found via live E2E, an a11y smell on the SVG covers, CI/test-suite gaps, and documentation drift.

---

## Validated Outstanding Findings

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
- **Description:** Round 5 added a 42-spec Playwright suite (`tests/*.spec.ts`) specifically to catch the F1/F2/F3 View Transitions re-init regressions. The suite is wired as `npm run test:e2e` in `package.json`. However, the CI workflow at `.github/workflows/ci.yml` does NOT run `npm run test:e2e`. The comment at lines 10–14 explicitly excludes it.
- **Impact:** The F1/F2/F3 regression tests — the entire reason round 5 added the Playwright suite — do not gate pushes to `main`. A developer could re-introduce the F1 mobile-menu bug (or the F2 headroom bug, or the R6-1 scroll-leak bug above) and CI would pass green. The regression tests are only useful for local development, not for preventing re-introduction.
- **Skill rule referenced:** `[astro-7-patterns §19/§20]` (pre-build + post-build checklists assume CI catches regressions) and `[astro-7-patterns §16]` (pre-build dep guard philosophy: fail fast, fail in CI, not in production).
- **Severity:** Medium (the F1/F2/F3 regression net exists but is not enforced; a future regression could ship to production)
- **Recommended fix:** Add a separate `e2e` job to `ci.yml` that:
  1. Uses `actions/cache@v4` to cache `~/.cache/playwright` (key: `${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}`)
  2. Runs `npx playwright install --with-deps chromium` (only Chromium, not all browsers — matches the two projects in `playwright.config.ts`)
  3. Runs `npm run test:e2e`
  4. Uploads the Playwright HTML report as an artifact on failure
  The job can run in parallel with the existing `verify` job to avoid blocking on the browser download.
- **Confidence:** Verified

### R6-3 — `initMobileMenu()` Escape keydown listener leaks on `document` across View Transitions (LOW)

- **Location:** `src/components/Header.astro` lines 191–195 (inside `initMobileMenu()`)
- **Description:** Same anti-pattern class as R6-1 and the round-5 F3 finding. The Escape keydown listener is attached to `document` INSIDE `initMobileMenu()`, after the idempotency guard on the toggle element. The guard prevents re-attaching to the *same* toggle, but on View Transition the NEW toggle is a fresh element (no `dataset.mobileMenuInit` flag), so `initMobileMenu()` runs past the guard and attaches a NEW keydown listener to `document` (which persists across swaps). The OLD listener is still on `document`, capturing the OLD toggle/menu in its closure. After N swaps, N+1 Escape listeners on `document`.
- **Impact:** After N navigations, N+1 Escape listeners on `document`. Each fires on every Escape keypress. The OLD ones check the OLD (detached) toggle's `aria-expanded`, which is `'false'` (set by the close-on-swap handler), so `closeMenu()` is NOT called on the detached elements. No visible bug. Memory leak only — the OLD toggle/menu elements are retained in memory by the listener closures. Escape fires infrequently (only when the user presses it), so the CPU impact is negligible compared to R6-1.
- **Severity:** Low (memory leak only; no CPU impact on a high-frequency event; no visible bug)
- **Recommended fix:** Move the Escape keydown listener OUT of `initMobileMenu()` to module level (mirrors the F3 fix exactly). Re-query the toggle inside the handler.
- **Confidence:** Verified

### R6-4 — `initScrollReveal()` IntersectionObserver leaks across View Transitions (LOW)

- **Location:** `src/layouts/BaseLayout.astro` lines 141–156 (the `initScrollReveal` function)
- **Description:** Each call to `initScrollReveal()` creates a NEW `IntersectionObserver` and observes all `[data-reveal]` elements. The function is called on initial load AND on `astro:after-swap` (line 218–221). There is no idempotency guard and no `disconnect()` call on the previous observer. After N swaps, N+1 IntersectionObservers exist. The OLD observers are still observing the OLD (detached) `[data-reveal]` elements. Since the OLD elements are detached, the observers never fire callbacks (no intersection with the viewport), so there is no CPU impact — only a memory leak.
- **Evidence (source inspection):** Grep for `disconnect()` across `src/`: **0 matches**.
- **Impact:** After N navigations, N+1 IntersectionObservers exist, each holding references to its observed (detached) elements, preventing GC of the detached `[data-reveal]` elements. No CPU impact (observers on detached elements don't fire). No visible bug. Memory leak only.
- **Severity:** Low (memory leak only; no CPU impact; no visible bug)
- **Recommended fix:** Store the observer in a module-level variable and disconnect it before creating a new one.
- **Confidence:** Verified

### R6-5 — SVG cover art exposes redundant `role="img"` + `<title>` next to visible heading text (LOW)

- **Location:** `src/components/CaseStudyCover.astro` lines 103–112 and `src/components/ArticleCover.astro` lines 73–82
- **Description:** Round 5 added `role="img"` + `aria-labelledby` + `<title>` + `<desc>` to the SVG cover components. However, the covers are rendered ALONGSIDE visible heading text in every consumption site (RecentWork, work/index, work/[slug], resources/[slug]). The cover SVGs are **decorative** — the same information (title, category) is already present as visible text. Per WCAG 2.2 SC 1.1.1, decorative images should be hidden from AT to avoid redundant announcements. The current implementation causes screen readers to announce the title/category twice (once from the SVG `<title>`, once from the visible heading). On the RecentWork carousel, each slide's `aria-label="Slide N of 9: {title}"` adds a THIRD announcement.
- **Evidence (consistency check):** Every other decorative SVG in `src/` uses `aria-hidden="true"`:
  - `src/components/Header.astro` line 79 (dropdown chevron)
  - `src/components/Header.astro` line 113 (hamburger icon)
  - `src/components/home/HeroWave.astro` line 28
  - `src/components/home/Testimonials.astro` line 26
  The cover SVGs are the **only** decorative images in `src/` that use `role="img"` instead of `aria-hidden="true"`.
- **Impact:** Screen reader users hear the case study title and category announced twice per card. On the RecentWork carousel, each slide's `aria-label` adds a THIRD announcement. Verbose AT output, not a barrier.
- **Severity:** Low (verbose AT output, not a barrier)
- **Recommended fix:** Mark the SVGs `aria-hidden="true"` and remove `role="img"` / `aria-labelledby` / `<title>` / `<desc>`. This matches the pattern used by every other decorative SVG in the codebase.
- **Confidence:** Verified

### R6-6 — CLAUDE.md has multiple stale claims that contradict the round-5 state (LOW)

- **Location:** `CLAUDE.md` lines 7, 19, 25, 34
- **Description:** Four stale claims:
  1. Line 7: "17 static pages" — should be 21.
  2. Line 19: "Run `npm run check` (this is the only verification step — no tests/lint/format exist)" — contradicts the same file's Testing Strategy section which documents `check:links`, `check:content`, `test:e2e`.
  3. Line 25: "Only `RecentWork.astro` (carousel), `Header.astro` (mobile menu), and the scroll-reveal script in `BaseLayout.astro` ship JS" — missing dropdown menus and headroom script.
  4. Line 34: "The Header dropdown script, mobile menu script, and carousel init script all follow this pattern" — doesn't mention headroom.
- **Severity:** Low (documentation inaccuracy; could mislead an agent)
- **Recommended fix:** Update the four lines.
- **Confidence:** Verified

### R6-7 — README.md "only a carousel and mobile menu opt in" understates the JS surface (LOW)

- **Location:** `README.md` line 23 (Overview section)
- **Description:** The Overview says: "The whole site ships zero JavaScript by default (only a carousel and mobile menu opt in)". This was accurate at initial build but is now stale. The actual JS-shipping components are: carousel, mobile menu, dropdown menus, scroll-reveal + headroom. `AGENTS.md` line 37 correctly lists all four; `README.md` line 23 lists only two.
- **Severity:** Low (documentation drift)
- **Recommended fix:** Update line 23.
- **Confidence:** Verified

### R6-8 — Playwright test suite has coverage gaps (LOW)

- **Location:** `tests/dropdowns.spec.ts`, `tests/carousel.spec.ts`, `tests/headroom.spec.ts`
- **Description:** Four specific gaps:
  1. Dropdown click-toggle behavior is untested (test name says "toggles aria-expanded on click" but only hovers).
  2. Carousel ArrowLeft keyboard nav is untested.
  3. Headroom scroll-up→pinned cycle is untested.
  4. No test for listener leaks (R6-1, R6-3, R6-4).
- **Severity:** Low (the behaviors are exercised manually via agent-browser but not codified as automated regression tests)
- **Recommended fix:** Add the missing tests + a side-effect-based listener-leak test.
- **Confidence:** Verified

### R6-11 — Contact form submit causes form to disappear with no feedback (HIGH — found via live E2E)

- **Location:** `src/pages/contact.astro` line 52 (`<form method="POST" action="/contact/">`)
- **Description:** The contact form posts to `/contact/` (itself). Since this is a static site with no backend, the POST results in Astro's static server returning the page again. The form disappears (because the POST body is consumed but the page re-renders from scratch), with no error message, no success state, no indication of what happened. The user has no idea whether their submission was received.
- **Evidence (live site reproduction):** Filled the form on `https://astro.jesspete.shop/contact/` with valid data (name, email, message), clicked "Send Project Brief →". Result: `formStillVisible: false`, `anyErrorMessage: null`, URL stays at `/contact/`. The form just vanishes.
- **Impact:** Any user who fills out the contact form and submits it gets zero feedback. They may re-submit (thinking it failed) or leave the site (thinking it didn't work). For a marketing site whose primary conversion goal is the contact form, this is a significant UX failure. AGENTS.md and CLAUDE.md both document the form as "a stub HTML form with no backend" — but the stub should at minimum show a "this form is not yet wired up" message on submit, not silently fail.
- **Skill rule violated:** `[astro-7 §3119]` (Forms section — progressive enhancement, success/error states) and `[astro-7-patterns §15]` (anti-slop — "never leave placeholder values in final deliverables").
- **Severity:** High (conversion-critical UX failure on a deployed marketing site)
- **Recommended fix:** Two options:
  1. **Minimal (no backend):** Add a small inline `<script>` that intercepts the form submit, calls `e.preventDefault()`, and shows a `aria-live="polite"` message: "This form is a demo and doesn't submit anywhere. Email info@kelp.agency directly." Hides the form, shows the message.
  2. **Better (wire to Formspree):** Set `action="https://formspree.io/f/YOUR_ID"` on the `<form>` element. The user must register a Formspree ID and add it as an env var. This is documented in README.md as the recommended path.
  Option 1 is the ethical choice for a demo clone (no fake submission endpoint, no implied functionality that doesn't exist). It also doesn't require any backend or third-party account.
- **Confidence:** Verified (live reproduction on `https://astro.jesspete.shop/contact/`)

### R6-9 — Playwright `test.use({ viewport })` overrides make 9 of 42 test runs redundant (INFORMATIONAL)

- **Location:** `tests/mobile-menu.spec.ts` line 21, `tests/dropdowns.spec.ts` line 26, `playwright.config.ts` lines 32–44
- **Description:** `mobile-menu.spec.ts` always runs at 390×844 on BOTH projects (5 redundant runs); `dropdowns.spec.ts` always runs at 1280×800 on BOTH projects (4 redundant runs). Total: 9 redundant runs (~21% of suite time).
- **Severity:** Informational (test efficiency, not a bug)
- **Recommended fix:** Use project-level `testMatch`/`testIgnore` to scope mobile-menu specs to `mobile-chrome` and dropdown specs to `desktop-chrome`. Remove `test.use({ viewport })` overrides.
- **Confidence:** Reasoned (Playwright behavior per docs)

### R6-10 — CI runs `check:content` sequentially after `check:links`, but they could run in parallel (INFORMATIONAL)

- **Location:** `.github/workflows/ci.yml` lines 63–67
- **Description:** `check:content` reads `src/content/` directly (no build dependency) but runs sequentially after `check:links` (which depends on `build`).
- **Severity:** Informational (CI efficiency; ~2–3s waste per run)
- **Recommended fix:** Optional judgment call — split into two jobs or leave as-is for simplicity.
- **Confidence:** Verified

---

## Plan vs. Codebase Alignment (Pre-execution validation)

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| R6-1 scroll listener leak | `src/layouts/BaseLayout.astro` lines 166–221; F3 fix pattern in `src/components/Header.astro` lines 268–278 (module-level document listener); live heap measurement | ✅ |
| R6-2 Playwright in CI | `.github/workflows/ci.yml`; `playwright.config.ts`; `package.json` (`test:e2e` script) | ✅ |
| R6-3 Escape listener leak | `src/components/Header.astro` lines 191–195; F3 fix pattern at lines 268–278 | ✅ |
| R6-4 IntersectionObserver leak | `src/layouts/BaseLayout.astro` lines 141–156; grep for `disconnect()` returns 0 | ✅ |
| R6-5 SVG cover a11y | `src/components/CaseStudyCover.astro` lines 103–112; `src/components/ArticleCover.astro` lines 73–82; consistency check against all other decorative SVGs | ✅ |
| R6-6 CLAUDE.md drift | `CLAUDE.md` lines 7, 19, 25, 34; `AGENTS.md` line 37 (correct reference); `npm_log.txt` line 58 (21 pages) | ✅ |
| R6-7 README.md drift | `README.md` line 23; `AGENTS.md` line 37 (correct reference) | ✅ |
| R6-8 test coverage gaps | `tests/dropdowns.spec.ts` lines 28–45; `tests/carousel.spec.ts` (no ArrowLeft test); `tests/headroom.spec.ts` (no scroll-up test) | ✅ |
| R6-11 contact form UX | `src/pages/contact.astro` line 52; live reproduction on `https://astro.jesspete.shop/contact/` | ✅ |

---

## TDD Strategy

Per the parent system prompt's Section 10 (Testing & Validation) and Mode B (Debugging) Section 11:

1. **R6-1, R6-3, R6-4 (listener leaks):** Write a Playwright side-effect-based test FIRST (red): navigate N times, then trigger the event (scroll / Escape / IntersectionObserver callback), and verify the side-effect happens exactly once (not N+1 times). The test instruments `window`/`document` with a counter via `page.evaluate()`. Then apply the fix (move listeners to module level, disconnect old observers). Re-run the test to confirm green.

2. **R6-5 (SVG cover a11y):** No automated test needed — the fix is a one-line change per component (`aria-hidden="true"` + remove `role`/`title`/`desc`). Verify via `agent-browser eval` that the SVGs no longer have `role="img"`.

3. **R6-11 (contact form UX):** Write a Playwright test FIRST (red): fill the form, submit, verify a feedback message appears. The test will fail before the fix (form disappears, no message). Apply the fix (inline `<script>` + `aria-live` message). Re-run the test to confirm green.

4. **R6-2 (Playwright in CI):** Add the `e2e` job to `ci.yml`. Verify locally with `act` (if available) or by pushing a test commit and watching the Actions tab. (The user's environment may not have `act`; we'll verify the YAML syntax via `yamllint` or `python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`.)

5. **R6-6, R6-7 (documentation drift):** Direct edits. No test needed.

6. **R6-8 (test coverage gaps):** Add the missing tests. They should pass immediately (the behaviors already work — we're just codifying them as regression tests).

7. **R6-9 (test efficiency):** Update `playwright.config.ts` to scope projects. Verify the suite still passes with fewer runs.

---

## ToDo List (Execution Order)

### Phase 1 — Listener leak fixes (R6-1, R6-3, R6-4) via TDD

- [ ] **T1.1** — Write `tests/listener-leaks.spec.ts` with side-effect-based tests:
  - Navigate 5 times via View Transitions, then scroll once. Verify a single scroll produces exactly one mutation on the live header (not 6).
  - Navigate 5 times, then press Escape. Verify the menu's `closeMenu` is called exactly once (instrument via `window.__closeMenuCalls` counter).
  - Navigate 5 times, then trigger an IntersectionObserver callback. Verify each `[data-reveal]` element gets `is-visible` exactly once.
  - Tests will FAIL (red) because the leaks cause N+1 side-effects.
- [ ] **T1.2 (R6-1)** — Refactor `src/layouts/BaseLayout.astro`:
  - Move `window.addEventListener('scroll', onScroll, { passive: true })` to module level (NOT inside `initHeadroom()`).
  - Move `lastScroll` and `threshold` to module scope.
  - `onScroll` re-queries `.site-header` inside the handler.
  - `initHeadroom()` reduces to just calling `onScroll()` once to set the initial class state (or is removed entirely).
- [ ] **T1.3 (R6-3)** — Refactor `src/components/Header.astro`:
  - Move the Escape keydown listener OUT of `initMobileMenu()` to module level.
  - Re-query the toggle inside the handler. If `aria-expanded === 'true'`, re-query the menu and call `closeMenu` (also re-queried, or extracted as a module-level function).
- [ ] **T1.4 (R6-4)** — Refactor `src/layouts/BaseLayout.astro`:
  - Add a module-level `let revealObserver: IntersectionObserver | null = null;`
  - In `initScrollReveal()`, call `revealObserver?.disconnect()` before creating a new one.
- [ ] **T1.5** — Run `npx playwright test tests/listener-leaks.spec.ts` to confirm green.
- [ ] **T1.6** — Run full Playwright suite + `npm run check` + `npm run build` to confirm no regressions.

### Phase 2 — SVG cover a11y (R6-5) + contact form UX (R6-11)

- [ ] **T2.1 (R6-5)** — In `src/components/CaseStudyCover.astro`:
  - Remove `role="img"`, `aria-labelledby`, `<title>`, `<desc>`.
  - Add `aria-hidden="true"` to the `<svg>`.
- [ ] **T2.2 (R6-5)** — In `src/components/ArticleCover.astro`: same changes.
- [ ] **T2.3 (R6-11)** — Write `tests/contact-form.spec.ts` (red):
  - Fill the form with valid data, submit, verify a feedback message appears with `aria-live="polite"`.
  - Test will FAIL (form disappears, no message).
- [ ] **T2.4 (R6-11)** — Refactor `src/pages/contact.astro`:
  - Add an inline `<script>` that intercepts the form submit, calls `e.preventDefault()`, hides the form, and shows a `aria-live="polite"` message: "This form is a demo and doesn't submit anywhere. Email info@kelp.agency directly, or schedule a discovery call."
  - The message div is initially `hidden`, shown on submit.
  - The script must re-init on `astro:after-swap` (per the round-5 lesson).
- [ ] **T2.5** — Run `npx playwright test tests/contact-form.spec.ts` to confirm green.
- [ ] **T2.6** — Verify via `agent-browser eval` that the SVGs no longer have `role="img"`.

### Phase 3 — CI workflow (R6-2) + test coverage gaps (R6-8)

- [ ] **T3.1 (R6-2)** — Update `.github/workflows/ci.yml`:
  - Add a second job `e2e` that runs in parallel with `verify`.
  - Steps: checkout, setup-node 22 with `cache: 'npm'`, `npm install`, `actions/cache@v4` for `~/.cache/playwright` (key: `${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}`), `npx playwright install --with-deps chromium`, `npm run test:e2e`.
  - Upload `playwright-report/` as an artifact on failure.
- [ ] **T3.2** — Validate the YAML syntax: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`.
- [ ] **T3.3 (R6-8)** — Add the missing tests:
  - `tests/dropdowns.spec.ts`: add a real click-toggle test that verifies `aria-expanded` flips (use a trigger whose `href` is an anchor on the current page, or use `preventDefault`).
  - `tests/carousel.spec.ts`: add ArrowLeft keyboard test.
  - `tests/headroom.spec.ts`: add scroll-up→pinned test.
- [ ] **T3.4** — Run full Playwright suite to confirm all tests pass.

### Phase 4 — Documentation drift (R6-6, R6-7) + test efficiency (R6-9)

- [ ] **T4.1 (R6-6)** — Update `CLAUDE.md`:
  - Line 7: `17 static pages` → `21 static pages`
  - Line 19: Remove "this is the only verification step" parenthetical; replace with reference to Testing Strategy section.
  - Line 25: Update JS-shipping components list to include dropdown menus + headroom.
  - Line 34: Add headroom script to the list.
- [ ] **T4.2 (R6-7)** — Update `README.md` line 23: `"(only a carousel and mobile menu opt in)"` → `"(only a carousel, mobile menu, dropdown menus, and scroll-reveal/headroom opt in)"`.
- [ ] **T4.3 (R6-9)** — Update `playwright.config.ts`:
  - Scope `mobile-menu.spec.ts` to `mobile-chrome` project only.
  - Scope `dropdowns.spec.ts` to `desktop-chrome` project only.
  - Remove `test.use({ viewport })` overrides from the spec files.
- [ ] **T4.4** — Run full Playwright suite to confirm the project scoping works.

### Phase 5 — Update `skills/astro-7-patterns/SKILL.md` with lessons learned

- [ ] **T5.1** — Append a new section to `skills/astro-7-patterns/SKILL.md` documenting:
  - The "idempotency flag on swapped element" anti-pattern (round-5 F1/F2/F3 fix pattern that DOESN'T prevent leaks on persistent `window`/`document`).
  - The correct pattern: move persistent-object listeners to module level; disconnect old observers.
  - The contact-form stub UX lesson: a stub form should show a feedback message on submit, not silently fail.
  - The SVG cover a11y lesson: decorative images alongside visible text should be `aria-hidden="true"`, not `role="img"` with `<title>`.
  - The CI regression-test lesson: a regression suite that doesn't run in CI doesn't prevent regressions.

### Phase 6 — Documentation round-up + commit + push

- [ ] **T6.1** — Update `README.md` changelog with round-6 entry.
- [ ] **T6.2** — Update `AGENTS.md` if any new gotchas emerged.
- [ ] **T6.3** — Update `CLAUDE.md` Testing Strategy section to mention the new listener-leak tests + contact-form test.
- [ ] **T6.4** — Add `docs/audit/REMEDIATION_PLAN_ROUND6.md` (this document).
- [ ] **T6.5** — Add `docs/audit/AUDIT_ROUND6_FINDINGS.md` (the standalone audit report from Task 5-round6, slightly extended with R6-11).
- [ ] **T6.6** — Run full verification suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`, `npm run test:e2e`, `npm audit`. All must pass.
- [ ] **T6.7** — Commit in atomic units:
  - `test(e2e): add listener-leak regression tests (red)`
  - `fix(layout): move headroom scroll listener to module level (R6-1)`
  - `fix(header): move Escape keydown listener to module level (R6-3)`
  - `fix(layout): disconnect old IntersectionObserver before creating new (R6-4)`
  - `fix(a11y): mark SVG cover art aria-hidden (R6-5)`
  - `fix(contact): show feedback message on form submit instead of silent failure (R6-11)`
  - `test(e2e): add contact-form regression test (green for R6-11)`
  - `ci: add Playwright E2E job to GitHub Actions (R6-2)`
  - `test(e2e): add dropdown click-toggle, carousel ArrowLeft, headroom scroll-up tests (R6-8)`
  - `test(e2e): scope mobile-menu specs to mobile-chrome, dropdown specs to desktop-chrome (R6-9)`
  - `docs: fix CLAUDE.md + README.md drift (R6-6, R6-7)`
  - `docs(skills): update astro-7-patterns/SKILL.md with round-6 lessons`
  - `docs: update for round-6 remediation`
- [ ] **T6.8** — Push to `main` via SSH wrapper per `skills/how-to-git-push-using-ssh-wrapper`.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| R6-1 fix breaks the headroom "show on scroll up" behavior | The module-level `onScroll` retains the `lastScroll` state at module scope; the direction-detection logic is unchanged. Add a scroll-up→pinned test (R6-8) to catch any regression. |
| R6-3 fix breaks the Escape close on the live toggle | The module-level handler re-queries the toggle inside; if `aria-expanded === 'true'`, it calls closeMenu (also re-queried). Add a Playwright test that opens the menu and presses Escape. |
| R6-11 contact form script doesn't re-init on `astro:after-swap` | Follow the round-5 F1/F2/F3 pattern: wrap in `initContactForm()` function, call on load + `astro:after-swap`, idempotent via `dataset.contactFormInit` flag. |
| R6-2 CI Playwright job is slow / flaky in GitHub Actions | Use `actions/cache` for the browser binary; `npx playwright install --with-deps chromium` (only Chromium, not all browsers); `retries: 2` in `playwright.config.ts` (already set for CI). |
| Listener-leak tests are flaky (timing-dependent) | Use `page.evaluate()` to instrument counters synchronously; assert exact counts; use `waitForFunction` if needed. |

---

## Definition of Done

The remediation is complete when:

- [ ] All 🟠 High tasks (R6-11) are resolved
- [ ] All 🟡 Medium tasks (R6-1, R6-2) are resolved
- [ ] All 🟢 Low tasks (R6-3, R6-4, R6-5, R6-6, R6-7, R6-8) are resolved
- [ ] R6-9, R6-10 (Informational) are addressed (R6-9 yes; R6-10 optional)
- [ ] `npm run check` passes (0 errors, 0 hints)
- [ ] `npm run build` produces 21+ pages with 0 warnings
- [ ] `npm run check:links` reports 0 broken internal links
- [ ] `npm run check:content` reports 0 validation errors
- [ ] `npm run test:e2e` passes all specs (including new listener-leak + contact-form tests)
- [ ] `npm audit` reports 0 critical vulnerabilities
- [ ] Live site `https://astro.jesspete.shop/` (after re-deploy) confirms: contact form shows feedback message on submit, SVG covers no longer have `role="img"`, no scroll-listener leak after 5 navigations
- [ ] `skills/astro-7-patterns/SKILL.md` updated with round-6 lessons
- [ ] All changes committed to `main` in atomic units and pushed via SSH wrapper

---

*End of round-6 remediation plan. Proceeding to execution.*
