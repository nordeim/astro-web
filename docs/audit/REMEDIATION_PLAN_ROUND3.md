# Remediation Plan — Round 3 (Skills Compliance + Design Fidelity)

> **Paired with:** `docs/audit/AUDIT_FINDINGS.md` (round 1), `docs/audit/REMEDIATION_PLAN.md` (round 1), `docs/audit/REMEDIATION_PLAN_ROUND2.md` (round 2)
> **Date:** 2026-08-04
> **Trigger:** Post-deployment E2E test of live `https://astro.jesspete.shop/` + skills compliance review against `skills/astro-7/` and `skills/astro-7-patterns/`.

---

## Summary

| Source | Findings | Critical | High | Medium | Low |
|--------|----------|----------|------|--------|-----|
| E2E test (agent-browser vs original kelp.agency) | 3 | 0 | 0 | 2 | 1 |
| Skills compliance (astro-7 + astro-7-patterns) | 2 | 0 | 1 | 1 | 0 |
| **Total** | **5** | **0** | **1** | **3** | **1** |

The round-1 and round-2 remediations are confirmed live and working. This round addresses (a) WCAG 2.2 AA compliance gaps flagged by the `astro-7-patterns` skill, and (b) design-fidelity discrepancies found by comparing the live clone to the original `kelp.agency` via `agent-browser`.

---

## Findings

### R3-1 — Mobile menu missing dialog semantics (High, WCAG compliance)

- **Source:** `skills/astro-7-patterns/SKILL.md` Section 7 ("Mobile Menu Accessibility — The Full Pattern")
- **Location:** `src/components/Header.astro` lines 118–126 (the `<div id="mobile-menu" ...>` element)
- **Description:** The astro-7-patterns skill specifies that the mobile menu container must have `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"`. The clone's mobile menu div has `id`, `class`, `style`, and `data-mobile-menu` but is missing all three ARIA attributes.
- **Skill quote:** "Menu has `role="dialog"` and `aria-modal="true"`" — checklist item 4 in Section 7.
- **Impact:** Screen readers don't announce the mobile menu as a dialog. Users navigating with assistive tech don't know the rest of the page is inert. WCAG 2.2 AA non-compliance.
- **Severity:** High
- **Confidence:** Verified (code inspection + skill checklist comparison)

### R3-2 — Mobile menu focus management missing (Medium, WCAG compliance)

- **Source:** `skills/astro-7-patterns/SKILL.md` Section 7 ("The accessibility checklist")
- **Location:** `src/components/Header.astro` lines 135–160 (the `openMenu` / `closeMenu` functions)
- **Description:** When the mobile menu opens, focus should move to the menu (or its first focusable element). When it closes, focus should return to the toggle button. The clone's `openMenu()` only toggles classes and attributes — it doesn't move focus. The `closeMenu()` doesn't return focus to the toggle.
- **Skill quote:** "Focus is visible on all interactive elements" — checklist item 8. The skill also notes "The pattern above doesn't implement a full focus trap... For a small mobile menu with 5-7 links, this is usually acceptable." Focus *movement* (not trap) is the baseline requirement.
- **Impact:** Keyboard users activating the hamburger button stay focused on the button after the menu opens; they must Tab through the page's hidden content to reach the menu links. Violates WAI-ARIA Authoring Practices for dialog patterns.
- **Severity:** Medium
- **Confidence:** Verified (code inspection)

### R3-3 — Footer missing "Ready to get started?" CTA column (Medium, design fidelity)

- **Source:** E2E comparison with `https://www.kelp.agency/` via `agent-browser`
- **Location:** `src/components/Footer.astro` lines 15–73 (the `footerColumns` array)
- **Description:** The original kelp.agency footer has 6 columns: "Ready to get started?" (CTA), Services, Contact, Work, Platforms, Follow us on social. The clone has 5 — it's missing the "Ready to get started?" CTA column.
- **Evidence (original):** `agent-browser eval` on `https://www.kelp.agency/` returned footer `<h3>` elements: `["Ready to get started?", "Services", "Contact", "Work", "Platforms", "Follow us on social"]`.
- **Evidence (original HTML):** The "Ready to get started?" column contains: `<h3>Ready to get started?</h3>`, `<p>Let's get creative and start making something amazing together!</p>`, `<a href="/contact/" class="button">Schedule a Meeting</a>`.
- **Impact:** Visual and functional discrepancy from the original. The footer CTA is a primary conversion path that's missing.
- **Severity:** Medium
- **Confidence:** Verified

### R3-4 — How We Work section missing "Ready to get started?" link (Low, design fidelity)

- **Source:** E2E comparison with `https://www.kelp.agency/` via `agent-browser`
- **Location:** `src/components/home/HowWeWork.astro` (after the 5-step `<ol>`)
- **Description:** The original kelp.agency's How We Work section ends with a "Ready to get started?" link (inside a `<div class="how-we-work-phase">`) pointing to `/contact/`. The clone's HowWeWork.astro ends after the 5 steps with no CTA link.
- **Evidence (original):** `agent-browser snapshot` showed `link "Ready to get started?" [ref=e23]` between the "5. Ongoing Support" heading and the "What Our Clients Say" heading. The link's parent class is `how-we-work-phase`.
- **Impact:** Missing conversion CTA at the end of a key homepage section.
- **Severity:** Low
- **Confidence:** Verified

### R3-5 — `desiredOrder` array duplicated in two files (Low, DRY violation)

- **Source:** Code inspection during skills compliance review
- **Location:** `src/components/home/Services.astro` lines 8–14 and `src/pages/services/index.astro` lines 8–14
- **Description:** Both files define the same `desiredOrder` array of service slugs (`['branding-design', 'websites', 'marketing-strategy', 'media', 'ongoing-support']`). If the order changes, both files must be updated in sync — a maintenance hazard.
- **Impact:** Risk of drift if one file is updated and the other isn't.
- **Severity:** Low
- **Confidence:** Verified

---

## Issues Reviewed and Confirmed NOT Outstanding

| Item | Status | Notes |
|------|--------|-------|
| All round-1 findings (C1–C4, H1–H8, M1–M6, L1–L5) | ✅ Fixed and live | Verified via curl + agent-browser on `https://astro.jesspete.shop/`. |
| All round-2 findings (B1–B3) | ✅ Fixed and live | `prebuild` guard runs (npm_log.txt line 15-16); OG image serves 200; docs updated. |
| Deployment log errors | ✅ Clean | `npm_log.txt` shows 21 pages built, sitemap generated, 0 errors. The `esbuild` install-scripts warning is benign. |
| Canonical URL / OG URL | ✅ Correct | `https://astro.jesspete.shop/` confirmed via curl. |
| Sitemap | ✅ Generated | `/sitemap-index.xml` returns 200. |
| robots.txt | ✅ Served (with Cloudflare managed content prepended) | Cloudflare's "AI Audit" feature injects managed content; my `public/robots.txt` is still served at the bottom. Not a code bug. |
| All 18 key URLs | ✅ Return 200 | Verified via curl. |
| Dropdown menus | ✅ Work on hover + click | Verified via agent-browser. Labels match original exactly. |
| Carousel keyboard nav | ✅ Works (ArrowLeft/ArrowRight) | Verified via agent-browser. 9 slides. |
| Mobile menu open/close | ✅ Works | Verified via agent-browser. |
| Platform dedicated pages | Out-of-scope | Original has `/platforms/hubspot/` etc. (dedicated pages); clone uses `/platforms/#hubspot` (anchor). Structural choice documented in design template. Both work in their contexts. |
| Testimonials count (3 vs 1) | Out-of-scope | Clone has MORE testimonials than original (improvement, not bug). |
| How We Work parallax images | Out-of-scope | Original has elaborate parallax image layers; clone uses text-only per design template. Design choice. |
| Contact form backend | Out-of-scope | Documented as stub. Intentional. |

---

## Plan vs. Codebase Alignment (Pre-execution validation)

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| R3-1 add dialog ARIA to mobile menu | `src/components/Header.astro` line 118 (`<div id="mobile-menu"`), `skills/astro-7-patterns/SKILL.md` Section 7 checklist | ✅ |
| R3-2 focus management in openMenu/closeMenu | `src/components/Header.astro` lines 135–160 (`openMenu`/`closeMenu` functions) | ✅ |
| R3-3 add footer CTA column | `src/components/Footer.astro` lines 15–73 (`footerColumns` array), original footer HTML (verified via agent-browser) | ✅ |
| R3-4 add HowWeWork CTA link | `src/components/home/HowWeWork.astro` (after the `<ol>`), original How We Work section (verified via agent-browser) | ✅ |
| R3-5 extract desiredOrder to shared module | `src/components/home/Services.astro` line 8, `src/pages/services/index.astro` line 8 | ✅ |

---

## TDD Strategy

1. **R3-1 (dialog ARIA):** Write the ARIA attributes into Header.astro. Verify via `npm run build` + `agent-browser eval` that the mobile menu div has `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"`. The existing `npm run check` is the type gate.

2. **R3-2 (focus management):** Update `openMenu()` to move focus to the menu's first focusable link. Update `closeMenu()` to return focus to the toggle button. Verify via `agent-browser`: click the toggle, check `document.activeElement` is a menu link; press Escape, check `document.activeElement` is the toggle button.

3. **R3-3 (footer CTA):** Add a 6th column to `footerColumns` with a special `isCTA` flag. Update the Footer template to render CTA columns differently (H3 + P + button, not a link list). Verify via `agent-browser` that the footer has 6 `<h3>` headings, the first being "Ready to get started?".

4. **R3-4 (HowWeWork CTA):** Add a "Ready to get started?" link after the `<ol>` in HowWeWork.astro. Verify via `agent-browser` that the link appears between the 5th step and the testimonials section.

5. **R3-5 (DRY desiredOrder):** Extract `desiredOrder` to a new `src/lib/service-order.ts` module. Import it in both `Services.astro` and `services/index.astro`. Verify via `npm run check` that types still pass.

---

## ToDo List (Execution Order)

### Phase 1 — Mobile menu a11y (R3-1, R3-2)

- [ ] **T1.1** — In `src/components/Header.astro`, add `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"` to the `<div id="mobile-menu">` element.
- [ ] **T1.2** — In `src/components/Header.astro`, update `openMenu()` to move focus to the menu's first focusable link after opening. Update `closeMenu()` to return focus to the toggle button before closing.
- [ ] **T1.3** — Run `npm run check` and `npm run build`. Verify via `agent-browser eval` that the mobile menu div has the three ARIA attributes. Verify focus movement by clicking the toggle and checking `document.activeElement`.

### Phase 2 — Footer CTA column (R3-3)

- [ ] **T2.1** — In `src/components/Footer.astro`, update the `FooterColumn` interface to support an optional `isCTA` flag and a `description` field. Add a new column at the beginning of `footerColumns` with `title: 'Ready to get started?'`, `description: "Let's get creative and start making something amazing together!"`, `cta: { label: 'Schedule a Meeting', href: '/contact/' }`, `isCTA: true`.
- [ ] **T2.2** — Update the Footer template to render CTA columns differently: H3 + description `<p>` + button-styled `<a>` (not a `<ul>` link list).
- [ ] **T2.3** — Update the grid classes from `lg:grid-cols-5` to `lg:grid-cols-6` to accommodate the 6th column.
- [ ] **T2.4** — Run `npm run check`, `npm run build`, `npm run check:links`. Verify via `agent-browser` that the footer has 6 `<h3>` headings, the first being "Ready to get started?".

### Phase 3 — HowWeWork CTA link (R3-4)

- [ ] **T3.1** — In `src/components/home/HowWeWork.astro`, add a "Ready to get started?" link after the `<ol>` of steps. Style it as a prominent CTA linking to `/contact/`.
- [ ] **T3.2** — Run `npm run check`, `npm run build`, `npm run check:links`. Verify via `agent-browser` that the link appears.

### Phase 4 — DRY desiredOrder (R3-5)

- [ ] **T4.1** — Create `src/lib/service-order.ts` exporting the `desiredOrder` array.
- [ ] **T4.2** — Update `src/components/home/Services.astro` and `src/pages/services/index.astro` to import from the new module instead of defining inline.
- [ ] **T4.3** — Run `npm run check`, `npm run build`. Verify the services page and homepage still render the 5 categories in the correct order.

### Phase 5 — Final verification

- [ ] **T5.1** — Run full suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`. All must pass.
- [ ] **T5.2** — Run `agent-browser` E2E against local preview:
  - Mobile menu has `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"`.
  - Opening the menu moves focus to the first link.
  - Closing the menu returns focus to the toggle.
  - Footer has 6 columns, first is "Ready to get started?" CTA.
  - HowWeWork has a "Ready to get started?" link after the 5 steps.

### Phase 6 — Documentation + commit + push

- [ ] **T6.1** — Update `README.md` changelog with round-3 entry.
- [ ] **T6.2** — Update `docs/kelp-design-template.md` verification checklist with round-3 items.
- [ ] **T6.3** — Update `AGENTS.md` if any new gotchas emerged (focus management pattern).
- [ ] **T6.4** — Commit in atomic units:
  - `fix(a11y): add dialog semantics and focus management to mobile menu (R3-1, R3-2)`
  - `feat(footer): add Ready to get started CTA column matching original (R3-3)`
  - `feat(home): add Ready to get started link to How We Work section (R3-4)`
  - `refactor(services): extract desiredOrder to shared module (R3-5)`
  - `docs: update for round-3 remediation`
- [ ] **T6.5** — Push to `main` via SSH wrapper.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Adding `aria-modal="true"` without a focus trap could confuse screen readers | The skill explicitly says focus traps are optional for 5-7 link menus. Adding `role="dialog"` + `aria-modal="true"` + focus movement is the documented baseline. |
| Focus movement may break if the menu's first link isn't ready | Use `requestAnimationFrame` or a small `setTimeout` after removing the `hidden` class before moving focus. |
| Footer CTA column may break the 5-column grid | Change to `lg:grid-cols-6` and test at desktop width. The CTA column can span the same width as other columns. |
| Extracting `desiredOrder` to a new module adds a file | The file is small (one export) and eliminates a DRY violation. Worth the tradeoff. |

---

*End of round-3 remediation plan. Proceeding to execution.*
