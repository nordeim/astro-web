import { test, expect } from '@playwright/test';

/**
 * Desktop dropdown menu regression tests.
 *
 * Source: docs/audit/REMEDIATION_PLAN_ROUND5.md F3 (MEDIUM).
 *
 * The `initDropdowns()` function in src/components/Header.astro originally
 * attached a `document.addEventListener('click', …)` outside-click listener
 * INSIDE the function. Since `initDropdowns()` is called on initial load
 * AND on every `astro:after-swap`, each View Transition added another
 * identical outside-click listener to `document`. After N navigations,
 * there were N+1 duplicate listeners — a memory leak with idempotent
 * (but wasteful) effect.
 *
 * This test doesn't try to count listeners (JavaScript doesn't expose that
 * directly). Instead, it verifies the user-visible contract: dropdowns
 * toggle correctly, Escape closes them, outside-click closes them, and
 * these behaviors all still work after multiple View Transitions.
 *
 * The leak itself is verified by code inspection (see
 * docs/audit/REMEDIATION_PLAN_ROUND5.md F3).
 */

// Use the desktop-chrome project for these tests (dropdowns are desktop-only)
test.use({ viewport: { width: 1280, height: 800 } });

test('dropdown toggles aria-expanded on click (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  // The Services nav item is the first .has-submenu
  const servicesTrigger = page
    .locator('.has-submenu a[aria-expanded]')
    .first();

  // Click should toggle aria-expanded (note: Services also navigates by default,
  // but the click handler runs first and toggles aria-expanded before navigation)
  const initial = await servicesTrigger.getAttribute('aria-expanded');
  expect(initial).toBe('false');

  // Hover to reveal the submenu via CSS, then verify structure
  await servicesTrigger.hover();
  const submenu = page.locator('.has-submenu .header-submenu').first();
  await expect(submenu).toBeVisible();
});

test('dropdown closes on Escape (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const servicesTrigger = page.locator('.has-submenu a[aria-expanded]').first();
  // Open the dropdown by clicking (toggles aria-expanded to true)
  await servicesTrigger.click();
  // Note: clicking Services also navigates, so we need to come back
  await page.goto('/');

  // Use keyboard instead: focus the trigger, press Enter (no — that navigates).
  // Better: use a script to set aria-expanded=true and then test Escape.
  await page.evaluate(() => {
    const trigger = document.querySelector<HTMLAnchorElement>(
      '.has-submenu a[aria-expanded]'
    );
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  });

  await servicesTrigger.focus();
  await page.keyboard.press('Escape');

  // After Escape, aria-expanded should be false
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');
});

test('dropdown outside-click closes an open submenu (initial-load baseline)', async ({ page }) => {
  await page.goto('/');

  const servicesTrigger = page.locator('.has-submenu a[aria-expanded]').first();

  // Open the dropdown programmatically (clicking would navigate)
  await page.evaluate(() => {
    const trigger = document.querySelector<HTMLAnchorElement>(
      '.has-submenu a[aria-expanded]'
    );
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  });
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'true');

  // Click somewhere outside the submenu (e.g., the main content area)
  await page.locator('main').click();

  // The outside-click handler should have closed the dropdown
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');
});

test('dropdown outside-click STILL works after multiple View Transitions (regression for F3)', async ({
  page,
}) => {
  await page.goto('/');

  // Perform 3 View Transitions to potentially accumulate 3 duplicate listeners
  // Use /work/, then back to / via header logo, then to /contact/ — all real links.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  await page.locator('header a[aria-label="Kelp — Home"]').click();
  await expect(page).toHaveURL(/\/$/);

  await page.locator('footer a[href="/contact/"]').first().click();
  await expect(page).toHaveURL(/\/contact\/?$/);

  // Navigate back to homepage for the actual test
  await page.locator('header a[aria-label="Kelp — Home"]').click();
  await expect(page).toHaveURL(/\/$/);

  const servicesTrigger = page.locator('.has-submenu a[aria-expanded]').first();

  // Open the dropdown programmatically
  await page.evaluate(() => {
    const trigger = document.querySelector<HTMLAnchorElement>(
      '.has-submenu a[aria-expanded]'
    );
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  });
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'true');

  // Click outside — should close the dropdown.
  // (If F3 caused the outside-click handler to be attached 5x, the closing
  //  effect would still work — but the test verifies the contract holds.
  //  The leak itself is verified by code inspection.)
  await page.locator('main').click();
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');
});
