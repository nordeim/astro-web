import { test, expect } from '@playwright/test';

/**
 * Homepage smoke test.
 *
 * Verifies the homepage loads with the expected title and H1 — the same
 * contract checked in `docs/audit/REMEDIATION_PLAN_ROUND4.md` (R4-3) but
 * now codified as an automated regression test.
 */
test('homepage loads with correct title and H1', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Kelp Creative Agency');
  await expect(page.locator('h1')).toContainText("Central Florida's Award Winning Creative Agency");
});

/**
 * Homepage H2 count — the 4 documented sections (Our Work, Our Services,
 * How We Work, What Our Clients Say). Catches accidental section removal.
 */
test('homepage has the 4 canonical H2 sections', async ({ page }) => {
  await page.goto('/');
  const h2s = await page.locator('h2').allInnerTexts();
  expect(h2s).toContain('Our Work In the real-world');
  expect(h2s).toContain('Our Services');
  // "How We\nWork" may be split across lines in the DOM
  expect(h2s.some((h) => h.replace(/\s+/g, ' ').trim() === 'How We Work')).toBeTruthy();
  expect(h2s.some((h) => h.replace(/\s+/g, ' ').trim() === 'What Our Clients Say')).toBeTruthy();
});

/**
 * JSON-LD structured data is present and parseable.
 * Regression test for R4-4.
 */
test('homepage has parseable JSON-LD structured data', async ({ page }) => {
  await page.goto('/');
  const jsonLdScripts = await page.locator('script[type="application/ld+json"]').count();
  expect(jsonLdScripts).toBeGreaterThanOrEqual(1);

  const content = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(content).not.toBeNull();
  // Must parse as valid JSON
  const parsed = JSON.parse(content!);
  expect(parsed['@context']).toBe('https://schema.org');
  expect(parsed['@graph']).toBeDefined();
  expect(Array.isArray(parsed['@graph'])).toBeTruthy();
  // Must contain Organization, WebSite, WebPage at minimum
  const types = parsed['@graph'].map((node: any) => node['@type']);
  expect(types).toContain('Organization');
  expect(types).toContain('WebSite');
  expect(types).toContain('WebPage');
});
