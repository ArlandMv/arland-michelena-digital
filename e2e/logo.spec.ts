import { test, expect } from '@playwright/test';

// #11: el logo y la gema del hero deben servirse desde assets locales y cargar.
test('logo del navbar y gema del hero cargan desde /brand', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('googleusercontent.com')) external.push(r.url());
  });
  await page.goto('/');
  const logo = page.locator('#brand-logo-link img');
  await expect(logo).toHaveAttribute('src', /^\/brand\/logo-mark-64\.webp$/);
  await expect.poll(() => logo.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  const mark = page.locator('img[src="/brand/logo-mark-640.webp"]');
  await expect.poll(() => mark.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(external).toEqual([]);
});
