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
 * The test suite is intentionally small (8 specs) and focuses on the
 * View Transitions re-init regressions documented in
 * docs/audit/REMEDIATION_PLAN_ROUND5.md (F1, F2, F3). These are the bugs
 * that `astro check` + `link-check.mjs` + `validate-content.mjs` cannot
 * catch — they require a real browser navigation.
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
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 }, // iPhone 14 Pro size
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // first build can take ~30s
  },
});
