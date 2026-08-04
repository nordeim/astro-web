# Remediation Plan — Round 4 (Content Fidelity + Brand Motifs + SEO)

> **Paired with:** `docs/comparative-analysis.md` (the user's external audit), `docs/audit/AUDIT_FINDINGS.md` (round 1), `docs/audit/REMEDIATION_PLAN.md` (round 1), `docs/audit/REMEDIATION_PLAN_ROUND2.md` (round 2), `docs/audit/REMEDIATION_PLAN_ROUND3.md` (round 3)
> **Date:** 2026-08-04
> **Trigger:** Review of `docs/comparative-analysis.md` + agent-browser E2E validation against `https://www.kelp.agency/` + skills compliance check.

---

## Summary

| Source | Findings | Critical | High | Medium | Low |
|--------|----------|----------|------|--------|-----|
| `docs/comparative-analysis.md` validated | 6 actionable | 1 | 0 | 3 | 2 |
| Skills compliance (astro-7 + code-quality) | 0 new | 0 | 0 | 0 | 0 |
| **Total** | **6** | **1** | **0** | **3** | **2** |

Round 1–3 remediations are confirmed live and working. The comparative analysis (which predates round 3) flagged some items that are now stale (F-3, F-9 are already fixed). This round addresses the genuinely outstanding items: fabricated contact info (F-1), missing brand motifs (F-4), title-tag convention (F-8), and adds JSON-LD structured data + the original's hero wave divider SVG.

---

## Validation of `docs/comparative-analysis.md` Findings

| Finding | Severity in report | Status after validation | Action |
|---------|-------------------|------------------------|--------|
| **F-1** Fabricated business-identity content (address, phone, staff, testimonials) | Critical | **Confirmed** — phone `(407) 555-1234` is reserved NANP fictional block; address `123 Winter Park Ave` is fabricated; email `hello@kelp.agency` should be `info@kelp.agency`; team names are invented. Verified via agent-browser on both sites. | **R4-1** (Critical) — Replace with real Kelp contact info + clearly-fictional placeholder team/testimonials. |
| **F-2** Site scope reduced ~87% (19 vs 147 URLs) | High | **Confirmed but out-of-scope** — the clone is intentionally a "homepage + core templates" demo per the design template. Rebuilding 128 pages of blog/staff/service-detail content is content work, not code work. The README already documents this scope. | **Document only** — note in README that the clone is a partial reproduction. |
| **F-3** Homepage omits portfolio-proof and services-preview sections | High | **STALE** — the clone homepage now has both "Our Work In the real-world" (9 carousel slides) and "Our Services" (5 categories) sections. Fixed in round 1 (H7, H8). Verified via agent-browser. | **No action** — already fixed. |
| **F-4** Brand-reinforcing visual motifs (wave divider, custom quote mark) not found | Medium | **Confirmed** — clone has no `class="hero-water"` SVG in hero; testimonial `<blockquote>` has no custom leaf-shaped quotation mark SVG. The original has both. Verified via agent-browser. | **R4-2** (Medium) — Add hero wave-divider SVG + testimonial leaf-quote-mark SVG. |
| **F-5** Resources repurposed from downloads library to mini-blog | Medium | **Confirmed but intentional** — the design template (`docs/kelp-design-template.md` §10) documents Resources as "Articles & guides". The original's downloadable-assets library is out of scope for a static clone. | **No action** — documented design choice. |
| **F-6** Case-study template loses specificity (no images, fabricated quotes) | Medium | **Confirmed** — case studies use template prose with no images. The "fabricated quotes" sub-issue is bundled into R4-1 (testimonials). Images are content work. | **R4-1 partial** — fix fabricated quote attribution. Images out of scope. |
| **F-7** Email link may render as non-functional `[email protected]` without JS | Medium | **NOT A BUG in our code** — the clone's HTML emits `<a href="mailto:hello@kelp.agency">hello@kelp.agency</a>` correctly. The comparative analysis saw `[email protected]` because Cloudflare's email obfuscation requires JS, and the analysis used no-JS static extraction. Verified via agent-browser: the link renders and works. | **No action** — false positive from the analysis tooling. (Email address itself is wrong per F-1; that's R4-1.) |
| **F-8** `<title>` tag adds unsourced marketing copy | Low | **Confirmed** — original homepage title is `"Kelp Creative Agency"`; clone is `"Kelp Creative Agency — Central Florida's Award-Winning Creative Agency"`. Inner-page titles also differ (`About Kelp` vs `About — Kelp Creative Agency`). | **R4-3** (Low) — Align title-tag convention with the original. |
| **F-9** Structured project-brief contact form (positive deviation) | Informational | **Confirmed** — clone's contact form is a defensible UX improvement. Keep as-is. | **No action** — intentional improvement. |
| **F-10** Shared framework and interaction model | Informational | **Confirmed** — both on Astro, both have scroll-reveal. | **No action**. |

---

## New Findings (from this round's E2E + skills review)

### R4-4 — Missing JSON-LD structured data (Medium, SEO)

- **Source:** E2E comparison with `https://www.kelp.agency/` via curl
- **Location:** `src/layouts/BaseLayout.astro` (no JSON-LD output)
- **Description:** The original kelp.agency embeds JSON-LD structured data (schema.org) in its pages: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `ContactPage`, `ProfessionalService`, `FAQPage`. The clone has none. Verified via `curl -s https://www.kelp.agency/ | grep -o 'application/ld+json'` → 1 match; `curl -s https://astro.jesspete.shop/ | grep -o 'application/ld+json'` → 0 matches.
- **Impact:** Search engines lose context about the business (name, address, phone, hours, FAQ). Rich results in Google Search Console are not eligible. SEO gap.
- **Severity:** Medium
- **Confidence:** Verified

### R4-5 — Hero wave-divider SVG missing (Medium, brand fidelity) — bundled into R4-2

### R4-6 — Testimonial custom quotation-mark SVG missing (Medium, brand fidelity) — bundled into R4-2

---

## Plan vs. Codebase Alignment (Pre-execution validation)

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| R4-1 fix fabricated contact info | `src/pages/contact.astro` (lines 25, 31, 36-40), `src/pages/about.astro` (team array), `src/content/testimonials/*.yaml` (3 files), original's real info (`info@kelp.agency`, `352-325-7688`, `P.O. Box 116, Brooksville, FL 34605`) | ✅ |
| R4-2 add hero wave SVG + testimonial quote SVG | `src/components/home/Hero.astro` (after `<section class="hero">`), `src/components/home/Testimonials.astro` (inside `<blockquote>`), original SVG markup captured via agent-browser | ✅ |
| R4-3 align title-tag convention | `src/layouts/BaseLayout.astro` (title prop default), `src/pages/*.astro` (title props), original titles verified via curl | ✅ |
| R4-4 add JSON-LD structured data | `src/layouts/BaseLayout.astro` (head), original JSON-LD captured via curl | ✅ |

---

## TDD Strategy

1. **R4-1 (contact info):** Update `contact.astro`, `about.astro`, and the 3 testimonial YAML files. Verify via `curl` that the live HTML contains the correct info. Verify via `npm run check:content` that frontmatter stays valid.

2. **R4-2 (brand SVGs):** Create the wave-divider SVG as an inline component or inline in `Hero.astro`. Create the leaf-quote-mark SVG inline in `Testimonials.astro`. Verify via `agent-browser eval` that the SVGs are present in the DOM. The existing `npm run check` is the type gate.

3. **R4-3 (title tags):** Update the `title` prop in each page and the default in `BaseLayout.astro`. Verify via `curl` that each page's `<title>` matches the original's convention.

4. **R4-4 (JSON-LD):** Add a `<script type="application/ld+json">` block to `BaseLayout.astro` with `Organization`, `WebSite`, and `WebPage` schema. Verify via `curl` that the JSON-LD is present and valid (parseable JSON).

---

## ToDo List (Execution Order)

### Phase 1 — Fix fabricated contact info (R4-1, Critical)

- [ ] **T1.1** — In `src/pages/contact.astro`:
  - Change email from `hello@kelp.agency` to `info@kelp.agency` (both the mailto link and the discovery-call mailto).
  - Change phone from `(407) 555-1234` / `tel:+14075551234` to `352-325-7688` / `tel:+13523257688`.
  - Change address from `123 Winter Park Ave, Suite 200, Winter Park, FL 32789` to `P.O. Box 116, Brooksville, FL 34605`.
  - Change "Studio" label to "Mailing Address" (more accurate for a P.O. Box).
- [ ] **T1.2** — In `src/pages/about.astro`:
  - Update the team array to use clearly-fictional placeholder names (e.g., "Jane Doe, Founder & Creative Director", "John Smith, Design Lead") instead of invented names that could be mistaken for real people. Add a note in the page copy that the team is a placeholder for the demo.
  - Update the "Our story" copy to remove the fabricated 2018 founding narrative and instead use a neutral placeholder that doesn't misattribute.
- [ ] **T1.3** — In `src/content/testimonials/client-1.yaml`, `client-2.yaml`, `client-3.yaml`:
  - Change author names to clearly-fictional placeholders (e.g., "Jane Doe", "John Smith", "Alex Sample").
  - Change company names to clearly-fictional placeholders (e.g., "Example Co.", "Sample Brand", "Demo LLC") — DO NOT keep real client names (Spring Water Spirits, Mountaineer Coffee, Elev8 Fun) attached to fabricated quotes.
- [ ] **T1.4** — Run `npm run check`, `npm run build`, `npm run check:content`. Verify via `curl` that the contact page shows the correct info.

### Phase 2 — Add brand-motif SVGs (R4-2, Medium)

- [ ] **T2.1** — Create `src/components/home/HeroWave.astro` — an inline SVG wave-divider component matching the original's `class="hero-water"` (1445×161 viewBox, aqua-to-teal gradient `#bef3f4 → #80e6e9`). Place it at the bottom of the hero section, full-width.
- [ ] **T2.2** — In `src/components/home/Testimonials.astro`, add an inline leaf-shaped quotation-mark SVG (90.8×67.3 viewBox, filled with `#a1e39a` seaweed green) before each `<blockquote>`. Match the original's path data captured via agent-browser.
- [ ] **T2.3** — Run `npm run check`, `npm run build`. Verify via `agent-browser eval` that the SVGs are in the DOM.

### Phase 3 — Align title-tag convention (R4-3, Low)

- [ ] **T3.1** — In `src/layouts/BaseLayout.astro`, the `title` prop is passed through directly. No default change needed — each page sets its own title.
- [ ] **T3.2** — Update each page's `title` prop to match the original's convention:
  - `index.astro`: `"Kelp Creative Agency"` (drop the tagline suffix)
  - `about.astro`: `"About Kelp"`
  - `contact.astro`: `"Contact Kelp"`
  - `services/index.astro`: `"Kelp's Services"`
  - `work/index.astro`: `"Our Work"`
  - `work/clients.astro`: `"Kelp Client List"` (keep — original uses this)
  - `work/[slug].astro`: `"{Title} — Kelp Creative Agency"` (keep — original case-study titles follow this pattern)
  - `platforms/index.astro`: `"Kelp's Preferred Platforms"`
  - `resources/index.astro`: `"Kelp Resources"`
  - `resources/[slug].astro`: `"{Title} — Kelp Creative Agency"` (keep)
  - `404.astro`: `"404 — Page Not Found | Kelp Creative Agency"` (keep — original has its own 404 title)
- [ ] **T3.3** — Run `npm run check`, `npm run build`. Verify via `curl` that each page's `<title>` matches.

### Phase 4 — Add JSON-LD structured data (R4-4, Medium)

- [ ] **T4.1** — In `src/layouts/BaseLayout.astro`, add a `<script type="application/ld+json" set:html={...} />` block in the `<head>` with:
  - `Organization` schema: name, url, logo, sameAs (social links), address (P.O. Box 116, Brooksville, FL 34605), telephone (+1-352-325-7688), email (info@kelp.agency).
  - `WebSite` schema: name, url, publisher (ref to Organization).
  - `WebPage` schema: name (page title), url (canonical), description, isPartOf (ref to WebSite).
  - `BreadcrumbList` schema: Home → current page.
- [ ] **T4.2** — Use `set:html` with a JSON-stringified object (Astro auto-escapes by default; `set:html` is safe here because the content is fully server-controlled, not user input — per astro-7 anti-pattern #14, `set:html` is only dangerous with untrusted input).
- [ ] **T4.3** — Run `npm run check`, `npm run build`. Verify via `curl` that the JSON-LD is present and parseable.

### Phase 5 — Final verification

- [ ] **T5.1** — Run full suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`. All must pass.
- [ ] **T5.2** — E2E verify via agent-browser on local preview:
  - Contact page shows `info@kelp.agency`, `352-325-7688`, `P.O. Box 116, Brooksville, FL 34605`.
  - Testimonials show fictional placeholder names.
  - Hero has wave-divider SVG.
  - Testimonials have leaf-quote-mark SVG.
  - Homepage `<title>` is `"Kelp Creative Agency"`.
  - JSON-LD is present and parseable.

### Phase 6 — Documentation + commit + push

- [ ] **T6.1** — Update `README.md` changelog with round-4 entry.
- [ ] **T6.2** — Update `docs/kelp-design-template.md` verification checklist with round-4 items.
- [ ] **T6.3** — Update `AGENTS.md` if any new gotchas emerged (JSON-LD pattern, fictional-placeholder policy).
- [ ] **T6.4** — Commit in atomic units:
  - `fix(content): replace fabricated contact info and testimonials with real/placeholder data (R4-1)`
  - `feat(brand): add hero wave-divider and testimonial leaf-quote-mark SVGs (R4-2)`
  - `fix(seo): align title-tag convention with original kelp.agency (R4-3)`
  - `feat(seo): add JSON-LD structured data for Organization, WebSite, WebPage, BreadcrumbList (R4-4)`
  - `docs: update for round-4 remediation`
- [ ] **T6.5** — Push to `main` via SSH wrapper.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Changing testimonials to fictional placeholders loses the "real client" feel | This is the correct trade-off per the comparative analysis (F-1). Fabricated quotes attributed to real companies (Elev8 Fun, Mountaineer Coffee) create misattribution risk. Fictional placeholders are the ethical choice for a demo clone. |
| Wave SVG path data may not match the original exactly | I captured the original's path data via agent-browser. The SVG will be a faithful reproduction. If the path is too long, I'll use a simplified wave shape with the same gradient. |
| Title-tag changes may affect existing SEO ranking | The site is a demo clone with no real SEO ranking to protect. Aligning with the original is the correct brand-fidelity choice. |
| JSON-LD with `set:html` could be an XSS vector | The JSON-LD content is 100% server-controlled (no user input). Per astro-7 anti-pattern #14, `set:html` is safe with trusted content. I'll use `JSON.stringify()` to ensure valid JSON escaping. |
| Team page now shows "Jane Doe" instead of realistic names | This is intentional — the comparative analysis explicitly recommended "clearly-fictional placeholder names" to avoid misattribution. The README will document this as a demo-content choice. |

---

*End of round-4 remediation plan. Proceeding to execution.*
