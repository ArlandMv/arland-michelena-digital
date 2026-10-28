# 005 — CI escuchando `develop`

- **Issue:** #7 · **Prioridad media**
- **Estado:** En PR: [https://github.com/ArlandMv/arland-michelena-digital/pull/2](https://github.com/ArlandMv/arland-michelena-digital/pull/2)

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
