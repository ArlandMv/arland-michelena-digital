# 010 — Fuente Material Symbols de ~3,9 MB

- **Issue:** #12 · **Prioridad alta**
- **Estado:** Resuelto en Ciclo 02 (rama `fix/material-symbols-lucide`). Pendiente parcial: Performance ≥ 95 móvil.

## Problema y evidencia
Lighthouse: 4.136 KiB totales, 3.914 KiB eran la fuente variable Material Symbols cargada desde `index.html`; LCP 3,6 s. Solo se usaba en 7 íconos (6 tarjetas de Capacidades y 1 en Proceso). Issue: https://github.com/ArlandMv/arland-michelena-digital/issues/12

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| Reemplazar por `lucide-react` | Ya es dependencia; SVG inline con tree-shaking; cero peticiones extra. | Íconos ligeramente distintos. |
| Subset con `&icon_names=` | Mantiene el estilo exacto. | Sigue siendo render-blocking y depende de Google Fonts. |
| Self-host del subset | Sin terceros. | Mantener el archivo a mano. |

## Solución escogida
`lucide-react`: `CapabilitiesSection` usa su `getLucideIcon(id)` existente (Globe, Server, Database, Brain, Terminal, ArrowLeftRight) y `ProcessSection` usa `Package` en lugar de `deployed_code`. Se eliminó el `<link>` de Material Symbols. Test nuevo `e2e/icons.spec.ts` verifica que no se pide la fuente y que los íconos son SVG.

## Resultado (preview local, Lighthouse móvil)
Peso total 297 KiB (antes 4.136 KiB, criterio < 500 KiB ✔). Performance 89 y LCP 3,2 s (criterio ≥ 95 aún no).

## Qué falta
Self-host de IBM Plex Sans/Mono y JetBrains Mono (p. ej. `@fontsource`) con `font-display: swap` y preload, para quitar la hoja de Google Fonts que bloquea el render.
