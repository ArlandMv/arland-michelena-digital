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
  const mark = page.locator('#faceted-mark-card picture img');
  await expect(mark).toHaveAttribute('src', '/brand/logo-mark-480.webp');
  await expect.poll(() => mark.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(external).toEqual([]);
});

// Ciclo 14: la imagen LCP se sirve en AVIF liviano, precargada con el mismo srcset/sizes.
test('gema del hero: AVIF precargado, liviano y sin doble descarga', async ({ page }) => {
  const pedidas: string[] = [];
  page.on('request', (r) => {
    if (/\/brand\/logo-mark-\d+\.(avif|webp)$/.test(r.url()) && !/-(64|128)\.webp$/.test(r.url())) pedidas.push(r.url());
  });
  await page.goto('/');
  const preload = page.locator('link[rel="preload"][as="image"]');
  await expect(preload).toHaveAttribute('type', 'image/avif');
  await expect(preload).toHaveAttribute('fetchpriority', 'high');
  const source = page.locator('#faceted-mark-card picture source[type="image/avif"]');
  expect(await source.getAttribute('srcset')).toBe(await preload.getAttribute('imagesrcset'));
  expect(await source.getAttribute('sizes')).toBe(await preload.getAttribute('imagesizes'));
  const mark = page.locator('#faceted-mark-card picture img');
  await expect(mark).toHaveAttribute('fetchpriority', 'high');
  await expect(mark).toHaveAttribute('width', '640');
  await expect(mark).toHaveAttribute('height', '640');
  await expect.poll(() => mark.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  const actual = await mark.evaluate((i: HTMLImageElement) => i.currentSrc);
  expect(actual).toMatch(/\.avif$/);
  // Una sola variante de la gema: el preload y el <picture> eligen el mismo archivo.
  expect([...new Set(pedidas)], `variantes pedidas: ${pedidas.join(", ")}`).toHaveLength(1);
  const res = await page.request.get(actual);
  expect(res.headers()['content-type']).toContain('image/avif');
  expect((await res.body()).length).toBeLessThan(40_000);
});
