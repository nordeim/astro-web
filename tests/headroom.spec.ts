import { test, expect } from '@playwright/test';

/**
 * Headroom + scroll-reveal regression tests.
 *
 * Source: docs/audit/REMEDIATION_PLAN_ROUND5.md F2 (MEDIUM).
 *
 * The headroom script in src/layouts/BaseLayout.astro originally captured
 * the `.site-header` element once at script execution. The `astro:after-swap`
 * handler only re-initialized the IntersectionObserver for `[data-reveal]`
 * elements — it did NOT re-query `.site-header` or re-bind the scroll
 * listener. After a View Transition, the scroll listener kept firing on
 * `window` but mutated the now-detached OLD header element; the NEW header
 * never received `is-scrolled`, `headroom--pinned`, or `headroom--unpinned`.
 */

test('headroom adds is-scrolled class on scroll (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const header = page.locator('.site-header');
  await expect(header).not.toHaveClass(/is-scrolled/);

  // Scroll down past the 10px threshold
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/is-scrolled/);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-scrolled/);
});

test('headroom adds headroom--unpinned class when scrolling down past threshold', async ({
  page,
}) => {
  await page.goto('/');

  const header = page.locator('.site-header');
  // Initial state should be pinned (at top of page)
  await expect(header).toHaveClass(/headroom--pinned/);

  // Scroll down past the 100px threshold + a bit more to trigger direction change
  await page.evaluate(() => window.scrollTo(0, 500));
  // Now scrolling down — should be unpinned
  await expect(header).toHaveClass(/headroom--unpinned/);
});

test('headroom STILL adds is-scrolled class after a View Transition (regression for F2)', async ({
  page,
}) => {
  await page.goto('/');

  // Navigate via footer link (View Transition). Use /work/ — /about/ is header-only.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  const header = page.locator('.site-header');
  // After navigation, header should start in the non-scrolled state
  await expect(header).not.toHaveClass(/is-scrolled/);

  // Scroll down — the NEW header must receive is-scrolled
  // BEFORE THE FIX: the scroll listener was attached to the OLD (detached)
  // header element, so the NEW header's classList was never mutated.
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/is-scrolled/);
});

test('scroll reveal triggers is-visible class on intersection (initial-load baseline)', async ({
  page,
}) => {
  await page.goto('/');

  // Find a [data-reveal] element that's below the fold.
  // Use the count to verify the page has reveal elements.
  const revealEls = page.locator('[data-reveal]');
  const count = await revealEls.count();
  expect(count).toBeGreaterThan(0);

  // Scroll to the bottom of the page to trigger all reveal observers
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Wait a tick for the IntersectionObserver callback to fire
  await page.waitForTimeout(500);

  // At least some reveal elements should now be visible
  const visibleCount = await page.locator('[data-reveal].is-visible').count();
  expect(visibleCount).toBeGreaterThan(0);
});

test('scroll reveal triggers is-visible class after a View Transition', async ({ page }) => {
  await page.goto('/');

  // Navigate to /work/ (View Transition) — use footer link since /about/ is header-only.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  // Scroll to the bottom — the IntersectionObserver re-init in the
  // astro:after-swap handler must have run, so reveal elements should trigger.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const visibleCount = await page.locator('[data-reveal].is-visible').count();
  expect(visibleCount).toBeGreaterThan(0);
});
