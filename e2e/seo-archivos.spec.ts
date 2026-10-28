import { test, expect } from '@playwright/test';
import { statSync } from 'node:fs';

// #9: robots.txt y sitemap.xml deben ser archivos reales, no el HTML de la SPA.
test('robots.txt es texto plano y apunta al sitemap (#9)', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).not.toContain('<html');
  expect(body).toMatch(/^User-agent: \*/m);
  expect(body).toContain('Sitemap: https://arlandstack.com/sitemap.xml');
});

test('sitemap.xml es XML válido con la URL canónica (#9)', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).not.toContain('<html');
  expect(body).toContain('<urlset');
  expect(body).toContain('<loc>https://arlandstack.com/</loc>');
});

// #13: el PNG de alta resolución se conserva pero optimizado (antes 1,9 MB).
test('logo-1536.png pesa menos de 600 KB (#13)', () => {
  expect(statSync('public/logos/logo-1536.png').size).toBeLessThan(600 * 1024);
});
