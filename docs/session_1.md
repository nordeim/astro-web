Now let me read the core docs (AGENTS.md, CLAUDE.md, README.md) and explore the skills catalog and astro-7 SKILL.md in parallel:
Now let me explore the source structure and the astro-7 skill for audit guidance:
Now let me read the skills catalog to find astro-7 review patterns, the design template, and set up a clean install of the project. Let me also look at the agent-browser skill and git push wrapper in parallel:
Now let me run `npm install` in the background while I review the source files:
Baseline is clean. Now let me build the project to make sure it's working:
Let me read all the core source files in parallel batches:
Now let me read the home components and pages in parallel:
I see immediate potential bugs — the Hero references non-existent case studies. Let me continue exploring the remaining components and pages:
Now let me look at the remaining pages:
Now let me check the public folder, look at the design template, and inspect the agent-browser + git-push skills in parallel:
Now let me check the git push wrapper, agent-browser skill, and look at the IMPLEMENTATION_PLAN to understand any known issues:
I now have a comprehensive understanding of the codebase. Let me update my todo list and invoke the agent-browser skill for E2E testing:
Agent-browser is installed. Let me set up the SSH key in parallel and start E2E testing the deployed clone:
Paramiko is now installed in the correct Python. Now let me test the deployed site and the original site in parallel:
Now let me test a few specific interactions and verify the broken links on the deployed site:
**Confirmed**: The Marker 48 link on the homepage navigates to a 404 page. Let me also test Beverlin Hills and the Footer "Clients" link, then capture a 404 screenshot:
Both broken links confirmed. Let me also test the contact form, social links, and check the schedule call link:
Confirmed: 5 placeholder `#` links on the deployed site (4 social links + 1 "Schedule a discovery call" link). Now let me test the original kelp.agency site to compare the actual design:
Let me take a screenshot of the original kelp.agency to compare visually, then check the carousel focusable state:
Let me verify a few more critical URLs on the original kelp.agency to understand what's missing:
Let me check the carousel keyboard accessibility and a few more items, then close the browser:
I have comprehensive data now. Let me close the browser and write the comprehensive remediation plan:
Now let me also do one more important verification — confirm the missing files I observed in source code and check for any `aria-current` issues on the original site for nav active state. Let me also check the existing testimonials/services content files since they're unused:
Let me check the CODE_REVIEW_CONSOLIDATION_SUMMARY.txt that I noticed earlier in skills folder, and look at any existing issue tracker:
Now I have all the data needed. Let me write a comprehensive audit findings document and remediation plan. I'll save this as a working document in the repo:
Now let me create the comprehensive remediation plan with the detailed ToDo list:
Now let me execute **Phase 0 — TDD harness**. I'll create the link-checker and content-validator scripts:
Now add the scripts to package.json:
Now run the validators against the current build to capture the RED state:
Let me fix the validator to handle the `[]` empty array syntax in YAML:
RED state captured (1 content error). Now run the link-checker against the current build:
The `*/` in `dist/**/*.html` is closing the JSDoc comment early. Let me fix that:
Excellent — RED state captured: 19 broken internal links + 1 content error. Now executing **Phase 1 — Critical fixes (C1–C4)**:

**T1.1 — Fix `partners-vs-pirates.md` frontmatter (C4):**
**T1.2 — Add 3 missing case studies (C1):**
**T1.3 — Fix Hero Beverlin Hills link slug (C1):**
**T1.4 — Add `/work/clients/` page (C2):**
**T1.5 — Replace 5 placeholder `#` links (C3):**
Now I need to update the Footer link rendering to add `target="_blank"` and `rel="noopener noreferrer"` for external links:
Now fix the contact page "Schedule a 30-minute discovery call" link:
**T1.6 — Run verification (GREEN expected):**
TypeScript needs the optional `external` field typed. Let me fix the Footer:
Just an unused import hint. Let me clean that up:
21 pages built (was 17, added 4: clients, marker-48, croom-brewery, beverlin-hills-quality-goods). Now run the link-checker and content-validator:
**Phase 1 GREEN** — all critical link and content errors resolved. Now **Phase 2 — High config fixes (H1–H4)**:
Now install `@astrojs/sitemap`:
Now create `robots.txt`:
Now fix the theme-color (H4):
Now verify Phase 2 — build + check + sitemap:
Phase 2 complete — sitemap and robots.txt generated, canonical URL points to `astro.jesspete.shop`. Run link-checker to make sure nothing broke:
The link-checker is flagging the canonical URL on the 404 page (`/404/` doesn't exist as a directory — the file is `/404.html`). Let me fix the resolver to also try `.html` files as fallback:
Phase 2 GREEN. Now **Phase 3 — Architecture fixes (H5–H8) — use collections**:
**T3.2 — Populate service offerings in markdown files (H6 part A):**
**T3.3 — Add `anchor` field to services schema + refactor Services.astro and services/index.astro (H6 part B):**
Now refactor the homepage Services.astro:
Now refactor the `/services/index.astro` page:
**T3.4 — Refactor `FeaturedArticles.astro` (H7):**
**T3.5 — Refactor `RecentWork.astro` (H8):**
Now run check + build + link-check for Phase 3:
Phase 3 complete (and T4.1 for carousel a11y done as a bonus). Now **Phase 4 — Medium fixes (M2–M6)**:

**T4.2 — Add dropdown menus to Header (M2):**
Now add the dropdown CSS styles and the `--header-height` variable to global.css (also handles M6):
Now add the dropdown menu CSS and the header-nav-list styles. Let me view what's currently after `.nav-link[aria-current="page"]::after`:
**T4.3 — Add Headless platform (M3):**
Now add Headless link to Footer Platforms column:
**T4.4 — Remove `prose prose-lg` classes + add minimal Markdown styles (M4):**
Now add `.prose-kelp` styles to global.css:
**T4.5 — Fix 404 padding (M5):**
**T4.6 — Use `--header-height` variable in mobile menu (M6):** Already done in the Header.astro rewrite (line `style="top: var(--header-height);"`). Let me verify it's there:
Good. Now run check + build + link-check for Phase 4:
Let me fix the unused parameter hint:
Phase 4 complete. Now **Phase 5 — Low fixes (L1, L2, L5)**:
Now make the OG image meta always render (since ogImage now always has a value):
**T5.2 — Fix viewport meta (L5):**
Run a check before Phase 5 is complete:
**T5.3 — Update README (L2):**
Now update the Quick Start section to include the new commands:
Now update the File Hierarchy section to reflect new files, and update the Changelog:
Now update the changelog:
Now **Phase 6 — Documentation updates (AGENTS.md, CLAUDE.md, design template)**:
Now update CLAUDE.md:
Now update the design template to mention the dropdown menus and verification checklist:
Now **Phase 7 — Final verification**. Run all checks:
All GREEN. Now let me run a quick local E2E test with agent-browser against the local preview to verify the dropdowns and carousel work:
All 7 critical URLs return 200. Now let me run agent-browser against the local preview to verify the dropdowns and carousel:
Excellent! The dropdown menus show `[expanded=false]` and the carousel is now `region "Recent work carousel" focusable [tabindex]`. Let me test the dropdown interaction:
The click navigated to /services/ (as designed — the parent link has a real href). Let me verify the hover behavior on the homepage:
**Dropdown works on hover** — Services reveals 5 submenu links (Branding & Design, Websites, Marketing & Strategy, Video & Photo, Ongoing Support). Let me also verify the canonical URL and meta tags:
All meta tags are correct. Let me also test the carousel keyboard interaction:
**Carousel keyboard nav works** — focus moves to the wrapper, ArrowRight advances to slide 2, ArrowLeft goes back to slide 1. Now let me verify the testimonials section shows 3 entries (was 1):
3 testimonials now render (was 1). Let me also verify the homepage Hero links work:
The Beverlin Hills Hero link now resolves to the correct case study page. Let me also take a screenshot of the local clone for visual comparison:
Phase 7 complete. Now **Phase 8 — Git commit and push**:
Let me verify the .gitignore and check what's about to be committed:
Now let me commit in atomic, logical units. First check git config:
Now do the commits in atomic units. **Commit 1 — test harness + audit docs:**
Let me commit in 5 atomic, logical units. **Commit 1 — test harness + config infrastructure:**
**Commit 2 — Critical broken links + malformed frontmatter (C1-C4):**
**Commit 3 — Architecture: use content collections (H5-H8):**
**Commit 4 — Medium fixes: dropdowns, headless, prose, 404, header (M1-M6):**
**Commit 5 — Layout fixes + documentation (H4, L1, L2, L5, Phase 6):**
Verify the commits and that working tree is clean:
Working tree clean, 5 commits ahead of origin/main. Now let me set up the SSH remote and push:
Now push using the SSH wrapper:
**Push successful!** Let me verify the push:
`## main...origin/main` (no ahead/behind) — push confirmed. Let me also do a final verification by re-running the entire test suite:
All checks pass. Let me update the todo list to mark everything complete:
All work complete. Here's the summary of what was accomplished:

## Summary

I cloned `nordeim/astro-web`, performed a systematic Mode-C audit (code review + E2E via `agent-browser` against the deployed site and the original `kelp.agency`), identified **26 findings (4 Critical, 8 High, 6 Medium, 5 Low, 3 Informational)**, and remediated them with a TDD approach.

**Critical fixes:** Added 3 missing case studies (Marker 48, Croom Brewery, Beverlin Hills Quality Goods) + new `/work/clients/` page; fixed 5 broken Hero/Footer links, 5 placeholder `href="#"` links, and malformed `partners-vs-pirates.md` frontmatter.

**High fixes:** Corrected `astro.config.mjs` site URL → `https://astro.jesspete.shop`; added `@astrojs/sitemap` + `public/robots.txt`; fixed theme-color; refactored all 4 homepage sections (`Testimonials`, `Services`, `FeaturedArticles`, `RecentWork`) to consume content collections via `getCollection()` (eliminated single-source-of-truth violations).

**Medium fixes:** Added accessible dropdown menus to the Header (with proper ARIA, Escape-to-close, outside-click-to-close); added the missing 4th "Headless" platform; made the carousel keyboard-focusable with slide ARIA semantics; replaced unused `prose prose-lg` classes with a project-local `.prose-kelp` style block; extracted `--header-height` CSS variable.

**TDD harness:** Added `scripts/link-check.mjs` and `scripts/validate-content.mjs` as `npm run check:links` / `npm run check:content` — caught 19 broken links + 1 malformed frontmatter in RED state, both GREEN after fixes.

**Result:** 21 pages built (was 17), 0 broken internal links, 0 content validation errors, `npm run check` clean. Documentation (README, AGENTS, CLAUDE, design template) updated; full audit findings + remediation plan saved to `docs/audit/`.

**5 atomic commits pushed to `main`** at `github.com:nordeim/astro-web.git` via the SSH wrapper.

**Next steps for you:** (1) Add `public/og-default.png` (1200×630) so social shares have a preview image; (2) redeploy `dist/` to `astro.jesspete.shop` to make the fixes live; (3) optionally replace real article body content (currently placeholder) and point the 4 social links at actual Kelp profiles.

---

I'll address this build error systematically. The root cause is clear from the error message — the user's local environment doesn't have `@astrojs/sitemap` installed despite it being in `package.json`. Let me investigate and verify.
Let me reproduce the error by removing node_modules and installing fresh — exactly as the user would after pulling:
The build succeeds in my environment. Let me verify the package.json and package-lock.json state to understand the user's situation:
Now I understand the root cause. Let me verify my analysis with a careful examination:
The lockfile is correct — `node_modules/@astrojs/sitemap` is properly registered. Let me verify the actual install works and check what's happening more thoroughly:
Confirmed: the lockfile and install are correct. The user's error happens because they pulled new commits (which added `@astrojs/sitemap` to `package.json`) but did NOT run `npm install` before `npm run build`. Their stale `node_modules/` from before the pull doesn't have `@astrojs/sitemap`.

Now let me do a thorough review for any OTHER outstanding issues in the codebase:
All clean in my environment. Now let me run agent-browser E2E against the deployed site (which still has the OLD pre-remediation code) to look for any remaining issues, and also do a static analysis sweep:
Good — only the audit doc (historical) references `kelp-clone.example.com`. Let me check a few more potential issues:
Let me run one more thorough E2E check via agent-browser against the local preview to catch any remaining issues:
I found a second outstanding issue: `/og-default.png` returns 404 (the OG image meta tag references a file that doesn't exist). Let me also verify the dep verification approach works:
Both approaches work. Let me update todos and write the remediation plan:
**Phase 1 — TDD: prebuild dep check (B1).** Write the script first:
**T1.2 — Test RED:** temporarily rename the sitemap dir and verify the script catches it:
RED test passes — script catches the missing dep with a clear message. Now restore and test GREEN:
GREEN — exit 0, silent on success. Now wire it into `package.json` as `prebuild` and `precheck`:
**T1.5 — Test the full flow:** simulate the user's exact scenario (missing dep, run `npm run build`):
The message is correct. Let me verify the exit code properly (the `tail` pipe was masking it):
`npm run build` now exits 1 with a clear message when deps are missing — no more confusing Vite stack trace. Now verify the happy path:
Phase 1 complete. **Phase 2 — Create OG image (B2):**
OG image created — 1200×630 PNG, 23KB. Let me verify it serves correctly:
Need to rebuild — `public/` files are copied to `dist/` during build:
OG image now serves correctly — 200, `image/png`, 23KB. Let me also verify the meta tag points to it correctly:
Phase 2 complete. Now **Phase 3 — Documentation updates (B3):**
Now update the Verify Setup table to include `prebuild`/`precheck` and update the changelog:
Now update the changelog with a round-2 entry:
Now update the File Hierarchy section to include the new scripts and OG image:
Also add the audit round 2 doc to the audit folder reference:
Now update AGENTS.md:
Now update the "Repo-relative paths to know" section in AGENTS.md:
Now update CLAUDE.md:
Now update the testing strategy to mention the dep guard:
Now **Phase 4 — Final verification.** Run the full suite:
All green. Now run the exact user scenario test (clean install simulation):
The user's exact scenario now works correctly:
- `rm -rf node_modules dist && npm run build` → **exits 1 with a clear "run `npm install`" message** (no more Vite stack trace)
- `npm install && npm run build` → **succeeds** — 21 pages, sitemap generated

Let me also verify the OG image is in the build and the link checker is happy:
All verified. Now **Phase 5 — Commit and push:**
**Commit 1 — prebuild dep guard (B1):**
**Commit 2 — OG image (B2):**
**Commit 3 — Documentation (B3):**
Verify commits and push:
3 commits ahead of origin/main, working tree clean. Now push via the SSH wrapper:
Push successful. Let me verify and update todos:
All green and pushed. Let me update the todo list:
## Summary

**Root cause of your build error:** You pulled the round-1 commits (which added `@astrojs/sitemap` to `package.json`) and ran `rm -rf dist/ && npm run build` **without first running `npm install`**. Your stale `node_modules/` didn't have `@astrojs/sitemap`, so Vite threw a confusing stack trace. The lockfile was correct all along — the issue was a workflow gap, not a code bug.

**What I fixed (3 commits pushed to `main`):**

1. **`prebuild`/`precheck` dep guard (B1)** — Added `scripts/verify-deps.mjs`, a zero-dependency Node script that checks `astro`, `@astrojs/sitemap`, `@tailwindcss/vite`, `@astrojs/check`, and `typescript` are installed before `astro build` or `astro check` runs. Wired as npm `prebuild` and `precheck` lifecycle hooks. Now `rm -rf node_modules dist && npm run build` fails fast with `Fix: run npm install before building or checking the project.` — no more Vite stack trace.

2. **Default OG image (B2)** — Found that `/og-default.png` (referenced by every page's OG meta tag since the round-1 L1 fix) returned 404. Created `scripts/generate-og-image.py` (PIL) and generated `public/og-default.png` (1200×630, 23 KB) — kelp-green accent, "Kelp" wordmark in serif, tagline below, on ink background. Now serves `200 image/png`.

3. **Documentation (B3)** — README, AGENTS.md, CLAUDE.md now explicitly say "re-run `npm install` after pulling" and document the new `prebuild`/`precheck` guard. Added `docs/audit/REMEDIATION_PLAN_ROUND2.md` with full root-cause analysis and TDD evidence.

**To fix your local environment:** Run `npm install` then `npm run build` — the build will succeed (21 pages + sitemap). Going forward, the `prebuild` hook will remind you if you forget.

---

The `skills/` directory is tracked (2188 files) but per AGENTS.md it should be gitignored and not committed. The modifications are likely environmental (line endings, permissions, or the user's local changes). Per AGENTS.md: "Treat it as not part of this repo; do not edit or commit it." Let me verify my actual code changes are clean and investigate what's happening with skills/:
The skills/ files show 0 insertions/0 deletions — this is a file-mode or metadata-only change (common when cloning across filesystems). Let me check if the non-skills changes are real content changes or the same metadata issue:
All 1183 "modified" files are just **file-mode changes** (`100644` → `100755`) with zero content changes — an environmental artifact, not real code changes. Let me check for any actual untracked files that need committing, then reset the mode noise:
My code is fully committed and pushed — `origin/main` is at `ee1b4db` (my round-2 last commit), no unpushed commits, no untracked files outside `skills/`. The mode-change noise is environmental. Now let me `git pull` to refresh and reset the mode noise:
The pull succeeded and brought in `npm_log.txt` (which the user committed to the repo) plus a skills-catalog update. Now I can review the deployment log:
The deployment log is clean — `prebuild` ran successfully (line 15-16), 21 pages built, sitemap generated, no errors. The only warning is the benign `esbuild` install-scripts block (npm's allow-scripts feature; esbuild still works because its binary is pre-built). Now let me curl-verify the live site:
The live site has all the latest changes — canonical URL, OG tags, theme-color, and sitemap are all correct. I notice Cloudflare's "AI Audit" feature is prepending managed content to `robots.txt` (not a code bug — that's a Cloudflare config on the user's deployment). Let me verify the OG image and all the new pages serve correctly:
All 18 URLs return 200. Let me also verify the partners-vs-pirates page now shows the corrected title (the C4 fix):
The C4 fix is confirmed live. Let me verify the testimonials count more carefully (the curl grep may have missed blockquotes due to HTML structure):
All round-1 and round-2 fixes are live:
- ✅ 3 testimonials (Sarah Mitchell, Marcus Chen, Diana Rodriguez)
- ✅ 9 carousel slides (was 6)
- ✅ All 5 service categories from collection
- ✅ Headless platform present

Now let me run the agent-browser E2E test against the live site to find any remaining discrepancies:
Excellent — the live site looks great. All 9 carousel slides, dropdowns, and sections are present. Let me now test the dropdown interaction and compare with the original kelp.agency:
Dropdown works on hover. Now let me test the carousel keyboard nav and check the original kelp.agency for comparison:
I notice the original kelp.agency has an extra "Ready to get started?" link between "How We Work" and "What Our Clients Say" that the clone is missing. Let me investigate this and other discrepancies:
The original has a "Ready to get started?" link at the end of the "How We Work" section that the clone is missing. Let me check testimonials and other details:
The original footer has a 6th column — a "Ready to get started?" CTA block. Let me check the original's platform pages and a few more details:
Let me check the original's How We Work section "Ready to get started?" link and compare dropdown submenus:
Let me take a screenshot and check the mobile menu, then move on to skills compliance:
Mobile menu works correctly. Let me close the browser and move to skills compliance review:
Now let me validate the codebase against the astro-7 skills. Let me read the key sections of the astro-7 SKILL.md and astro-7-patterns SKILL.md:
Let me read the key sections relevant to the codebase — anti-patterns, testing, and verification:
Now let me read the astro-7-patterns SKILL.md for the distilled patterns and troubleshooting playbook:
I found a key compliance gap. The astro-7-patterns skill (Section 7) specifies the mobile menu should have `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"`. Let me check the clone's implementation:
Found a WCAG 2.2 AA compliance gap: the mobile menu is missing `role="dialog"`, `aria-modal="true"`, and `aria-label="Site navigation"` per the astro-7-patterns skill (Section 7). Let me also check the code-quality-standards skill and verify a few more things:
Now let me do a focused compliance check against the codebase. Let me verify the key patterns the skills require:
Let me verify the headroom pattern compliance and check a few more things:
Let me verify the dropdown submenu labels match the original exactly:
The dropdown labels match the original. Let me close the browser and write the comprehensive remediation plan:
**Phase 1 — Mobile menu a11y (R3-1, R3-2).** Let me read the current Header.astro mobile menu section and apply the fixes:
Now fix the focus management in `openMenu`/`closeMenu` (R3-2):
Now run check + build:
Phase 1 GREEN. Let me verify via agent-browser that the ARIA attributes and focus management work:
The ARIA attributes are confirmed. The focus test needs a small wait for `requestAnimationFrame` to fire. Let me verify:
**Phase 1 verified:**
- ✅ `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"` present
- ✅ Opening menu moves focus to first link (`<a href="/services/">Services</a>`)
- ✅ Closing with Escape returns focus to the toggle button (`aria-label="Open menu"`)

Let me stop the preview and proceed to Phase 2:
**Phase 2 — Footer CTA column (R3-3).** Let me read the current Footer and update it:
Phase 2 GREEN. **Phase 3 — HowWeWork CTA link (R3-4):**
Phase 3 GREEN. **Phase 4 — DRY desiredOrder (R3-5):**
Phase 4 GREEN. **Phase 5 — Final E2E verification via agent-browser:**
All three round-3 fixes verified on local preview:
- ✅ Footer has 6 columns, first is "Ready to get started?" CTA (matches original)
- ✅ How We Work section has "Ready to get started?" link pointing to /contact/
- ✅ Mobile menu has `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"`

Let me verify the focus management works and take a screenshot:
All round-3 fixes verified. **Phase 6 — Documentation + commit + push.** Let me update the docs first:
Now update the File Hierarchy in README to include `src/lib/`:
Now add `src/lib/` to the File Hierarchy:
Now update the design template verification checklist with round-3 items:
Now update AGENTS.md to mention the `src/lib/` directory and the focus management pattern:
Now let me run the final verification and commit:
All green. Now commit in atomic units:
**Commit 1 — Mobile menu a11y (R3-1, R3-2):**
**Commit 2 — Footer CTA column (R3-3):**
**Commit 3 — HowWeWork CTA link (R3-4):**
**Commit 4 — DRY desiredOrder (R3-5):**
**Commit 5 — Documentation (round 3):**
Now verify the commits and push:
5 commits ahead of origin/main, working tree clean (excluding skills/ noise). Now push via the SSH wrapper:
Push successful. Let me verify:
All green and pushed. Let me update the todo list:
## Summary

I completed the full round-3 remediation cycle. Here's what was done:

**Verification (pre-fix):**
- ✅ All round-1/2 code was committed and pushed; `git pull` brought in 2 new commits (`npm_log.txt` + skills-catalog update)
- ✅ Deployment log (`npm_log.txt`) reviewed — clean build, 21 pages, `prebuild` guard ran successfully, 0 errors
- ✅ Live site `https://astro.jesspete.shop/` curl-verified — all 18 key URLs return 200, canonical/OG/theme-color/sitemap all correct
- ✅ `agent-browser` E2E test confirmed all round-1/2 fixes are live (dropdowns, carousel keyboard nav, 3 testimonials, 9 carousel slides, Headless platform)

**Issues found (5 total):**
1. **R3-1 (High, WCAG):** Mobile menu missing `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"` per `astro-7-patterns` skill §7
2. **R3-2 (Medium, WCAG):** Mobile menu focus management missing — opening didn't move focus to menu; closing didn't return focus to toggle
3. **R3-3 (Medium, design fidelity):** Footer missing "Ready to get started?" CTA column (original has 6 columns; clone had 5)
4. **R3-4 (Low, design fidelity):** How We Work section missing "Ready to get started?" CTA link at end
5. **R3-5 (Low, DRY):** `desiredOrder` array duplicated in `Services.astro` and `services/index.astro`

**Fixes applied (5 atomic commits pushed to `main`):**
- `fix(a11y): add dialog semantics and focus management to mobile menu (R3-1, R3-2)` — Added dialog ARIA; `openMenu()` now moves focus to first link via `requestAnimationFrame`; `closeMenu()` returns focus to toggle. Verified via agent-browser.
- `feat(footer): add Ready to get started CTA column matching original (R3-3)` — Added 6th footer column with H3 + description + "Schedule a Meeting" button; grid changed to `lg:grid-cols-6`.
- `feat(home): add Ready to get started link to How We Work section (R3-4)` — Added CTA link after the 5-step process.
- `refactor(services): extract desiredOrder to shared module (R3-5)` — Created `src/lib/service-order.ts` exporting `SERVICE_ORDER`; both consumers now import from it.
- `docs: update for round-3 remediation` — README changelog, File Hierarchy, design template checklist, AGENTS.md gotchas, and new `docs/audit/REMEDIATION_PLAN_ROUND3.md`.

**Final state:** `npm run check` (0/0/0), `npm run build` (21 pages), `npm run check:links` (0 broken, 1307 checked), `npm run check:content` (0 errors), dep guard (exit 0), live site returns 200. All 5 commits pushed to `github.com:nordeim/astro-web.git` main branch.

**Next steps for you:** Redeploy `dist/` to `astro.jesspete.shop` to make the round-3 fixes live. The footer CTA, HowWeWork link, and mobile menu a11y improvements will then be visible to users and screen readers.
