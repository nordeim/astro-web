import { test, expect } from '@playwright/test';

/**
 * Carousel regression tests.
 *
 * The carousel in src/components/home/RecentWork.astro is the reference
 * implementation for the `astro:after-swap` re-init pattern (per
 * astro-7-patterns §3 + §6). These tests confirm the pattern holds both
 * on initial load AND after a View Transition.
 */

test('carousel advances on Next button click (initial load)', async ({ page }) => {
  await page.goto('/');

  const counter = page.locator('[data-carousel-counter]');
  await expect(counter).toHaveText('1 / 9');

  await page.locator('[data-carousel-next]').click();
  await expect(counter).toHaveText('2 / 9');

  await page.locator('[data-carousel-next]').click();
  await expect(counter).toHaveText('3 / 9');
});

test('carousel advances on Previous button click (initial load)', async ({ page }) => {
  await page.goto('/');

  const counter = page.locator('[data-carousel-counter]');
  await expect(counter).toHaveText('1 / 9');

  // Wrap-around: going Previous from slide 1 should land on slide 9
  await page.locator('[data-carousel-prev]').click();
  await expect(counter).toHaveText('9 / 9');
});

test('carousel advances on ArrowRight keypress (keyboard a11y)', async ({ page }) => {
  await page.goto('/');

  const counter = page.locator('[data-carousel-counter]');
  await expect(counter).toHaveText('1 / 9');

  // Focus the carousel region (it has tabindex="0" + role="region")
  await page.locator('[role="region"]').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(counter).toHaveText('2 / 9');
});

test('carousel advances on ArrowLeft keypress (keyboard a11y, R6-8)', async ({ page }) => {
  await page.goto('/');

  const counter = page.locator('[data-carousel-counter]');
  await expect(counter).toHaveText('1 / 9');

  // Focus the carousel region (it has tabindex="0" + role="region")
  await page.locator('[role="region"]').first().focus();

  // ArrowRight first to advance to slide 2
  await page.keyboard.press('ArrowRight');
  await expect(counter).toHaveText('2 / 9');

  // ArrowLeft to go back to slide 1
  await page.keyboard.press('ArrowLeft');
  await expect(counter).toHaveText('1 / 9');
});

test('carousel ArrowLeft from slide 1 wraps to slide 9 (wrap-around, R6-8)', async ({ page }) => {
  await page.goto('/');

  const counter = page.locator('[data-carousel-counter]');
  await expect(counter).toHaveText('1 / 9');

  // Focus the carousel region
  await page.locator('[role="region"]').first().focus();

  // ArrowLeft from slide 1 — should wrap to slide 9
  await page.keyboard.press('ArrowLeft');
  await expect(counter).toHaveText('9 / 9');
});

test('carousel STILL advances after a View Transition (regression for re-init pattern)', async ({
  page,
}) => {
  // Start on homepage, capture initial counter
  await page.goto('/');
  await expect(page.locator('[data-carousel-counter]')).toHaveText('1 / 9');

  // Navigate away via internal link (triggers View Transition).
  // /work/ is in the footer — use it because /about/ is only in the header nav.
  await page.locator('footer a[href="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/?$/);

  // Navigate back via the work-page CTA or logo (second View Transition)
  await page.locator('header a[href="/"]').first().click();
  await expect(page).toHaveURL(/\/$/);

  // The carousel counter must be back to 1/9 and the Next button must work.
  // This is the regression test: if the carousel init script doesn't re-run
  // on `astro:after-swap`, the Next button click will be a no-op.
  await expect(page.locator('[data-carousel-counter]')).toHaveText('1 / 9');
  await page.locator('[data-carousel-next]').click();
  await expect(page.locator('[data-carousel-counter]')).toHaveText('2 / 9');
});
