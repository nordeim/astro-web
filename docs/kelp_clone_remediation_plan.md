# Remediation Plan: Kelp Agency Clone (`astro.jesspete.shop`)
## Objective: Close remaining gaps between clone and original (`kelp.agency`) using Astro 7 patterns

**Plan Date:** 2026-08-05  
**Target Repo:** `https://github.com/nordeim/astro-web.git`  
**Live Clone:** `https://astro.jesspete.shop/`  
**Reference Original:** `https://www.kelp.agency/`  
**Guiding Skills:** `astro-7` (canonical platform), `astro-7-patterns` (production field notes)

---

## 0. Current State Assessment

The codebase has undergone **4 documented remediation rounds** (2026-08-03 through 2026-08-04) and is now a structurally sound Astro 7 static site with:

| Area | Status | Evidence |
|------|--------|----------|
| Multi-page architecture (21 pages) | ✅ Complete | `/work/`, `/services/`, `/resources/`, `/platforms/`, `/contact/`, `/about/` |
| Content collections (4 collections, Zod 4) | ✅ Complete | `caseStudies`, `services`, `articles`, `testimonials` |
| Astro 7 + Tailwind 4 + Fonts API | ✅ Complete | `astro.config.mjs`, `src/styles/global.css` |
| View Transitions + script re-init | ✅ Complete | `ClientRouter`, `astro:after-swap` listeners |
| SEO meta + sitemap + robots.txt | ✅ Complete | `@astrojs/sitemap`, OG tags, canonical URLs |
| JSON-LD structured data | ✅ Complete | `BaseLayout.astro` emits schema.org graph |
| Accessibility (WCAG 2.2 AA baseline) | ✅ Complete | Focus management, `aria-*`, skip link, reduced-motion |
| Build verification (link + content checks) | ✅ Complete | `scripts/link-check.mjs`, `scripts/validate-content.mjs` |
| Pre-build dependency guard | ✅ Complete | `scripts/verify-deps.mjs` wired to `prebuild`/`precheck` |

**However**, my live-site comparative analysis (conducted prior to reviewing the repo) identified **15 critical/high/medium discrepancies** that fall into three categories:

1. **Brand fidelity gaps** — The clone still lacks the distinctive Kelp visual identity system (green frond logomark, authentic portfolio imagery, real client evidence).
2. **Content authenticity gaps** — Placeholder testimonials and fictional team members undermine trust, even if ethically handled.
3. **Technical depth gaps** — Several Astro 7 capabilities and production patterns from the attached skills are not yet leveraged (testing, CI/CD, performance budgets, advanced routing).

This plan addresses all three categories in **5 phases**, ordered by impact and dependency.

---

## Phase 1: Brand Identity & Visual Fidelity (Highest Impact)

**Goal:** Make the clone visually indistinguishable from the original at first glance. The current site has the structure but not the soul.

### 1.1 Logomark Restoration
**Severity:** 🔴 Critical  
**Skill Reference:** `astro-7-patterns` §10 (design extraction), comparative analysis §1.1

The original `kelp.agency` uses a **custom logomark** — three stylized green kelp fronds in a vibrant kelp green (`#42c634` or similar) paired with a dark navy wordmark. The clone's `public/favicon.svg` is described as a "Kelp 'K' wordmark" — this is not the same asset.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 1.1.1 | Extract the original SVG logomark from `kelp.agency` via `agent-browser eval` or direct download | Obtain clean SVG with the three fronds |
| 1.1.2 | Replace `public/favicon.svg` and add a header logo component | Logo renders at `72×72` header size and `32×32` favicon size |
| 1.1.3 | Verify color match | Frond color matches `--color-kelp: #42c634` within 2% tolerance |
| 1.1.4 | Add SVG `aria-label="Kelp Creative Agency home"` and `<title>` | Passes a11y audit |

**Verification:**
```bash
# Extract original logo colors
agent-browser eval "getComputedStyle(document.querySelector('header svg, header img')).fill"
```

### 1.2 Portfolio Imagery
**Severity:** 🔴 Critical  
**Skill Reference:** `astro-7` §Image Optimization (`astro:assets`)

The original's "Our Work In the real-world" section features **real project screenshots** (Spring Water Spirits branding, Artisan Talent web design, Pizzarrito restaurant theme, Deals In Dirt branding). The clone has content collection entries but the README does not confirm high-fidelity portfolio imagery is present.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 1.2.1 | Audit `src/content/case-studies/*.md` — does each entry have a `cover` frontmatter field pointing to an optimized image? | 100% of case studies have `cover` |
| 1.2.2 | If images are missing or low-res, extract/screenshot the original's portfolio grid | Images are `1200×800` minimum, WebP/AVIF via `<Image />` |
| 1.2.3 | Implement `astro:assets` `<Image />` for all case study cards and detail pages | No raw `<img src="...">` for local images |
| 1.2.4 | Add `loading="lazy"` for below-fold portfolio cards, `loading="eager"` for hero/featured | Lighthouse LCP < 2.5s |

**Anti-pattern to avoid:** Using plain `<img src="/images/hero.png">` bypasses Astro's optimization pipeline. Always use `import heroImg from '../assets/hero.png'` + `<Image src={heroImg} ... />`.

### 1.3 Client Logo Bar
**Severity:** 🟠 High  
**Skill Reference:** Comparative analysis §2.1

The original displays real client logos (Elev8 Fun, Marker 48, Beverlin Hills, HS&R) in a horizontal bar near the hero. The clone does not appear to have this social-proof element.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 1.3.1 | Extract client logos from original or source from official brand kits | 4–6 client logos in SVG or optimized PNG |
| 1.3.2 | Add a `Clients.astro` homepage section between Hero and RecentWork | Horizontal flex/grid, grayscale → color on hover |
| 1.3.3 | Ensure logos have `alt="[Client Name]"` and sufficient contrast | WCAG 1.4.11 (non-text contrast) |

### 1.4 Color System Audit
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7-patterns` §4 (Tailwind 4 + Fonts API)

The clone defines `--color-kelp: #42c634`. The original's green may differ slightly. Use `agent-browser` to extract exact computed colors.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 1.4.1 | Run design extraction workflow (§10) against original | Capture all `--color-*` tokens |
| 1.4.2 | Reconcile clone tokens with extracted values | ΔE < 3 for all brand colors |
| 1.4.3 | Document final token map in `docs/kelp-design-template.md` | Single source of truth |

---

## Phase 2: Content Authenticity & Trust Architecture

**Goal:** Replace every placeholder with either (a) real, verifiable content or (b) explicitly fictional content that cannot be mistaken for real. The current "Jane Doe / Sample Brand" approach is safe but thin.

### 2.1 Testimonial Strategy
**Severity:** 🟠 High  
**Skill Reference:** `astro-7-patterns` §15 (fabricated content anti-pattern)

Current state: 3 testimonials with fictional names (Jane Doe, John Smith, Alex Sample) and fictional companies (Sample Brand, Demo LLC, Test Corp). This is **ethically correct** (no misattribution) but **commercially weak** (zero social proof).

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 2.1.1 | **Option A (Preferred):** Obtain real testimonials from Kelp's public sources (Google Reviews, LinkedIn recommendations, Clutch.co) with attribution | Each testimonial has real name, real role, real company, source URL |
| 2.1.2 | **Option B (Fallback):** If real quotes cannot be sourced, replace with **case-study excerpts** — pull a compelling sentence from each case study's Markdown body and attribute it to the case study subject | Attribution links to `/work/[slug]/` |
| 2.1.3 | Remove all "Sample Brand / Demo LLC / Test Corp" references | Zero fictional company names remain |
| 2.1.4 | Add `itemReviewed` or `author` schema.org markup to testimonials if real | JSON-LD validates in Google's Rich Results Test |

**Critical constraint:** Never ship a fabricated quote attached to a real company name. That is a liability, not a placeholder.

### 2.2 Team / About Page
**Severity:** 🟠 High  
**Skill Reference:** Comparative analysis §2.2

The original's About page likely features real team members. The clone uses fictional placeholders with an explicit disclaimer.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 2.2.1 | Source real team information from Kelp's public channels (LinkedIn, original About page) | Real names, real roles, real photos |
| 2.2.2 | If real photos cannot be sourced, use professional headshot placeholders (e.g., UI Faces) with **explicit fictional naming** | No risk of impersonation |
| 2.2.3 | Add `Person` schema.org markup for each team member | JSON-LD validates |

### 2.3 Contact Information
**Severity:** 🟠 High  
**Skill Reference:** `astro-7-patterns` §15

Round 4 replaced fabricated contact info with real Kelp data. Verify this is consistent across all touchpoints.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 2.3.1 | Audit every file for phone/email/address consistency | `grep -rn "352-325-7688\|info@kelp.agency\|Brooksville" src/ content/` |
| 2.3.2 | Ensure `Organization` JSON-LD matches contact page | Phone, email, address identical |
| 2.3.3 | Add `tel:` and `mailto:` links | Click-to-call, click-to-email works on mobile |

---

## Phase 3: Technical Excellence & Astro 7 Depth

**Goal:** Leverage every relevant Astro 7 capability from the attached skills to make this not just a clone, but a **showcase** of modern Astro engineering.

### 3.1 Testing Infrastructure
**Severity:** 🟠 High  
**Skill Reference:** `astro-7` §Testing, `astro-7-patterns` §14

Current state: "No test runner, linter, or formatter is configured." This is a gap for a "production-ready" clone.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 3.1.1 | Add **Vitest** for unit testing | `npm install -D vitest`; `vitest.config.ts` with `getViteConfig` |
| 3.1.2 | Add **Playwright** for E2E testing | `npm install -D @playwright/test`; test homepage, navigation, carousel, mobile menu |
| 3.1.3 | Add **Lighthouse CI** for performance regression | `@lhci/cli`; assert Performance ≥ 90, Accessibility ≥ 90 |
| 3.1.4 | Wire all checks into a CI script | `npm run verify` = `check && check:links && check:content && vitest run && playwright test` |

**Playwright test spec (minimum):**
```typescript
// tests/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Kelp Creative Agency');
});

test('carousel advances on next click', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-carousel-next]');
  await expect(page.locator('[data-carousel-counter]')).toHaveText('2 / 9');
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.click('[data-mobile-menu-toggle]');
  await expect(page.locator('#mobile-menu')).not.toHaveClass('hidden');
  await page.click('[data-mobile-menu-toggle]');
  await expect(page.locator('#mobile-menu')).toHaveClass('hidden');
});

test('view transitions do not break scripts', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/about/"]');
  await page.waitForEvent('astro:after-swap');
  await page.click('[data-carousel-next]'); // re-init check
});
```

### 3.2 Performance Optimization
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Image Optimization, `astro-7-patterns` §14

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 3.2.1 | Verify all images use `astro:assets` `<Image />` or `<Picture />` | Zero raw `<img>` for local assets |
| 3.2.2 | Add `fetchpriority="high"` to LCP image (hero or first portfolio card) | Lighthouse LCP < 2.0s |
| 3.2.3 | Verify `prefetch` config is working | Hover a link → Network tab shows prefetch request |
| 3.2.4 | Add `@astrojs/partytown` for any third-party scripts (analytics, chat) | Third-party JS runs in web worker |
| 3.2.5 | Run `npm run build` and audit `dist/` bundle size | Total JS < 15KB per page (excluding fonts) |

### 3.3 Contact Form Backend
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Forms, `astro-7-patterns` §15

Current state: "Stub HTML form with no backend."

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 3.3.1 | **Option A:** Wire to Formspree (`action="https://formspree.io/f/YOUR_ID"`) | Form submits successfully, user sees confirmation |
| 3.3.2 | **Option B (Astro-native):** Convert to Astro Action (experimental) with Zod validation | Type-safe, server-side validation, no external dependency |
| 3.3.3 | Add honeypot field + `security.checkOrigin: true` | CSRF protection active |
| 3.3.4 | Add success/error states with `aria-live="polite"` | Screen readers announce result |

**Astro Action pattern (if choosing Option B):**
```typescript
// src/actions/index.ts
import { defineAction, z } from 'astro:actions';

export const server = {
  contact: defineAction({
    input: z.object({
      name: z.string().min(1).max(100),
      email: z.email(),
      message: z.string().min(10).max(5000),
    }),
    handler: async (input) => {
      // Send email via Resend / SendGrid / AWS SES
      await sendEmail(input);
      return { success: true };
    },
  }),
};
```

### 3.4 Route Caching (Astro 7+)
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Route Caching

If the site ever moves to SSR (e.g., for a dynamic blog or personalized content), route caching should be pre-configured.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 3.4.1 | Document route caching strategy in `docs/astro-7-patterns.md` | Cache TTL, tags, invalidation rules defined |
| 3.4.2 | If SSR adapter is added later, implement `Astro.cache` on expensive pages | Dashboard/data-driven pages cache for 60s |

---

## Phase 4: Content Depth & Information Architecture

**Goal:** Match the original's content richness. The clone has the skeleton; now add the muscle.

### 4.1 Blog / Content Hub
**Severity:** 🟠 High  
**Skill Reference:** `astro-7` §Content Collections

The original has an active blog (`/blog/`). The clone has `/resources/` with 3 articles.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 4.1.1 | Rename `/resources/` → `/blog/` (or add `/blog/` as alias via `redirects` config) | `/blog/` returns 200 |
| 4.1.2 | Add 3–5 more articles with real, valuable content (or clone original blog posts) | 6+ total articles |
| 4.1.3 | Add RSS feed (`@astrojs/rss`) | `/rss.xml` returns valid RSS 2.0 |
| 4.1.4 | Add article categories/tags | Filterable index page |
| 4.1.5 | Add `BlogPosting` schema.org markup | JSON-LD validates |

### 4.2 Services Detail Pages
**Severity:** 🟡 Medium  
**Skill Reference:** Comparative analysis §2.1

The clone has `/services/` (index) but may lack individual service detail pages.

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 4.2.1 | Create `/services/[slug].astro` dynamic route | Each service category has its own page |
| 4.2.2 | Populate with detailed descriptions, process, and related case studies | 500+ words per service |
| 4.2.3 | Add `Service` schema.org markup | JSON-LD validates |

### 4.3 Case Study Detail Enhancement
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Content Collections

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 4.3.1 | Add `gallery` field to case study schema (array of image paths) | Zod schema updated, all entries validated |
| 4.3.2 | Render gallery on `/work/[slug].astro` | Lightbox or carousel for project images |
| 4.3.3 | Add "Related Work" section at bottom of each case study | 2–3 related case studies by category |
| 4.3.4 | Add `CreativeWork` schema.org markup | JSON-LD validates |

---

## Phase 5: Production Hardening & Deployment

**Goal:** Make the clone deployable, monitorable, and maintainable by a team.

### 5.1 CI/CD Pipeline
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Deployment

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 5.1.1 | Add GitHub Actions workflow (`.github/workflows/ci.yml`) | Runs on every PR: `npm install`, `npm run verify` |
| 5.1.2 | Add deploy workflow for `main` branch | Auto-deploy to Netlify/Vercel/Cloudflare on merge |
| 5.1.3 | Add branch preview deploys | Every PR gets a unique preview URL |

### 5.2 Environment Configuration
**Severity:** 🟡 Medium  
**Skill Reference:** `astro-7` §Typed Environment Variables (`astro:env`)

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 5.2.1 | Audit `astro.config.mjs` for hardcoded secrets or URLs | Zero hardcoded API keys |
| 5.2.2 | Migrate any env vars to `astro:env` schema | `envField.string({ context: 'server', access: 'secret' })` for secrets |
| 5.2.3 | Add `.env.example` | All required env vars documented |
| 5.2.4 | Verify `astro:env` types are imported correctly | `import { DATABASE_URL } from 'astro:env/server'` — no `import.meta.env` for new code |

### 5.3 Security Audit
**Severity:** 🟠 High  
**Skill Reference:** `astro-7` §Security, `astro-7-patterns` §15

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 5.3.1 | Verify `security.checkOrigin: true` in `astro.config.mjs` | CSRF protection active |
| 5.3.2 | Audit all `set:html` usage | Only used for JSON-LD (server-controlled); zero user input |
| 5.3.3 | Verify cookies use `httpOnly`, `secure`, `sameSite` | If sessions added later, cookie flags are correct |
| 5.3.4 | Run `npm audit` and fix critical vulnerabilities | Zero critical advisories |
| 5.3.5 | Add security headers via middleware or platform config | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` |

### 5.4 Monitoring & Analytics
**Severity:** 🟢 Low  
**Skill Reference:** N/A

| Task | Action | Acceptance Criteria |
|------|--------|---------------------|
| 5.4.1 | Add privacy-respecting analytics (Plausible, Fathom, or Cloudflare Web Analytics) | Script loads via `<script>` with `defer`, no cookie banner needed |
| 5.4.2 | Add error tracking (Sentry) if moving to SSR | Captures runtime errors |
| 5.4.3 | Add uptime monitoring | Pingdom/UptimeRobot checks `/` every 5 min |

---

## Remediation Execution Order

```
Phase 1 (Brand) ──────────────────────────────────────────────►
    ├─ 1.1 Logomark
    ├─ 1.2 Portfolio Imagery
    ├─ 1.3 Client Logo Bar
    └─ 1.4 Color Audit
         │
         ▼
Phase 2 (Content) ────────────────────────────────────────────►
    ├─ 2.1 Testimonials (real or case-study excerpts)
    ├─ 2.2 Team / About
    └─ 2.3 Contact Consistency
         │
         ▼
Phase 3 (Technical) ────────────────────────────────────────►
    ├─ 3.1 Testing (Vitest + Playwright + Lighthouse CI)
    ├─ 3.2 Performance (images, prefetch, partytown)
    ├─ 3.3 Contact Form Backend
    └─ 3.4 Route Caching (documented)
         │
         ▼
Phase 4 (Content Depth) ────────────────────────────────────►
    ├─ 4.1 Blog / RSS
    ├─ 4.2 Services Detail Pages
    └─ 4.3 Case Study Galleries
         │
         ▼
Phase 5 (Production) ───────────────────────────────────────►
    ├─ 5.1 CI/CD
    ├─ 5.2 astro:env
    ├─ 5.3 Security Audit
    └─ 5.4 Monitoring
```

**Dependency rule:** Phase N cannot start until Phase N-1's 🔴 Critical and 🟠 High tasks are complete. 🟡 Medium and 🟢 Low tasks within a phase can be parallelized.

---

## Verification Gates

After each phase, run the full verification suite:

```bash
# Gate 1: Type-check + build
npm run check        # 0 errors, 0 hints
npm run build        # 21+ pages, exit 0

# Gate 2: Content + links
npm run check:links    # 0 broken internal links
npm run check:content  # 0 validation errors

# Gate 3: E2E (after adding Playwright)
npx playwright test    # All specs pass

# Gate 4: Performance
npx lhci autorun       # Performance ≥ 90, Accessibility ≥ 90

# Gate 5: Security
npm audit              # 0 critical vulnerabilities
curl -I https://astro.jesspete.shop/  # Security headers present
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cannot extract original logomark (copyright) | Medium | High | Create original "inspired-by" mark; document as homage |
| Cannot source real testimonials | Medium | High | Use case-study excerpts (Option B in 2.1.2) |
| Astro Actions API changes (experimental) | Medium | Medium | Pin Astro version; monitor changelog; have Formspree fallback |
| Playwright tests flaky in CI | Medium | Medium | Use `retries: 2` in `playwright.config.ts`; run against preview server |
| Build time increases with more content | Low | Low | Content is Markdown — Astro's build scales linearly; monitor |

---

## Definition of Done

The remediation is complete when:

- [ ] All 🔴 Critical tasks from Phases 1–2 are resolved
- [ ] All 🟠 High tasks from Phases 1–3 are resolved
- [ ] `npm run check` passes (0 errors, 0 hints)
- [ ] `npm run build` produces 21+ pages with 0 warnings
- [ ] `npm run check:links` reports 0 broken internal links
- [ ] `npm run check:content` reports 0 validation errors
- [ ] Playwright E2E suite passes (homepage, navigation, carousel, mobile menu, view transitions)
- [ ] Lighthouse CI asserts Performance ≥ 90 and Accessibility ≥ 90
- [ ] `npm audit` reports 0 critical vulnerabilities
- [ ] A human can navigate the clone and the original side-by-side and not immediately identify the clone as inferior in brand fidelity, content depth, or interaction polish

---

*Plan compiled from live-site comparative analysis, Astro 7 canonical skill, and Astro 7 production patterns skill. All tasks are traceable to specific skill sections or comparative analysis findings.*
