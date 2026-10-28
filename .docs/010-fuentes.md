# 010 — Fuente Material Symbols de ~3,9 MB

- **Issue:** #12 · **Prioridad alta**
- **Estado:** Propuesta

## Problema y evidencia
Lighthouse: 4.136 KiB totales, 3.914 KiB son Material Symbols; LCP 3,6 s. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/12](https://github.com/ArlandMv/arland-michelena-digital/issues/12).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Reemplazar por `lucide-react` | Ya es dependencia; tree-shaking. | Revisar íconos equivalentes. |
| Subset con `icon_names` | Mantiene estilo. | Sigue dependiendo de Google Fonts. |

## Solución escogida
`lucide-react` y self-host de IBM Plex/JetBrains Mono con `font-display: swap`.

## Qué falta
Meta: Performance ≥ 95 móvil.
