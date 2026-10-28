# 007 — robots.txt y sitemap.xml

- **Issue:** #9 · **Prioridad media**
- **Estado:** Implementada (Ciclo 06)

## Problema y evidencia
`/robots.txt` y `/sitemap.xml` devolvían el HTML de la SPA (200 `text/html`) porque el Worker usa `not_found_handling: single-page-application` y no había archivos reales; Lighthouse marcaba 23 errores en robots-txt. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/9](https://github.com/ArlandMv/arland-michelena-digital/issues/9).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Archivos estáticos en `public/` | Simple; los assets estáticos tienen prioridad sobre el fallback SPA. | Mantener `lastmod` a mano (una sola página). |
| Plugin de Vite generador | Automático. | Dependencia extra innecesaria para una landing. |
| Rutas en el Worker | Control total de cabeceras. | Más código y ejecuta el Worker en cada petición. |

## Solución escogida
Archivos estáticos `public/robots.txt` (permite todo y declara el sitemap) y `public/sitemap.xml` (una URL: `https://arlandstack.com/`, dominio canónico; `www` redirige 301). Tests E2E en `e2e/seo-archivos.spec.ts` verifican que no sean HTML.

## Qué falta
- Actualizar `lastmod` cuando cambie el contenido de forma relevante.
- La etiqueta `canonical` es parte de #10 (PR #42 externo pendiente de decisión de Arland).
