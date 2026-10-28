import { test, expect } from '@playwright/test';

// Ciclo 12: las fuentes se sirven desde el propio dominio; no debe haber peticiones a Google Fonts.
test('no pide Google Fonts y carga IBM Plex Sans propia', async ({ page }) => {
  const externas: string[] = [];
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) externas.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const cargada = await page.evaluate(() => document.fonts.check('400 16px "IBM Plex Sans"'));
  expect(cargada).toBe(true);
  expect(externas).toEqual([]);
});
