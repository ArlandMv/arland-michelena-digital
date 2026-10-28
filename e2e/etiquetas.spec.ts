import { test, expect } from '@playwright/test';

test('las etiquetas de sección están en español (#32)', async ({ page }) => {
  await page.goto('/');
  for (const etiqueta of [
    '01 / QUÉ CONSTRUYO',
    '02 / PROYECTOS DESTACADOS',
    '03 / CAPACIDADES',
    '04 / PROCESO',
    '05 / SOBRE MÍ',
    '06 / CONTACTO',
  ]) {
    await expect(page.getByText(etiqueta, { exact: true })).toHaveCount(1);
  }
  const body = await page.locator('body').innerText();
  for (const ingles of ['WHAT I BUILD', 'SELECTED WORK', 'CAPABILITIES', 'ABOUT', 'AI Engineer', 'INFRASTRUCTURE', 'INTERNAL SYSTEMS', 'AUTOMATION', 'UNDERSTAND', 'SHIP & ITERATE', 'Product Development']) {
    expect(body).not.toContain(ingles);
  }
  await expect(page).toHaveTitle(/Ingeniero Full-Stack e IA/);
});
