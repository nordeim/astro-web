# Visual & UI/UX Comparative Analysis

**Original:** `https://www.kelp.agency/` — Kelp Creative Agency
**Clone under review:** `https://astro.jesspete.shop/`
**Review type:** Mode C audit (comparative visual + UI/UX), read-only, no code changes requested
**Method:** Live retrieval and structural inspection of rendered DOM/content for both origins (home + About, Work index, Work/Elev8 Fun case study, Services, Platforms, Resources, Contact, and sitemap-driven information architecture on both domains).

---

## Methodology & Verification Ledger

This audit was performed by fetching and structurally inspecting the live markup of both sites (multiple templates per site) and diffing the two site's `sitemap-0.xml` files for information-architecture coverage. No headless-browser screenshot, computed-style, or Lighthouse/axe run was available in this environment.

| Checked | Method | Result confidence |
|---|---|---|
| Homepage copy, structure, section order | Fetched rendered DOM (both sites) | **Verified** |
| Full site page inventory (IA/scope) | Fetched and diffed `sitemap-0.xml` on both domains | **Verified** |
| Shared template comparison (`/work/elev8-fun/`, `/about/`, `/contact/`, `/services/`, `/platforms/`, `/resources/`) | Fetched rendered DOM (both sites) | **Verified** |
| Brand color values (hero wave, testimonial mark) | Read literal hex/`color()` values from inline SVG in the original's DOM | **Verified** for the original; **Unverifiable** whether the clone reproduces them pixel-for-pixel (not present in clone's extracted DOM — see Finding V-2) |
| Typography (typeface family, weights, scale) | Not directly accessible — `<head>`, linked stylesheets, and computed styles were not retrievable via the available fetch tooling | **Unverifiable** — flagged throughout, not guessed |
| Rendered layout at specific breakpoints, touch-target sizing, animation timing | No headless browser/viewport emulation available | **Unverifiable** — recommendations given for manual/automated follow-up |
| Framework/tooling | Both sites expose `data-astro-cid-*` attributes and hashed `/_astro/*` asset paths | **Verified**: both are built on Astro, so the clone shares the source's component/interaction model at the framework level |

Anywhere this report states a color, layout, or copy fact, it was read directly from live markup at the time of testing. Anywhere it discusses type specimens, exact spacing, or rendered pixel fidelity, it is explicitly marked **Unverifiable** rather than estimated, per this engagement's evidence standard. A follow-up manual pass (real browser, both breakpoints, DevTools computed styles + Lighthouse/axe) is recommended to close that gap — see [Limitations](#limitations-of-this-assessment).

---

## Executive Summary

The clone (`astro.jesspete.shop`) reproduces the **shape** of Kelp Creative Agency's homepage and shares its front-end framework (Astro), but it is **not a faithful clone at the content, scope, or brand-reinforcement level**. Three findings dominate the comparison:

1. **Scope collapse.** The original is a 147-URL site (a 58-post blog, 6 individual team-member bios, 50 work/case-study routes, 22 service routes, a resource-download library, a calendar, a privacy policy). The clone contains **19 URLs total — about 13% of the original's footprint** — with entire sections (Blog, individual staff bios, Calendar, Privacy Policy, most Service and Work detail pages) missing outright.
2. **Fabricated identity content.** Where the clone does have equivalent pages, real operational facts have been replaced with invented placeholders: a fake office address, a placeholder `555` phone number, invented staff names, and fabricated client testimonials with names that do not appear anywhere on the source site.
3. **Diluted brand voice.** The original leans hard into a cohesive "Kelp"/ocean-and-pirate metaphor (a teal wave-gradient hero divider, a custom leaf-shaped quotation mark, a "Resources" page of downloadable pirate-themed fonts and seaweed/rope Illustrator brushes, a blog post titled *"Partners vs Pirates"*). The clone keeps the "Partners vs Pirates" *article title* but drops the visual motifs and the downloadable-asset library that give the metaphor its teeth, leaving a visually plausible but thinner brand expression.

Where the clone is comparable — page skeleton, section order on the homepage, use of the same component framework — the *structural* UX pattern is a reasonable approximation. But as a "clone," it currently under-delivers on content fidelity, IA completeness, and brand-identity reinforcement, which are core to the "visual aesthetics [and] UI/UX design" being evaluated. Overall comparative verdict: **the original serves user needs and brand cohesion substantially better than the clone in its current state.**

| Dimension | Original (`kelp.agency`) | Clone (`astro.jesspete.shop`) | Winner |
|---|---|---|---|
| Total indexed pages (sitemap) | 147 | 19 | Original |
| Homepage sections | Hero → client logos → work portfolio (5 case studies) → services → process (5 steps) → testimonial | Hero → process (5 steps) → testimonials (3) → CTA | Original (more complete funnel) |
| Brand-motif visual devices found in markup | Wave-gradient SVG divider, custom leaf quote-mark SVG | None found in equivalent sections | Original |
| Contact info accuracy vs. source of truth | Real PO Box, real phone, real staff | Fabricated address, `555` placeholder phone, fabricated staff | Original |
| Testimonial attribution | Named, verifiable (Caleb Williams, Elev8 FUN) | Named but fabricated (no matching record on original) | Original |
| Process section ("How We Work") | Present, 5 steps, same copy pattern | Present, 5 steps, rewritten copy | Tie (both present, faithful structure) |
| Contact form | Not present in extracted markup (calendar-style CTA instead) | Structured multi-field project-brief form | Clone (arguably better lead-qualification UX — see Finding N-3) |
| Framework/tech alignment | Astro + WordPress-backed content | Astro | Aligned |

---

## 1. Identity: Color, Typography, and Layout

### 1.1 Color

**Original — Verified.** The homepage embeds two inline SVG gradients directly in markup: a wide wave-shaped divider beneath the hero using `#bef3f4 → #80e6e9` (a soft aqua-to-teal gradient, with a wide-gamut `color(display-p3 …)` fallback for capable displays), and a pair of custom leaf/kelp-frond-shaped quotation marks in the testimonial block filled with `#a1e39a` (a muted seaweed green). Both choices are legible, on-theme callbacks to "kelp" as a marine plant, and they double as functional dividers/quote-marks rather than pure decoration — form and function are working together here.

**Clone — Unverifiable / likely absent.** The equivalent homepage regions in the clone's DOM contain no inline SVG wave divider and no custom quotation-mark graphic; the testimonial block is a plain `<figure>/<blockquote>/<figcaption>`. It is possible the clone reproduces similar colors via CSS background images not visible to static extraction, but no equivalent graphic device was found anywhere in the fetched markup. **Confidence: Reasoned** — recommend a manual screenshot diff to confirm whether the aqua/green palette survives anywhere in the clone's stylesheet even without the SVG motif.

### 1.2 Typography

Neither site's `<head>`, linked stylesheets, or computed font styles were retrievable through the available tooling (both were stripped by content extraction ahead of analysis). **This report does not guess type families, weights, or scale for either site** — that would violate this engagement's evidence standard. What can be said from content structure alone:

- Both sites use a conventional semantic heading hierarchy (`h2` for major sections, `h3` for sub-items), which is good for both SEO and screen-reader navigation on both properties.
- The original's downloadable-resources page advertises two custom in-house display fonts ("Red Flag," a pirate-inspired script, and "Black Flag," a serif "born of the salty sea") as **brand collateral for client work** — there is no evidence these are the typefaces used in the site's own UI chrome, so this is brand-personality evidence, not a typography-system finding.
- **Recommendation:** a DevTools computed-style pass (font-family, weight, line-height, and type scale at each breakpoint) is needed before either site's typography can be scored. Flagged as **Unverifiable** rather than assumed.

### 1.3 Layout

**Original homepage structure (verified, in DOM order):** Hero statement + client-name list → wave SVG transition → "Our Work" section with five case-study teasers (Spring Water Spirits, Deals In Dirt, Elev8 Fun, Mountaineer Coffee, Unprofitable) → "Our Services" module → "How We Work" 5-step process → "What Our Clients Say" testimonial.

**Clone homepage structure (verified, in DOM order):** Hero statement → "How We Work" 5-step process → "What Our Clients Say" (three testimonials) → a standalone "Ready to get started?" CTA block.

The clone's layout is materially shorter: it **omits the entire portfolio-teaser grid and the services module** that, on the original, do the heavy lifting of proving credibility before asking for a decision. Structurally, the clone jumps from an introductory paragraph straight to internal process ("how we work"), which is a weaker narrative arc for a creative agency's homepage — visitors are typically won over by *seeing the work* before being told about *the process*. The clone does add a dedicated closing CTA block, which the original folds into the last line of its process section instead; that's a legitimate, minor structural improvement in isolation, but it doesn't offset the missing portfolio proof higher up the page.

---

## 2. Navigation, Information Architecture & Site Scope

This is the single largest, most measurable discrepancy between the two sites.

| Section | Original page count | Clone page count | Gap |
|---|---:|---:|---:|
| Home | 1 | 1 | — |
| About (index + individual bios) | 7 (index + 6 named staff bios: Andrew, Brandon, Jude, Luke, Squidly, Stefen) | 1 (single index, no individual bios) | −6 |
| Blog | 58 (index + ~57 posts/categories) | 0 (no `/blog/` route at all) | −58 |
| Work (index + case studies/category pages) | 50 | 9 (index + 8 case studies) | −41 |
| Services (index + detail pages) | 22 | 1 (index only, no detail pages) | −21 |
| Platforms (index + sub-pages) | 5 (index + HubSpot, Shopify, WordPress, Headless) | 1 (index only, no sub-pages) | −4 |
| Resources | 1 (downloadable asset/toolkit library) | 4 (index + 3 articles, functioning as a mini-blog) | Different purpose, not a true equivalent |
| Contact | 1 | 1 | — |
| Calendar | 1 | 0 | −1 |
| Privacy Policy | 1 | 0 | −1 |
| **Total (sitemap-verified)** | **147** | **19** | **−128 (~87% smaller)** |

**Finding.** The clone is best understood as a *partial front-page/skeleton reproduction*, not a full clone: it reproduces the home, about, contact, platforms, services, and work index templates, plus a working subset of ~8 case studies, but it has no blog, no individual staff pages, no service detail pages, no platform sub-pages, no calendar, and no privacy policy. For a UX audit this matters directly: any primary navigation item that promises "Blog," "Services," or a specific platform/service detail on the original will, on the clone, either not exist or resolve to a much shallower page — a **broken or truncated user journey** for anyone navigating in from a nav link or an internal cross-link that assumes the fuller IA (e.g., the original's `/services/` page links out to `/services/motion-graphics/`, `/services/photography/`, `/services/video/`; the clone's `/services/` page lists categories but has no drill-down routes at all).

**Navigation clarity, comparatively:** on the pages that do exist in both, both sites use the same shallow, predictable URL scheme (`/work/[slug]/`, `/about/`, `/contact/`, `/services/`), which is good practice on both sides and keeps breadcrumbing mentally simple. But clarity of *navigation labels* is undermined on the clone the moment a label implies depth the destination doesn't have (e.g., "Services" reading as a rich mega-menu on the original vs. a flat single page on the clone).

---

## 3. Content Fidelity & Trust

Design and UX are not just chrome — the credibility of an agency's own marketing site depends on the content being true. Direct comparisons on shared templates surfaced fabricated business-identity content in the clone:

| Field | Original (verified) | Clone (verified) |
|---|---|---|
| Office address | P.O. Box 116, Brooksville, FL 34605 | 123 Winter Park Ave, Suite 200, Winter Park, FL 32789 |
| Phone number | `352-325-7688` (real NANP exchange) | `(407) 555-1234` (`555` is the reserved fictional-number block in the North American Numbering Plan) |
| Founding team named on-site | Stefen, Luke, Caleb Kenney, Andrew (About page narrative) | "Alex Kelp" (Founder & Creative Director), Maria Santos, James O'Brien, Priya Patel |
| Elev8 Fun testimonial author | Caleb Williams, Director of Marketing at Elev8 FUN | Diana Rodriguez, COO, Elev8 Fun (name does not appear anywhere on the source site) |
| Other testimonials | Not present as separate named quotes in the fetched homepage/contact content beyond the Elev8 Fun quote | Sarah Mitchell (Spring Water Spirits) and Marcus Chen (Mountaineer Coffee) — both invented, not present on source |
| Founding year / story | 2018, credited to Stefen, Luke, and Caleb Kenney | 2018, credited to an invented generic narrative ("most agencies optimize for their own throughput…") |

**Severity: Critical (content-integrity), Confidence: Verified.** A literal placeholder phone number and invented staff/testimonial names are the kind of defect that would block a production launch of a real business site regardless of how good the visual design is — even in a portfolio/demo context, presenting fabricated named testimonials attributed to a real company (Elev8 Fun, Mountaineer Coffee, Spring Water Spirits — all real Kelp clients per the source site) creates a misattribution risk that should be swapped for clearly-fictional placeholder names (e.g., "Jane Doe, Example Co.") if the intent is a design-practice clone rather than a factual reproduction.

Separately, the shared `/work/elev8-fun/` case-study template shows the same pattern at smaller scale: the original cites the real platform (HubSpot), a real launched site (`elev8fun.com`), a concrete services list, and an attributed quote with a real project image; the clone's version uses generic, templated case-study prose ("The Challenge / Our Approach / The Solution / The Result") with no image reference and a fabricated quote source. The clone's case-study *shape* is fine UX practice (challenge → approach → solution → result is a standard, scannable structure) — the issue is exclusively the fabricated specificity layered on top of it.

---

## 4. Interaction Feedback, Forms & Responsiveness

- **Scroll-reveal interactions (Reasoned, both present).** Both sites annotate DOM nodes with reveal-on-scroll data attributes (`data-lg-reveal`/`data-lg-reveal-stagger` on the original, `data-reveal` on the clone), indicating both implement staggered fade/slide-in entrance animation as content scrolls into view. This is a shared, appropriate micro-interaction pattern for an agency portfolio site and suggests the clone did correctly port this piece of the interaction model, even where it changed the underlying content.
- **Contact/lead-capture pattern (Verified, genuinely different approaches).** The original's `/contact/` page is high-touch and personal: "Setup a chat with Andrew," a real phone number, and a real mailing address — consistent with a small, senior-team positioning. The clone's `/contact/` page instead implements a structured multi-field "Project brief" form (name, email, company, budget range, a checkbox-style service picker, project details) plus an alternate "schedule a call" link. As a piece of *pure lead-qualification UX*, the clone's structured intake form is arguably a stronger self-serve pattern for visitors who aren't ready to talk yet — this is one place the clone's design choice is defensible on its own merits, independent of the fabricated contact details layered under it.
- **Email-link resilience (Medium, Reasoned).** The clone's contact page renders its email address through a Cloudflare email-obfuscation endpoint (`/cdn-cgi/l/email-protection#…`). In the no-JavaScript/static extraction used for this audit, the visible link text resolved to the literal placeholder string `[email protected]` rather than a real, decoded address. If the obfuscation script fails to execute for any visitor (blocked script, slow network, certain accessibility tooling), the affected user is shown non-functional placeholder text instead of a working mailto link. Recommend verifying this decodes correctly across browsers/assistive tech, or using a progressive-enhancement-safe obfuscation method.
- **Responsiveness (Unverifiable).** No viewport emulation or device testing was available in this environment. Both sites are built on Astro, which does not itself guarantee responsive behavior — that depends entirely on each project's own CSS. **No claim is made here about mobile layout quality, breakpoint behavior, or touch-target sizing for either site.** This should be verified manually (at minimum 375px, 768px, and 1440px) before treating either site's mobile UX as validated.
- **Accessibility (Unverifiable).** Semantic heading structure looks reasonable on both sites from the DOM alone (see §1.3), but color contrast, focus states, and keyboard operability could not be tested without a rendering engine. Recommend an automated pass (axe DevTools or Lighthouse) plus manual keyboard-only navigation on both sites before drawing WCAG conclusions.

---

## 5. Findings Register (Audit Format)

Ordered by severity, not by section.

### F-1 — Fabricated business-identity content presented as real (address, phone, staff, testimonials)
- **Location:** `/about/`, `/contact/`, homepage testimonials (clone)
- **Evidence:** Clone lists office "123 Winter Park Ave, Suite 200, Winter Park, FL 32789" and phone "(407) 555-1234" (a reserved fictional NANP block); staff "Alex Kelp, Maria Santos, James O'Brien, Priya Patel"; testimonials from "Sarah Mitchell," "Marcus Chen," "Diana Rodriguez" — none of which appear on the source site, which instead documents Stefen/Luke/Caleb Kenney/Andrew, a Brooksville P.O. Box, phone 352-325-7688, and a testimonial from Caleb Williams of Elev8 Fun.
- **Impact:** Misrepresents a real, named client (Elev8 Fun, Mountaineer Coffee, Spring Water Spirits) via a fabricated quote/author; publishes a non-working placeholder phone number; would fail a pre-launch content QA if this were shipped as a real business site.
- **Severity:** Critical
- **Recommendation:** Replace fabricated names/numbers with clearly fictional placeholders (e.g., "Jane Doe, Example Co.," `(555) 010-0100` used consistently as an obvious placeholder pattern, or a visible "sample content" banner) if this is intentionally a design-practice clone.
- **Confidence:** Verified

### F-2 — Site scope reduced by ~87% versus the original's information architecture
- **Location:** Site-wide (sitemap comparison)
- **Evidence:** Original sitemap: 147 URLs across Home, About (+6 staff bios), Blog (58), Work (50), Services (22), Platforms (5), Resources, Calendar, Privacy Policy. Clone sitemap: 19 URLs; no Blog, no staff bios, no Calendar, no Privacy Policy, no Service or Platform detail pages, only 8 of ~40+ Work case studies.
- **Impact:** Any navigation, cross-link, or user expectation carried over from the original's nav/IA will dead-end or under-deliver on the clone.
- **Severity:** High
- **Recommendation:** Either scope the clone explicitly as a "homepage + core templates" demo (and label it as such in-product) or prioritize rebuilding Services detail pages and the Work case-study library next, since those are the primary conversion-supporting content types for an agency site.
- **Confidence:** Verified

### F-3 — Homepage omits the portfolio-proof and services-preview sections present on the original
- **Location:** Homepage (clone)
- **Evidence:** Original homepage DOM order includes a 5-item "Our Work" case-study teaser grid and an "Our Services" module between the hero and the process section; clone's homepage goes directly from the hero to the "How We Work" process section.
- **Impact:** Removes the visual social-proof step that typically precedes a "trust us with your project" narrative; weakens the persuasive arc of the homepage.
- **Severity:** High
- **Recommendation:** Reinstate a portfolio-teaser module (even a 3-item version) between the hero and the process section.
- **Confidence:** Verified

### F-4 — Brand-reinforcing visual motifs (wave-gradient divider, custom quote-mark icon) not found in clone markup
- **Location:** Homepage hero divider and testimonial block
- **Evidence:** Original embeds an inline SVG wave divider (`#bef3f4 → #80e6e9`) and a custom leaf-shaped SVG quotation mark (`#a1e39a`) directly in markup; no equivalent SVG elements appear in the clone's extracted DOM for the same sections.
- **Impact:** The ocean/"kelp" visual metaphor that ties the brand name to its color and iconography is diluted; the clone's testimonial block reads as a generic blockquote.
- **Severity:** Medium
- **Recommendation:** Reintroduce the wave-divider graphic and a themed quotation mark (or an equivalent on-brand motif) rather than a plain `<blockquote>`.
- **Confidence:** Reasoned (absence confirmed in DOM; a CSS-only reproduction cannot be ruled out without a rendered screenshot)

### F-5 — "Resources" repurposed from a downloadable brand-asset library into a 3-post mini-blog, losing a distinctive brand-voice touchpoint
- **Location:** `/resources/`
- **Evidence:** Original `/resources/` offers downloadable HubSpot themes, a WordPress plugin, brand-strategy PDF toolkits, and two custom display fonts ("Red Flag," "Black Flag") plus "Seaweed" and "Rope" Illustrator brushes — all reinforcing a playful ocean/pirate identity (see also the blog post "Partners vs Pirates: Navigating an Ocean of Digital Agencies"). Clone's `/resources/` instead lists three blog-style articles (one of which reuses the "Partners vs Pirates" title as an article, not a downloadable asset).
- **Impact:** Loses a genuinely distinctive brand-personality touchpoint and blurs the original's IA distinction between "Blog" (editorial) and "Resources" (tools/downloads).
- **Severity:** Medium
- **Recommendation:** If Blog is out of scope for the clone, keep "Resources" as a downloads/tools page rather than repurposing it as an article index, to preserve the source IA's intent.
- **Confidence:** Verified

### F-6 — Case-study template loses specificity and evidentiary detail
- **Location:** `/work/elev8-fun/` (and by extension, the other 7 case studies present on the clone)
- **Evidence:** Original names the real platform (HubSpot) and live URL (`elev8fun.com`), a concrete services list, a project image, and a named, titled quote source. Clone substitutes generic template prose ("The Challenge / Our Approach / The Solution / The Result") with no image reference in markup and a fabricated quote source.
- **Impact:** Reduces the persuasive/credibility value of the portfolio section, which is core to an agency's conversion path.
- **Severity:** Medium
- **Recommendation:** Retain the challenge/approach/solution/result structure (it's a sound content pattern) but populate with real or clearly-labeled sample specifics and at least one representative image per case study.
- **Confidence:** Verified

### F-7 — Email link may render as non-functional placeholder text without JavaScript
- **Location:** `/contact/` (clone)
- **Evidence:** Statically extracted contact page shows the visible email link text as the literal string `[email protected]` behind a Cloudflare `/cdn-cgi/l/email-protection#…` obfuscation endpoint, rather than a decoded address.
- **Impact:** Users or assistive technology that don't execute the decoding script may see a broken/placeholder email link.
- **Severity:** Medium
- **Recommendation:** Confirm decoding behavior across real browsers/assistive tech, or use a progressive-enhancement-safe alternative (e.g., server-rendered obfuscated `mailto:` with a visible, human-readable fallback).
- **Confidence:** Reasoned (behavior confirmed only in the no-JS static fetch used for this audit; not confirmed in a live browser)

### F-8 — `<title>` tag adds unsourced marketing copy not present on the original
- **Location:** Document `<title>`, homepage
- **Evidence:** Original title: "Kelp Creative Agency." Clone title: "Kelp Creative Agency — Central Florida's Award-Winning Creative Agency."
- **Impact:** Minor SEO/branding inconsistency; not user-visible on the page body itself.
- **Severity:** Low
- **Recommendation:** Align title-tag conventions with the source unless the longer form is an intentional SEO improvement.
- **Confidence:** Verified

### F-9 — Structured project-brief contact form (positive deviation)
- **Location:** `/contact/` (clone)
- **Evidence:** Clone implements a multi-field intake form (name, email, company, budget range, service-type selector, project details) in addition to direct contact info; original's fetched contact content shows a calendar/phone-first pattern without an equivalent on-page form.
- **Impact:** Potentially better self-serve lead qualification for visitors not ready for a call — a legitimate, defensible UX choice independent of the content-accuracy issues in F-1.
- **Severity:** Informational
- **Recommendation:** Keep this pattern; pair it with accurate contact details (see F-1) and confirm the "schedule a call" fallback link resolves correctly.
- **Confidence:** Verified

### F-10 — Shared framework and interaction model
- **Location:** Site-wide
- **Evidence:** Both sites emit `data-astro-cid-*` component-scoping attributes and hashed `/_astro/*` asset paths (Astro), and both implement scroll-triggered reveal animations via data attributes.
- **Impact:** Confirms the clone is technically well-positioned to match the original's interaction model; the gaps identified above are content/scope decisions, not framework limitations.
- **Severity:** Informational
- **Confidence:** Verified

---

## 6. Which Design Better Serves User Needs?

Judged strictly on what could be verified:

- **Cohesive brand identity:** **Original wins.** Its ocean/kelp metaphor is carried from the site name into color (aqua/teal/green), iconography (leaf-shaped quote marks, wave dividers), and even downloadable brand assets (pirate-script fonts, seaweed/rope brushes) and blog content ("Partners vs Pirates"). The clone keeps isolated fragments of this voice (one article title) without the supporting visual system, so its identity currently reads as a plainer, more generic professional-services template.
- **Navigation completeness and IA clarity:** **Original wins decisively**, by virtue of actually having the content its navigation implies (147 vs. 19 pages). A navigation system is only as trustworthy as the pages it points to.
- **Homepage persuasion funnel:** **Original wins** — it shows proof of work and a services overview before asking for commitment; the clone skips straight to internal process.
- **Trustworthiness of on-page facts:** **Original wins** — real address, real phone, real named client quote versus fabricated equivalents on the clone.
- **Lead-capture mechanics in isolation:** **Clone's structured form is a reasonable, arguably improved pattern** — the one area where the clone's independent design decision is defensible UX, separate from its content-accuracy problems.
- **Technical foundation:** **Comparable** — both on Astro, both implementing scroll-reveal micro-interactions, both using clean semantic heading structure and predictable URL patterns on the pages that exist.

**Overall:** the original delivers a materially more cohesive, complete, and trustworthy digital experience. The clone is best read as a **partial, front-end-focused reproduction** of the original's homepage and a handful of core templates — a reasonable starting skeleton for a design/dev practice project — but it is not yet a comparable substitute in scope, content integrity, or brand-identity reinforcement, and it should not be treated as production-ready or as an accurate representation of the real Kelp Creative Agency business without the corrections in F-1 through F-8.

---

## Limitations of This Assessment

- No headless-browser rendering, screenshot capture, or computed-style inspection was available in this environment; all "Unverifiable" items above (typography specimens, exact spacing/rhythm, responsive breakpoint behavior, color contrast ratios, focus-state visibility, animation timing) require a follow-up pass with real browser tooling (e.g., Playwright/Puppeteer screenshot diffing, Chrome DevTools computed styles, Lighthouse, and axe DevTools) before they can be scored with the same confidence as the content/IA findings in this report.
- This audit reflects a point-in-time snapshot of both live sites; both may change post-publication.
- Findings are based on server-rendered/extracted markup; any content that is rendered exclusively client-side after complex interaction (e.g., content behind a tab/accordion click) may not have been captured — this is explicitly flagged where it affected a specific page (see the homepage "Our Services" module on the original, which returned an empty body in static extraction and was cross-checked against the dedicated `/services/` page instead).

---

## Appendix: Sitemap Diff Summary

- **Original (`kelp.agency`) total indexed URLs:** 147
- **Clone (`astro.jesspete.shop`) total indexed URLs:** 19
- **Sections present on original but entirely absent from clone:** Blog (58 URLs), individual staff bio pages (6 URLs), Calendar, Privacy Policy, Platform sub-pages (Headless/HubSpot/Shopify/WordPress detail, 4 URLs), all Service detail pages (21 URLs)
- **Sections present on both, at reduced depth on clone:** Work/case studies (9 of 50 on clone), Resources (repurposed as a 3-article index rather than a downloads library)
- **Sections at full parity:** Home, About (index only), Contact, Platforms (index only), Services (index only)
