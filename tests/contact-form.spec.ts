import { test, expect } from '@playwright/test';

/**
 * Contact form UX regression test.
 *
 * Source: docs/audit/REMEDIATION_PLAN_ROUND6.md R6-11 (HIGH).
 *
 * The contact form posts to /contact/ (itself). Since this is a static site
 * with no backend, the POST results in Astro's static server returning the
 * page again — the form disappears with no feedback. The user has no idea
 * whether their submission was received.
 *
 * Fix: intercept the form submit via inline <script>, preventDefault, hide
 * the form, and show an aria-live="polite" message explaining the form is
 * a demo and directing the user to email info@kelp.agency directly.
 *
 * This test verifies:
 * 1. Submitting the form with valid data does NOT cause the form to silently
 *    disappear with no feedback.
 * 2. A feedback message appears with aria-live="polite" (so screen readers
 *    announce it).
 * 3. The feedback message mentions info@kelp.agency (the real contact email).
 * 4. The form is either hidden or replaced after submit (so the user can't
 *    re-submit accidentally).
 */

test('contact form shows feedback message on submit instead of silently failing', async ({
  page,
}) => {
  await page.goto('/contact/');

  // Verify the form exists
  const form = page.locator('form');
  await expect(form).toBeVisible();

  // Fill the form with valid data
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'This is a test message for the contact form.');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for the feedback message to appear (the script runs on submit).
  // The message should have aria-live="polite" so screen readers announce it.
  const feedback = page.locator('[aria-live="polite"], [role="status"]');
  await expect(feedback).toBeVisible({ timeout: 5000 });

  // The feedback message should mention the real contact email
  // (info@kelp.agency) so the user knows how to actually reach Kelp.
  const feedbackText = (await feedback.textContent()) || '';
  expect(feedbackText.toLowerCase()).toContain('info@kelp.agency');

  // The form should no longer be visible (so the user can't re-submit).
  // OR: the form should be replaced by the feedback message.
  await expect(form).not.toBeVisible();
});

test('contact form feedback is announced to screen readers (aria-live)', async ({ page }) => {
  await page.goto('/contact/');

  // Verify there's an aria-live region on the page (even before submit).
  // It can be empty initially — the key is that it exists so screen readers
  // are listening for changes.
  const liveRegions = await page.locator('[aria-live]').count();
  expect(liveRegions).toBeGreaterThanOrEqual(1);

  // Fill and submit
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'This is a test message.');
  await page.click('button[type="submit"]');

  // The aria-live region should now have content
  const liveRegion = page.locator('[aria-live]').first();
  await expect(liveRegion).not.toBeEmpty({ timeout: 5000 });
});

test('contact form feedback works after a View Transition (re-init)', async ({ page }) => {
  // Navigate to /contact/ via View Transition (from homepage)
  await page.goto('/');
  await page.locator('footer a[href="/contact/"]').first().click();
  await expect(page).toHaveURL(/\/contact\/?$/);

  // Fill and submit
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'This is a test message.');
  await page.click('button[type="submit"]');

  // The feedback message should appear (the init script must re-run on
  // astro:after-swap, per the round-5 F1/F2/F3 lesson).
  const feedback = page.locator('[aria-live="polite"], [role="status"]');
  await expect(feedback).toBeVisible({ timeout: 5000 });
  const feedbackText = (await feedback.textContent()) || '';
  expect(feedbackText.toLowerCase()).toContain('info@kelp.agency');
});
