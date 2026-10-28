# 030 · Orden del `<head>`: precargas de fuentes antes del CSS incrustado

- **Issue:** [#82](https://github.com/ArlandMv/arland-michelena-digital/issues/82)
- **Prioridad:** baja · **Estado:** Implementada (Ciclo 19, 28-10-2026)

## Problema
Con el pre-render del Ciclo 18 ([028](028-prerender-css-critico.md)), `dist/index.html` quedaba así dentro del `<head>`:
precarga de la imagen LCP → `dns-prefetch` del beacon → `<script type="module">` → `<style data-href>` (~33 KB de CSS)
→ `meta build-commit` → **tres `<link rel="preload" as="font">`**. El plugin `preloadFonts` de `vite.config.ts` usa
`injectTo: 'head'`, que agrega al final del `<head>`, y el pre-render inserta el CSS antes. Resultado: las fuentes del
hero se descubren después de parsear todo el CSS incrustado.

## Alternativas evaluadas
1. **`injectTo: 'head-prepend'` en el plugin.** Las pone al inicio, pero antes del `<meta charset>` y de la precarga
   de la imagen LCP, que debe ir primero.
2. **Reubicarlas en `scripts/prerender.mjs`**, justo después de la precarga de la imagen LCP (antes del `dns-prefetch`,
   del bundle y del CSS incrustado). Sin dependencias nuevas y en el mismo paso que ya arma el HTML final. → **Escogida.**
3. **Precargar las fuentes a mano en `index.html`.** Los nombres llevan hash de Vite; habría que mantenerlos a mano.

## Solución escogida
- `scripts/prerender.mjs`: después de incrustar el CSS, toma los `<link rel="preload" … as="font">`, los quita de su
  lugar y los inserta antes del `<link rel="dns-prefetch">` (o antes del primer `<style data-href>` si no existe).
  El log del build informa cuántas reubicó.
- Nueva prueba `e2e/orden-head.spec.ts`: lee `dist/index.html` (el CI corre `npm run build` antes de Playwright) y
  exige que cada precarga de fuente quede después de la de la imagen LCP y antes del CSS incrustado y del bundle. Se
  comprobó que falla con el código anterior y pasa con el nuevo. Se salta si no hay build.

## Resultado
- Lint OK, build OK, Playwright 258 pasan / 30 saltadas / 0 fallos (6 proyectos, incluida WebKit).
- Lighthouse móvil local contra `vite preview` (3 corridas): antes 92-93, después 92-93; LCP 2,9-3,0 s en ambos.
  Con la red simulada de Lighthouse y fuentes de ~20 KB no hay diferencia medible; el cambio es de orden correcto y
  ayuda sobre todo en redes reales con más latencia. No empeora nada.
- Capturas móvil y escritorio sin cambios visuales.
