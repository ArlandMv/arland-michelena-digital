# 008 — Metadatos OG, canonical y favicon

- **Issue:** #10 · **Prioridad media**
- **Estado:** Implementada — canonical, `og:url`, `og:image` 1200×630 y `og:locale` en el Ciclo 10 (ver [021](021-pruebas-movil-a11y-seo.md)); favicon, apple-touch-icon, manifest y JSON-LD `Person`/`WebSite` en el Ciclo 16 (ver [027](027-favicon-jsonld.md)).

## Problema y evidencia
`index.html` no tiene `og:image`, `og:url`, canonical, favicon ni JSON-LD. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/10](https://github.com/ArlandMv/arland-michelena-digital/issues/10).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Imagen OG estática + metadatos en `index.html` | Rápido y suficiente. | Imagen a diseñar. |
| OG dinámica generada en Worker | Flexible. | Excesivo para un portafolio. |

## Solución escogida
Estática, con la paleta del sitio (fondo #0D0D0F, morado #7A2E84, acento #B66A43) y JSON-LD `Person`.

## Qué falta
Diseñar imagen 1200×630.
