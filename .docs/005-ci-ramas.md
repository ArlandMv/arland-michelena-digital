# 005 — CI escuchando `develop`

- **Issue:** #7 · **Prioridad media**
- **Estado:** Resuelto en `dev` (triggers `main`/`dev`); llega a `main` con el PR `dev` → `main`. El PR #2 queda superado.

## Problema y evidencia
`ci.yml` en main usa `push: develop` (rama inexistente). Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/7](https://github.com/ArlandMv/arland-michelena-digital/issues/7).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Corregir triggers a `main`/`dev` y PR a `main` | Cambio mínimo. | — |
| Renombrar `dev` a `develop` | Sin tocar el workflow. | Rompe flujos y PRs existentes. |

## Solución escogida
Corregir triggers y agregar `needs: verify` al deploy.

## Qué falta
Merge bloqueado por el check Workers Builds (ver 004).
