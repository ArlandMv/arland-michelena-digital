import { test, expect } from '@playwright/test';

// #36: el smoke test de producción usa <meta name="build-commit"> para saber qué commit sirve el sitio.
test('la home publica el commit del build en <meta name="build-commit">', async ({ page }) => {
  await page.goto('/');
  const commit = await page.locator('meta[name="build-commit"]').getAttribute('content');
  expect(commit).toMatch(/^[0-9a-zA-Z]+$/);
});
