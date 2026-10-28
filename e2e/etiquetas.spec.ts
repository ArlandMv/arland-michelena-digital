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

test('las etiquetas decorativas del hero y de proyectos están en español (Ciclo 14)', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#hero');
  for (const etiqueta of ['COORDENADAS', 'UBICACIÓN', 'ESTADO', 'ACTIVO', 'GRILLA:REF_001', 'SIS:PROD', 'GEOMETRÍA_ING', 'NÚCLEO_AMATISTA']) {
    await expect(hero.getByText(etiqueta, { exact: true })).toHaveCount(1);
  }
  await expect(hero.getByText('MARCA FACETADA COMPLETA // V-2025')).toHaveCount(1);
  const body = await page.locator('body').innerText();
  for (const ingles of ['COORDINATES', 'LOCATION', 'STATUS', 'ACTIVE', 'GRID:REF', 'SYS:PROD', 'ENG_GEOMETRY', 'FACETED MARK', 'PURPLE_AMETHYST', 'ARCHITECTURE TOPOLOGY', 'SYS_RUNNING', 'IN DEVELOPMENT', 'Dedicated Host', 'Persistent Volumes', 'Reverse Proxy', 'Web Standards', 'Embeddings Query']) {
    expect(body).not.toContain(ingles);
  }
  await expect(page.locator('#faceted-mark-card img')).toHaveAttribute('alt', /^Emblema de ARLAND/);
});
