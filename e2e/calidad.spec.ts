import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

// #35: accesibilidad, consola limpia, recursos sin errores y SEO básico.
const PROD = 'https://arlandstack.com/';

// Recorre la página hasta el final para forzar la carga de recursos diferidos.
// Se usa scroll por script y no `mouse.wheel` porque WebKit móvil (iPhone) no soporta la rueda del mouse.
async function recorrerPagina(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test('sin violaciones de accesibilidad serias o críticas (axe)', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(
    graves.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`),
  ).toEqual([]);
});

test('la consola no muestra errores ni excepciones al cargar', async ({ page }) => {
  const errores: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(m.text());
  });
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await recorrerPagina(page);
  await page.waitForLoadState('networkidle');
  expect(errores).toEqual([]);
});

test('ninguna petición devuelve 4xx/5xx ni falla', async ({ page }) => {
  const malas: string[] = [];
  page.on('response', (r) => {
    if (r.status() >= 400) malas.push(`${r.status()} ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    // Las cancelaciones del propio navegador (p. ej. HMR de Vite) no son errores del sitio.
    if (!/ERR_ABORTED/.test(r.failure()?.errorText ?? '')) malas.push(`falló ${r.url()} ${r.failure()?.errorText}`);
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await recorrerPagina(page);
  await page.waitForLoadState('networkidle');
  expect(malas).toEqual([]);
});

test('SEO básico: lang, title, description, canonical y Open Graph', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  const title = await page.title();
  expect(title.length).toBeGreaterThan(10);
  expect(title.length).toBeLessThanOrEqual(70);

  const meta = (sel: string) => page.locator(sel).getAttribute('content');
  const desc = (await meta('meta[name="description"]')) ?? '';
  expect(desc.length).toBeGreaterThan(50);
  expect(desc.length).toBeLessThanOrEqual(170);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', PROD);
  expect(await meta('meta[property="og:title"]')).toBeTruthy();
  expect(await meta('meta[property="og:url"]')).toBe(PROD);
  const ogImage = (await meta('meta[property="og:image"]')) ?? '';
  expect(ogImage).toMatch(/^https:\/\/arlandstack\.com\//);
  // La imagen OG debe existir de verdad en el sitio.
  const res = await page.request.get(new URL(ogImage).pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/^image\//);
});

test('un único h1 y jerarquía de encabezados sin saltos desde h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  const niveles = await page
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
  expect(niveles[0]).toBe(1);
  for (let i = 1; i < niveles.length; i++) expect(niveles[i] - niveles[i - 1]).toBeLessThanOrEqual(1);
});

test('todas las imágenes tienen alt', async ({ page }) => {
  await page.goto('/');
  const sinAlt = await page.locator('img:not([alt])').count();
  expect(sinAlt).toBe(0);
});
