import { test, expect } from '@playwright/test';

/**
 * Mobile menu regression tests.
 *
 * Source: docs/audit/REMEDIATION_PLAN_ROUND5.md F1 (HIGH).
 *
 * The mobile menu script in src/components/Header.astro originally captured
 * the `toggle` and `menu` elements once at script execution and only
 * registered `closeMenu` (not a re-init function) on `astro:after-swap`.
 * After the first View Transition, the new hamburger button had no click
 * listener and the mobile menu became unresponsive.
 *
 * These tests reproduce that bug (red) and verify the fix (green).
 *
 * Run on the mobile-chrome project (390×844 viewport) so the hamburger
 * button is visible.
 */

// Use the mobile-chrome project for these tests
test.use({ viewport: { width: 390, height: 844 } });

test('mobile menu opens and closes on initial load (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const toggle = page.locator('[data-mobile-menu-toggle]');
  const menu = page.locator('[data-mobile-menu]');

  // Initially closed (the `hidden` class sets display:none on mobile).
  // We use toBeVisible() rather than toHaveClass(/hidden/) because the
  // class list also contains `md:hidden` (which has no effect below the
  // md breakpoint) — a regex match on /hidden/ would match both.
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).not.toBeVisible();

  // Open
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();

  // Close
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).not.toBeVisible();
});

test('mobile menu focuses first link on open (a11y, initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const toggle = page.locator('[data-mobile-menu-toggle]');
  await toggle.click();

  // Focus should move to the first link inside the menu
  const firstLink = page.locator('[data-mobile-menu] a').first();
  await expect(firstLink).toBeFocused();
});

test('mobile menu closes on Escape (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const toggle = page.locator('[data-mobile-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('mobile menu STILL opens after a View Transition (regression for F1)', async ({ page }) => {
  // Start on homepage, verify mobile menu works
  await page.goto('/');
  const toggle = page.locator('[data-mobile-menu-toggle]');
  const menu = page.locator('[data-mobile-menu]');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();

  // Close it again
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  // Navigate away via footer link (triggers View Transition).
  // Use /work/ (footer) — /about/ is only in header nav.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  // Now try to open the mobile menu on the /work/ page.
  // BEFORE THE FIX: this click is a no-op — the toggle has no click listener.
  // AFTER THE FIX: the menu opens normally.
  const toggleAbout = page.locator('[data-mobile-menu-toggle]');
  const menuAbout = page.locator('[data-mobile-menu]');

  await toggleAbout.click();
  await expect(toggleAbout).toHaveAttribute('aria-expanded', 'true');
  await expect(menuAbout).toBeVisible();

  // And the focus should have moved to the first link inside the menu
  const firstLink = page.locator('[data-mobile-menu] a').first();
  await expect(firstLink).toBeFocused();
});

test('mobile menu closes on link click after View Transition (regression for F1)', async ({
  page,
}) => {
  await page.goto('/');

  // Navigate via footer link (View Transition). Use /work/ — /about/ is header-only.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  // Open mobile menu
  const toggle = page.locator('[data-mobile-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  // Click a link inside the menu — should close the menu AND navigate
  await page.locator('[data-mobile-menu] a').first().click();

  // Menu should be closed (aria-expanded false) regardless of whether
  // navigation completed
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
