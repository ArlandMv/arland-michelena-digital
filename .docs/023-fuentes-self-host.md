# 023 — Fuentes servidas desde el propio dominio (self-host)

- **Issue relacionado:** #12 (pendiente parcial "Performance ≥ 95 móvil", ver `010-fuentes.md`)
- **Ciclo:** 12 · 28 oct 2026 · rama `perf/fuentes-self-host`
- **Estado:** Implementado; mejora medida, la meta de 95 aún no se alcanza.

## Problema
`index.html` cargaba una hoja de Google Fonts (IBM Plex Sans, IBM Plex Mono y JetBrains Mono). Esa hoja bloquea el render y obliga a abrir conexiones a dos dominios extra (`fonts.googleapis.com` y `fonts.gstatic.com`) antes de pintar texto. Lighthouse móvil marcaba ~900 ms de ahorro posible por recursos que bloquean el render.

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| `@fontsource/*` (npm), solo subconjunto latin | Versionado con el repo, Vite empaqueta y pone hash a los archivos, `font-display: swap` incluido, sin terceros. | Más archivos en `dist` (woff y woff2, aunque el navegador solo pide woff2). |
| Descargar woff2 a mano a `public/fonts` | Control total del CSS. | Mantenimiento manual de `@font-face`, sin hash ni caché inmutable. |
| Mantener Google Fonts con `preload` + `media=print` | Cambio mínimo. | Sigue dependiendo de terceros y de la CSP abierta a Google. |
| Fuentes del sistema | Cero bytes. | Cambia la identidad visual del sitio. |

## Solución escogida
`@fontsource/ibm-plex-sans` (400, 500, 600, 700), `@fontsource/ibm-plex-mono` (400, 500, 600) y `@fontsource/jetbrains-mono` (400, 500, 600), importando solo los CSS `latin-*` (cubre todo el español) en `src/main.tsx`. Un plugin pequeño en `vite.config.ts` (`preloadFonts`) agrega `<link rel="preload">` en el build para IBM Plex Sans latin 400/500/600, que son las del primer render. Se quitaron los `<link>` de Google en `index.html` y la CSP en `public/_headers` quedó con `font-src 'self'` y `style-src` sin Google. Prueba nueva `e2e/fuentes.spec.ts` (no hay peticiones a Google Fonts y IBM Plex Sans queda cargada) y `cabeceras-seguridad.spec.ts` ahora exige que la CSP no mencione Google Fonts.

## Resultado (Lighthouse móvil simulado)
| Medición | Producción antes (arlandstack.com) | Build local con el cambio |
|---|---|---|
| Performance | 82 | 90 |
| FCP | 3,1 s | 2,2 s |
| LCP | 3,9 s | 3,4 s |

Accesibilidad 100, SEO 100, buenas prácticas 96. Las cifras de producción y local no son 100 % comparables (red distinta); se vuelve a medir en producción después del release.

## Qué falta para 95
El elemento LCP es la imagen `logo-mark` (Lighthouse estima 96 KiB de ahorro: en móvil se descarga la versión de 640 px para un hueco de 288 px). Próximo paso sugerido: variante de 480 px y ajustar `sizes`/`srcset`, y revisar el CSS que todavía bloquea el render.
