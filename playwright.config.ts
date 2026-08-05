import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for the Kelp Agency Clone.
 *
 * Per the astro-7 skill §3363-3385 (Testing section), the recommended pattern
 * for Astro E2E is:
 *   - reuseExistingServer: !process.env.CI  (so local dev is fast, CI starts fresh)
 *   - webServer.command: 'npm run preview'  (build once, serve static dist/)
 *   - webServer.port: 4321                   (matches Astro's preview port)
 *
 * The test suite focuses on the View Transitions re-init regressions
 * documented in docs/audit/REMEDIATION_PLAN_ROUND5.md (F1, F2, F3) and
 * docs/audit/REMEDIATION_PLAN_ROUND6.md (R6-1, R6-3, R6-4, R6-11). These
 * are the bugs that `astro check` + `link-check.mjs` + `validate-content.mjs`
 * cannot catch — they require a real browser navigation.
 *
 * Project scoping (R6-9, round 6):
 *   - `desktop-chrome` runs ALL specs (default desktop viewport 1280x720).
 *   - `mobile-chrome` runs all specs EXCEPT `dropdowns.spec.ts` (dropdowns
 *     are desktop-only — the mobile menu replaces them on mobile).
 *   - `mobile-menu.spec.ts` uses `test.use({ viewport: { width: 390, height: 844 } })`
 *     which overrides the project viewport, so it runs at mobile size on
 *     BOTH projects. This is intentional — we want to verify the mobile
 *     menu works on both desktop (with narrow viewport) and mobile projects.
 *   - This eliminates ~9 redundant runs from the round-5 config (where
 *     dropdowns.spec.ts ran at 1280x800 on both projects, and mobile-menu
 *     ran at 390x844 on both projects).
 *
 * Run:  npm run test:e2e
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // View Transitions + shared preview server don't parallelize well
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // single worker — the preview server is a single instance
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      // Run all specs on desktop
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 }, // iPhone 14 Pro size
      },
      // Skip dropdown specs on mobile — dropdowns are desktop-only (the
      // mobile menu replaces them on mobile viewports). Running them on
      // mobile would just fail because the .has-submenu elements are
      // hidden via CSS (md:flex on the parent nav).
      testIgnore: ['**/dropdowns.spec.ts'],
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // first build can take ~30s
  },
});
