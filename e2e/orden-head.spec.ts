import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

// Ciclo 19: las precargas de la imagen LCP y de las fuentes deben aparecer en el <head>
// antes del CSS incrustado y del bundle, para que el navegador las pida primero.
// Ver .docs/030-orden-head-lcp.md
// Se revisa dist/index.html (el CI corre `npm run build` antes de Playwright); el servidor de
// desarrollo no pasa por el pre-render, por eso no sirve para esta prueba.
test('el head precarga imagen LCP y fuentes antes del CSS incrustado y del bundle', () => {
  test.skip(!existsSync('dist/index.html'), 'requiere npm run build');
  const html = readFileSync('dist/index.html', 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const img = head.indexOf('rel="preload" as="image"');
  const fonts = [...head.matchAll(/<link rel="preload"[^>]*as="font"/g)].map((m) => m.index ?? -1);
  const style = head.indexOf('<style data-href');
  const bundle = head.indexOf('<script type="module"');
  expect(img).toBeGreaterThan(-1);
  expect(fonts.length).toBeGreaterThanOrEqual(3);
  expect(style).toBeGreaterThan(-1);
  for (const f of fonts) {
    expect(f).toBeGreaterThan(img);
    expect(f).toBeLessThan(style);
    if (bundle !== -1) expect(f).toBeLessThan(bundle);
  }
});
