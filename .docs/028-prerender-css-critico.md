# 028 · Pre-render del HTML y CSS incrustado (primer pintado en móvil)

- **Issue:** [#75](https://github.com/ArlandMv/arland-michelena-digital/issues/75)
- **Prioridad:** media · **Estado:** En PR (Ciclo 18, 28-10-2026)

## Problema
Lighthouse móvil contra producción (28-10-2026, 09:58 hora de Chile): **87**, FCP 2,8 s, LCP 3,4 s, TBT 40 ms, CLS 0,013.
`dist/index.html` llegaba con `<div id="root"></div>` vacío, así que el navegador no pintaba nada hasta descargar,
parsear y ejecutar el bundle de React (262 KB, 77 KB gzip). La imagen LCP del hero estaba precargada (Ciclo 14),
pero el `<img>` solo aparecía en el DOM después de React: el 38 % del LCP era *load delay* y el 18 % *render delay*.
Además, `index-*.css` (7,5 KB gzip) bloqueaba el render ~150 ms.

## Alternativas evaluadas
1. **Solo CSS crítico incrustado** (p. ej. con `critters`/`beasties`). Quita los ~150 ms del CSS, pero el HTML sigue
   vacío hasta que corre React: no ataca el FCP de 2,8 s.
2. **Pre-render de la app completa en el build** (`renderToString` + `hydrateRoot`) con un script propio, sin
   dependencias nuevas. El HTML trae todo el contenido y React solo lo hidrata. → **Escogida.**
3. **Migrar a un framework con SSG** (Astro, Next/vinext). Mejor a largo plazo, pero es un cambio grande para un
   sitio de una sola página y excede el plazo de la rutina.
4. **SSR en el Worker** en cada request. Innecesario: el contenido es estático y el Worker solo atiende `/api/*`.

## Solución escogida
- `src/entry-server.tsx`: exporta `render()`, que devuelve `<App />` como HTML.
- `npm run build` ahora es `vite build && vite build --ssr src/entry-server.tsx --outDir .ssr --emptyOutDir && node scripts/prerender.mjs`.
  Workers Builds ya ejecuta `npm run build`, así que no cambia la configuración de Cloudflare.
- `scripts/prerender.mjs` inyecta ese HTML en `<div id="root">` de `dist/index.html` y reemplaza el
  `<link rel="stylesheet">` del bundle por `<style data-href="/assets/…css">` con el mismo CSS. La CSP ya permite
  `style-src 'unsafe-inline'`, así que no hay que tocar `_headers`. El build falla si el HTML no trae `#hero`.
- `src/main.tsx` usa `hydrateRoot` cuando `#root` ya trae nodos y `createRoot` si llega vacío (modo `npm run dev`).
- `.ssr/` queda en `.gitignore`. El `.css` sigue publicado en `/assets`.
- `scripts/smoke.mjs` acepta el CSS incrustado y agrega el chequeo **HTML pre-renderizado con el hero (#75)**.

El componente del hero ya era compatible: la hora de Santiago se calcula en un `useEffect` (estado inicial vacío),
así que el HTML del servidor y el primer render del cliente coinciden.

## Verificación
- `npm run lint` y `npm run build` OK; `dist/index.html` pasa de ~4 KB a ~91 KB (≈ 15 KB gzip).
- Hidratación sin errores ni advertencias de React en Chromium (Pixel 7 y escritorio) y WebKit (iPhone 14) con `vite preview`.
- WebKit muestra el aviso "preloaded but not used within a few seconds" para las 3 fuentes precargadas, porque el
  `load` ahora ocurre mucho antes; se verificó que cada fuente se descarga una sola vez y se usa. No es un error.
- Lighthouse y la preview de Cloudflare de la rama: ver la página del Ciclo 18 en la bitácora.

## Pendientes
- Si el sitio crece a varias rutas, evaluar la alternativa 3 (SSG).
