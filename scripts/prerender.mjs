#!/usr/bin/env node
/**
 * Ciclo 18 (#75) · pre-render + CSS incrustado · ver .docs/028-prerender-css-critico.md
 *
 * Corre después de `vite build` (cliente) y `vite build --ssr src/entry-server.tsx --outDir .ssr`:
 *  1. Renderiza <App /> a HTML y lo pone dentro de <div id="root"> en dist/index.html,
 *     así el primer pintado (y la imagen LCP del hero) no esperan al bundle de React.
 *  2. Reemplaza el <link rel="stylesheet"> del bundle por un <style> con el mismo CSS
 *     (7 KB gzip), que deja de bloquear el render. La CSP permite style-src 'unsafe-inline'.
 * El archivo .css sigue en dist/assets por si algo lo referencia; no se borra nada.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const htmlPath = resolve(root, 'dist/index.html');
let html = readFileSync(htmlPath, 'utf8');

const { render } = await import(pathToFileURL(resolve(root, '.ssr/entry-server.js')).href);
const appHtml = render();
if (!appHtml.includes('id="hero"')) throw new Error('prerender: el HTML renderizado no trae la sección #hero');

const EMPTY_ROOT = '<div id="root"></div>';
if (!html.includes(EMPTY_ROOT)) throw new Error('prerender: no se encontró <div id="root"></div> en dist/index.html');
html = html.replace(EMPTY_ROOT, `<div id="root">${appHtml}</div>`);

const cssLinks = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g)];
for (const [tag, href] of cssLinks) {
  const css = readFileSync(resolve(root, 'dist', href.slice(1)), 'utf8').replace(/<\/style/gi, '<\\/style');
  html = html.replace(tag, () => `<style data-href="${href}">${css}</style>`);
}

// Ciclo 19: el plugin preloadFonts deja las precargas de fuentes al final del <head>, detrás de
// ~33 KB de CSS incrustado y del <script type="module">. Se mueven justo después de la precarga
// de la imagen LCP (antes del dns-prefetch del beacon), para que el navegador las pida antes.
// Ver .docs/030-orden-head-lcp.md
const fontPreloads = [...html.matchAll(/[ \t]*<link rel="preload"[^>]*as="font"[^>]*>\n?/g)].map((m) => m[0]);
if (fontPreloads.length) {
  for (const tag of fontPreloads) html = html.replace(tag, '');
  const anchor = html.indexOf('<link rel="dns-prefetch"');
  const firstStyle = html.indexOf('<style data-href');
  const at = anchor !== -1 ? anchor : firstStyle;
  if (at === -1) throw new Error('prerender: no se encontró dónde reubicar las precargas de fuentes');
  const block = fontPreloads.map((t) => t.trim()).join('\n    ') + '\n    ';
  html = html.slice(0, at) + block + html.slice(at);
}

writeFileSync(htmlPath, html);
console.log(`prerender: ${(appHtml.length / 1024).toFixed(1)} KiB de HTML y ${cssLinks.length} CSS incrustado(s) y ${fontPreloads.length} precarga(s) de fuente reubicada(s) en dist/index.html`);
