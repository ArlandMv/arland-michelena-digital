import { test, expect } from '@playwright/test';

// Ciclo 16 (#10): favicon, apple-touch-icon, manifest y datos estructurados JSON-LD.
// Ojo: con not_found_handling = SPA un archivo inexistente responde 200 con HTML, por eso se valida el tipo y el contenido.

const ICONOS: Array<[string, RegExp]> = [
  ['/favicon.svg', /image\/svg\+xml/],
  ['/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/],
  ['/favicon-32.png', /image\/png/],
  ['/apple-touch-icon.png', /image\/png/],
  ['/icon-192.png', /image\/png/],
  ['/icon-512.png', /image\/png/],
];

for (const [ruta, tipo] of ICONOS) {
  test(`${ruta} responde 200 con el tipo correcto (#10)`, async ({ request }) => {
    const res = await request.get(ruta);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(tipo);
    const body = await res.body();
    expect(body.toString('utf8', 0, 200)).not.toContain('<!doctype html');
  });
}

test('el HTML declara favicon, apple-touch-icon, manifest y theme-color (#10)', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0D0D0F');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBe('/site.webmanifest');
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  const manifest = await res.json();
  expect(manifest.lang).toBe('es');
  expect(manifest.theme_color).toBe('#0D0D0F');
  expect(manifest.icons.map((i: { src: string }) => i.src)).toEqual(
    expect.arrayContaining(['/icon-192.png', '/icon-512.png']),
  );
});

test('el JSON-LD se parsea y describe a la Person con sameAs y el WebSite (#10)', async ({ page }) => {
  await page.goto('/');
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(bloques.length).toBeGreaterThan(0);
  const nodos = bloques.flatMap((b) => {
    const data = JSON.parse(b);
    return data['@graph'] ?? [data];
  });
  const persona = nodos.find((n) => n['@type'] === 'Person');
  expect(persona).toBeTruthy();
  expect(persona.name).toBe('Arland E. Michelena Villegas');
  expect(persona.url).toBe('https://arlandstack.com/');
  expect(persona.jobTitle).toMatch(/fullstack/i);
  expect(persona.jobTitle).toMatch(/Agentforce/);
  expect(persona.sameAs).toEqual(
    expect.arrayContaining(['https://github.com/ArlandMv', 'https://www.linkedin.com/in/arland-michelena']),
  );
  const sitio = nodos.find((n) => n['@type'] === 'WebSite');
  expect(sitio?.url).toBe('https://arlandstack.com/');
  expect(sitio?.inLanguage).toBe('es');
});

test('el favicon se carga sin violar la CSP (#10)', async ({ page }) => {
  const csp: string[] = [];
  page.on('console', (m) => {
    if (/Content Security Policy|CSP/i.test(m.text())) csp.push(m.text());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(csp).toEqual([]);
});
