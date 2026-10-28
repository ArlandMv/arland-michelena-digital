import { test, expect } from '@playwright/test';

test('no carga Material Symbols y los íconos son SVG de lucide (#12)', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(requests.some((u) => /Material\+Symbols|material-symbols/i.test(u))).toBe(false);
  await expect(page.locator('.material-symbols-outlined')).toHaveCount(0);
  await expect(page.locator('[id^="capability-card-"] svg')).toHaveCount(6);
  await expect(page.locator('#proceso svg.lucide-package')).toHaveCount(1);
});
