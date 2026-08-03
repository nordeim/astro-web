# Remediation Plan — Build Error + Outstanding Issues (Round 2)

> **Paired with:** `docs/audit/AUDIT_FINDINGS.md` (round 1) and `docs/audit/REMEDIATION_PLAN.md` (round 1)
> **Date:** 2026-08-04
> **Trigger:** User reported `npm run build` failure: `Cannot find module '@astrojs/sitemap' imported from 'astro.config.mjs'`

---

## Root Cause Analysis

### The reported error

```
$ rm -rf dist/
$ npm run build
[astro] Unable to load your Astro config
Cannot find module '@astrojs/sitemap' imported from '/Home1/project/astro-web/astro.config.mjs'
```

### What happened

1. The round-1 remediation added `@astrojs/sitemap` to `package.json` (commit `a8a543e`) and `import sitemap from '@astrojs/sitemap'` to `astro.config.mjs`.
2. `package-lock.json` was correctly updated to include `node_modules/@astrojs/sitemap` — **verified**: the lockfile entry exists and is well-formed.
3. The user pulled the new commits and ran `rm -rf dist/` followed by `npm run build` — but **did NOT run `npm install`** first.
4. Their existing `node_modules/` (from before the pull) does not contain `@astrojs/sitemap`.
5. When `astro build` starts, Vite tries to load `astro.config.mjs`, which imports `@astrojs/sitemap` at the top level. The import fails, Vite throws a confusing stack trace, and the user sees a module-not-found error instead of a helpful "run npm install" message.

### Verification

- **Lockfile is correct:** `python3 -c "import json; lock=json.load(open('package-lock.json')); print('node_modules/@astrojs/sitemap' in lock['packages'])"` → `True`. The lockfile has both the root `dependencies` entry and the `node_modules/@astrojs/sitemap` package entry with correct `version`, `resolved`, and `integrity`.
- **Clean install works:** `rm -rf node_modules && npm install && npm run build` → succeeds, 21 pages built, sitemap generated.
- **The failure is environmental:** the user's `node_modules/` is stale relative to the new `package.json`.

### Why this is still a codebase issue (not just user error)

Per the coding specialist manual Section 13 ("Evidence-Based Verification"): the codebase should fail with a clear, actionable message when prerequisites are missing. The current Vite stack trace is neither. The optimal fix is a `prebuild` guard that catches missing config-level dependencies before Astro tries to load the config, and prints a one-line "run `npm install`" message.

This is the same principle as the round-1 `link-check.mjs` and `validate-content.mjs` scripts: turn a confusing failure into a clear, actionable error.

---

## Other Outstanding Issues Found During Review

A full re-audit of the remediated codebase found two additional outstanding issues:

### B2 — `/og-default.png` returns 404 (Medium)

- **Location:** `src/layouts/BaseLayout.astro` line 19: `ogImage = new URL('/og-default.png', Astro.site).href`
- **Description:** The round-1 L1 fix wired the OG image meta tag to default to `/og-default.png`, but the actual image file was never created (documented as "maintainer's responsibility" in README). Every page now emits `<meta property="og:image" content="https://astro.jesspete.shop/og-default.png">`, but the URL returns 404.
- **Evidence:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/og-default.png` → `404`.
- **Impact:** Social scrapers (Facebook, Twitter/X, LinkedIn, Slack) that fetch the OG image get a 404. Social shares show no preview image — same as before the L1 fix, but now with a broken URL in the meta tag.
- **Severity:** Medium
- **Confidence:** Verified
- **Optimal fix:** Create a minimal branded OG image (1200×630 PNG) at `public/og-default.png`. Use Python PIL (available in the environment) to render the Kelp wordmark on an ink background. The image will be simple but functional; the maintainer can replace it with a designed asset later.

### B3 — Documentation doesn't mention "run npm install after pulling" (Low)

- **Location:** `README.md`, `AGENTS.md`, `CLAUDE.md`
- **Description:** The docs say "npm install" is the install command, but don't explicitly call out that it must be re-run after pulling commits that add dependencies. This is the workflow gap that caused the user's error.
- **Impact:** New contributors (and the maintainer) hit the same confusing Vite error.
- **Severity:** Low
- **Confidence:** Reasoned
- **Optimal fix:** Add a short "After pulling" note to each doc, AND mention the new `prebuild` guard.

---

## Issues Reviewed and Confirmed NOT Outstanding

To avoid scope creep, the following were re-checked and confirmed to be either already fixed or intentionally out-of-scope:

| Item | Status | Notes |
|------|--------|-------|
| All round-1 Critical findings (C1–C4) | ✅ Fixed | `npm run check:links` passes with 0 broken links. |
| All round-1 High findings (H1–H8) | ✅ Fixed | `npm run check` clean; canonical URLs correct; collections used. |
| All round-1 Medium findings (M1–M6) | ✅ Fixed | Dropdowns work; carousel keyboard-accessible; Headless added. |
| All round-1 Low findings (L1, L2, L5) | ✅ Fixed | OG meta wired; README updated; viewport meta updated. |
| Contact form has no backend | Out-of-scope | Documented as stub in README/AGENTS. Intentional. |
| Real article body content | Out-of-scope | Content work, not code work. |
| Real social media profile URLs | Out-of-scope | Defaults to platform homepages. Maintainer replaces. |
| SVG logo | Out-of-scope | Text wordmark is intentional per design template. |
| `prefers-color-scheme` dark mode | Out-of-scope | Original is light-mode only. |
| `prefetchAll: true` bandwidth | Out-of-scope | Minor; 21-page site is small. |

---

## Plan vs. Codebase Alignment (Pre-execution validation)

| Fix | Validated against | Aligned? |
|-----|-------------------|----------|
| B1 add `prebuild` dep check | `package.json` (scripts block), `astro.config.mjs` (imports `@astrojs/sitemap`, `@tailwindcss/vite`), npm `prebuild` lifecycle convention | ✅ |
| B2 create `og-default.png` | `src/layouts/BaseLayout.astro` line 19 (references `/og-default.png`), `public/` directory (file absent), Python PIL available | ✅ |
| B3 update docs | `README.md` Quick Start, `AGENTS.md` Commands, `CLAUDE.md` Build Commands | ✅ |

---

## TDD Strategy

Per the coding specialist manual Section 10 and the round-1 approach:

1. **B1 — `prebuild` dep check:** Write `scripts/verify-deps.mjs` first. Test it RED by temporarily moving `node_modules/@astrojs/sitemap` aside and running `node scripts/verify-deps.mjs` — expect exit 1 with the helpful message. Restore the directory and re-run — expect exit 0. Then wire it as `prebuild` and `precheck` in `package.json`. Test the full flow: `npm run build` works when deps present; simulate missing dep and confirm `npm run build` fails with the helpful message (not the Vite stack trace).

2. **B2 — OG image:** Create the PNG via a Python script (`scripts/generate-og-image.py`) persisted to disk per the Script Persistence Rule. Run it to produce `public/og-default.png`. Verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/og-default.png` → expect `200`. Verify the image dimensions with `python3 -c "from PIL import Image; print(Image.open('public/og-default.png').size)"` → expect `(1200, 630)`.

3. **B3 — Docs:** Update README/AGENTS/CLAUDE. No test needed — documentation review is manual.

---

## ToDo List (Execution Order)

### Phase 1 — TDD: prebuild dep check (B1)

- [ ] **T1.1** — Create `scripts/verify-deps.mjs`: a Node ESM script that dynamically `import()`s each config-level dependency (`astro`, `@astrojs/sitemap`, `@tailwindcss/vite`) and reports which are missing. Exit 0 if all present; exit 1 with a clear "Run `npm install` to install missing dependencies" message if any are missing.
- [ ] **T1.2** — Test RED: temporarily rename `node_modules/@astrojs/sitemap` to `node_modules/@astrojs/sitemap.bak`, run `node scripts/verify-deps.mjs`, confirm exit 1 + helpful message. Restore the directory.
- [ ] **T1.3** — Test GREEN: run `node scripts/verify-deps.mjs` with all deps present → exit 0, silent (or brief "OK" message).
- [ ] **T1.4** — Wire into `package.json`: add `"prebuild": "node scripts/verify-deps.mjs"` and `"precheck": "node scripts/verify-deps.mjs"`. npm will run these automatically before `build` and `check`.
- [ ] **T1.5** — Test the full flow: `npm run build` succeeds when deps present. Simulate missing dep → `npm run build` fails with the helpful message (not the Vite stack trace).

### Phase 2 — Create OG image (B2)

- [ ] **T2.1** — Create `scripts/generate-og-image.py`: a Python script using PIL to render a 1200×630 PNG with the Kelp wordmark on an ink (`#0d1726`) background. Use the kelp green (`#42c634`) as an accent. Save to `public/og-default.png`.
- [ ] **T2.2** — Run the script: `python3 scripts/generate-og-image.py`. Verify the file exists and is a valid PNG with dimensions 1200×630.
- [ ] **T2.3** — Verify via `npm run preview` + `curl`: `/og-default.png` returns 200 with `Content-Type: image/png`.

### Phase 3 — Documentation (B3)

- [ ] **T3.1** — Update `README.md`:
  - Add an "After pulling" note in Quick Start: "If you've pulled new commits, run `npm install` before `npm run build` — new dependencies may have been added. The `prebuild` script will remind you if you forget."
  - Add `prebuild` and `precheck` to the Verify Setup table.
  - Update the Changelog with a 2026-08-04 (round 2) entry.
- [ ] **T3.2** — Update `AGENTS.md`:
  - Add `prebuild` / `precheck` to the Commands section.
  - Note that `npm run build` and `npm run check` now auto-verify deps first.
- [ ] **T3.3** — Update `CLAUDE.md`:
  - Add `prebuild` / `precheck` to the Build Commands table.
  - Add a note in the Environment Setup section about re-running `npm install` after pulling.

### Phase 4 — Final verification

- [ ] **T4.1** — Run full verification suite: `npm run check`, `npm run build`, `npm run check:links`, `npm run check:content`. All must pass.
- [ ] **T4.2** — Simulate the user's exact scenario: `rm -rf node_modules dist && npm run build` → expect helpful "run npm install" message from `prebuild` guard (NOT the Vite stack trace).
- [ ] **T4.3** — Then `npm install && npm run build` → expect success, 21 pages, sitemap generated.
- [ ] **T4.4** — Verify OG image: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/og-default.png` → 200.

### Phase 5 — Commit and push

- [ ] **T5.1** — Stage all changes.
- [ ] **T5.2** — Commit in atomic units:
  - `feat(scripts): add prebuild dep verification (B1)`
  - `feat(public): add default OG image (B2)`
  - `docs: note npm install requirement after pulling (B3)`
- [ ] **T5.3** — Push to `main` via the SSH wrapper (same as round 1):
  - `GIT_SSH_COMMAND="/home/z/my-project/workspace/astro-web/skills/how-to-git-push-using-ssh-wrapper/scripts/ssh_git_wrapper_v3.py -i ~/.ssh/id_github -o StrictHostKeyChecking=accept-new" git push origin main`
- [ ] **T5.4** — Verify push: `git status -sb` shows `## main...origin/main` (no ahead/behind).

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| `prebuild` script itself fails to run (e.g. Node version too old) | The script uses only `node:` built-ins (no deps) and dynamic `import()`. Node 22.12+ (the project's requirement) supports this. If the script fails, the error message will still be clearer than the Vite stack trace. |
| `prebuild` runs on every `build`/`check`, adding latency | The script does 3 dynamic imports — takes <100ms. Negligible. |
| OG image created with PIL looks too plain | The image is a functional placeholder. The README and design template already note that the maintainer should replace it with a designed asset. The PIL script is persisted so the maintainer can tweak it. |
| OG image PNG is large | PIL's default PNG compression is adequate. A 1200×630 ink-background PNG with text is typically 50–150 KB. Acceptable. |
| `prebuild` / `precheck` npm lifecycle hooks don't fire on some npm versions | `prebuild` and `precheck` are standard npm lifecycle hooks supported since npm 5+. The project requires Node 22.12+ which ships with npm 10+. No risk. |

---

*End of round-2 remediation plan. Proceeding to execution.*
