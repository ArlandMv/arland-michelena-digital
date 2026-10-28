# 025 — Imagen LCP del hero en AVIF precargado y etiquetas decorativas en español

- **Issue:** [#62](https://github.com/ArlandMv/arland-michelena-digital/issues/62) · viene de la tabla de próximos ciclos (Ciclo 14).
- **Ciclo:** 14 · 28 oct 2026 · rama `perf/lcp-hero-es`
- **Estado:** Implementada.

## Problema
### 1. LCP en móvil
El elemento LCP de la portada es la gema del hero (`#faceted-mark-card img`). Lighthouse móvil en producción (antes del ciclo) la reportaba así:

| Fase del LCP | Tiempo | % |
|---|---|---|
| TTFB | ~0,6–2,5 s | 30 % |
| **Load Delay** (descubrir la imagen) | ~1,5–4,6 s | **55 %** |
| Load Time | ~0,2–1,2 s | 14 % |

- Como la app es una SPA, el `<img>` no existe en el HTML: el navegador lo descubre recién cuando React renderiza (**Load Delay**).
- En un móvil con DPR ≥ 1,75 (el que emula Lighthouse) la caja de 288 px pide la variante de 640 px: `logo-mark-640.webp`, **101 KB** (WebP con canal alfa pesa bastante).
- Nota: el "logo de ~478 KB" que mencionaba la tabla de ciclos es `public/logos/logo-1536.png`, que no se referencia en la UI desde el Ciclo 01; la imagen realmente servida en el hero era la WebP de 101 KB.

### 2. Textos
Las etiquetas decorativas del hero (`COORDINATES`, `LOCATION`, `STATUS`, `ACTIVE`, `GRID:REF_001`, `SYS:PROD`, `ENG_GEOMETRY`, `100% VECTOR_OCTA`, `FULL FACETED MARK // V-2025`, `PURPLE_AMETHYST_CORE`), las de los diagramas de proyectos (`ARCHITECTURE TOPOLOGY`, `SYS_RUNNING`, `IN DEVELOPMENT`, `[VPS Dedicated Host]`, `Nginx Reverse Proxy`, `[SSL / Persistent Volumes]`, `Embeddings Query`, `Web Standards`, …) y el `alt` de la gema seguían en inglés. Arland prefiere el sitio en español, manteniendo los términos técnicos.

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| Bajar la calidad de la WebP | Sin cambios de markup. | 480 px WebP q75 sigue en 67 KB; se nota la pérdida antes que en AVIF. |
| **AVIF 320/480/640 (q60) + respaldo WebP en `<picture>` + preload** (escogida) | 12 / 22 / 35 KB (≈ −65 % vs WebP); visualmente equivalente (comparado lado a lado); el preload elimina el Load Delay. | Un archivo más por tamaño; el preload debe mantener el mismo `srcset`/`sizes` que el `<source>`. |
| Prerenderizar el hero en HTML (SSG) | Elimina el Load Delay de todo el hero, no solo de la imagen. | Cambia la arquitectura de build (SSG/SSR); excesivo para este ciclo. |
| Reemplazar la gema por SVG | Peso mínimo y nitidez infinita. | No existe el SVG (ver `public/logos/README.md`); necesita diseño. |

## Solución
- **Imágenes nuevas** en `public/brand/` (generadas con Pillow desde `logo-mark-640.webp`, que es el máster cuadrado con transparencia): `logo-mark-320.avif` (12 KB), `logo-mark-480.avif` (22 KB), `logo-mark-640.avif` (35 KB) y `logo-mark-480.webp` (67 KB, respaldo). **No se borró nada**: `logo-mark-320/640.webp` siguen como respaldo y `logo-1536.png` queda intacto. La `og:image` (`og-arlandstack.png`) no cambia.
- **`HeroSection.tsx`:** `<picture>` con `<source type="image/avif">` + `<img>` WebP (`srcset` 320w/480w/640w, `sizes="(min-width: 640px) 320px, 288px"`, `width`/`height` 640, `fetchpriority="high"`, `loading="eager"`, `decoding="async"`).
  - El `<picture>` se inserta como HTML (`dangerouslySetInnerHTML`) y no como elementos React. Motivo: React crea el `<img>` suelto, le asigna `srcset` y recién después lo anexa al `<picture>`; WebKit alcanza a elegir la WebP en ese momento y **descargaba dos veces** la gema (AVIF + WebP). Lo detectó la prueba nueva en los proyectos `webkit` y `movil-webkit`. Con HTML el `<img>` nace ya dentro del `<picture>` y solo se descarga una variante.
- **`index.html`:** `<link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset=… imagesizes=…>` con exactamente los mismos valores. Los navegadores sin AVIF ignoran el preload por el `type`.
- **`public/_headers`:** `/brand/*` con `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (nombres sin hash: no se usa `immutable`).
- **Textos (es-CL):** `COORDENADAS`, `UBICACIÓN`, `ESTADO`, `ACTIVO`, `GRILLA:REF_001`, `SIS:PROD`, `GEOMETRÍA_ING`, `100% VECTORIAL_OCTA`, `MARCA FACETADA COMPLETA // V-2025`, `NÚCLEO_AMATISTA`; proyectos: `TOPOLOGÍA DE ARQUITECTURA`, `SIS_EN_EJECUCIÓN`, `EN DESARROLLO`, `[Host VPS dedicado]`, `[Núcleo Huly y microservicios]`, `Nginx (proxy inverso)`, `[SSL / Volúmenes persistentes]`, `Nuxt (SSR, ruteo, pipeline de renderizado)`, `Shopify ecommerce (Liquid, scripts y assets)`, `Estándares web`, `Consulta de embeddings`. `alt` de la gema y del logo del navbar en español. Se mantienen términos técnicos (`Docker Engine`, `REST API`, `Payload`, `ASYNC_QUEUE`, `Classifier / RAG`, `pgvector`).
- **Pruebas:** `e2e/logo.spec.ts` (nueva: preload AVIF con mismo `srcset`/`sizes` que el `<source>`, `fetchpriority`, `width`/`height`, `currentSrc` AVIF, `content-type: image/avif`, < 40 KB y **una sola variante descargada**); `e2e/etiquetas.spec.ts` (nueva: etiquetas del hero en español y ninguna de las versiones en inglés). `scripts/smoke.mjs` verifica también `logo-mark-480.avif` en producción.

## Resultados
Ver el PR del Ciclo 14 para números finales (Lighthouse en preview y producción). La red del box es irregular (TTFB de 0,1 s a 3 s entre corridas), así que se corrieron varias pasadas y se reporta la mediana.

## Ajuste de diseño de la tarjeta
Con los textos en español (más largos), la fila `MARCA FACETADA COMPLETA // V-2025 · NÚCLEO_AMATISTA` se montaba sobre las etiquetas de esquina en móvil (ya pasaba antes: en móvil la fila quedaba cortada por el `aspect-square` + `overflow-hidden`). Se dejó la tarjeta cuadrada solo desde `sm` (`sm:aspect-square`), la fila con `flex-wrap` y `mb-3` para separarla de las etiquetas de esquina. Verificado con capturas en Pixel 7, iPhone 14 y escritorio 1440 px.

## Pendiente / ideas
- Prerenderizar el hero (SSG) para quitar el Load Delay del texto y de la imagen por completo.
- El `<picture>` se inserta como HTML: si se cambian `srcset`/`sizes`, actualizar también el preload de `index.html` (la prueba `logo.spec.ts` falla si no coinciden).
