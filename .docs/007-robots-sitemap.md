# 007 — robots.txt y sitemap.xml

- **Issue:** #9 · **Prioridad media**
- **Estado:** Propuesta

## Problema y evidencia
Ambos devuelven el HTML de la SPA (200 `text/html`); Lighthouse marca 23 errores en robots-txt. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/9](https://github.com/ArlandMv/arland-michelena-digital/issues/9).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Archivos estáticos en `public/` | Simple. | Mantener sitemap a mano (una sola página). |
| Plugin de Vite generador | Automático. | Dependencia extra innecesaria para una landing. |

## Solución escogida
Archivos estáticos en `public/`.

## Qué falta
—
