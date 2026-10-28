# 004 — Una sola vía de despliegue

- **Issue:** #6 · **Prioridad alta**
- **Estado:** Implementada en `dev` (PR #21 y PR de cierre de `deploy.yml`)

## Problema y evidencia
Producción la publica Workers Builds (integración Git de Cloudflare), mientras `.github/workflows/deploy.yml` intenta `wrangler pages deploy` y falla (run 34179448469: falta `CLOUDFLARE_API_TOKEN`). El check Workers Builds también falla en PR #2 y #19. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/6](https://github.com/ArlandMv/arland-michelena-digital/issues/6).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Solo Workers Builds | Ya publica producción; sin secrets en GitHub; previews por rama. | Log solo visible en el dashboard. |
| Solo GitHub Actions + wrangler | Todo visible en GitHub. | Requiere API token en secrets; `pages deploy` no corresponde a un proyecto Worker. |

## Solución escogida
Solo Workers Builds, con `wrangler.jsonc` versionado (assets `./dist`, fallback SPA) y retiro de `deploy.yml` (deshabilitarlo, no borrar historial sin acuerdo).

## Resultado (28-10-2026, 01:10 hora de Chile)
- PR [#21](https://github.com/ArlandMv/arland-michelena-digital/pull/21) agregó `wrangler.jsonc` (build `npm run build`, assets `./dist`, fallback SPA). El check Workers Builds pasó por primera vez; la preview de rama respondió 200 en `/` y en rutas profundas.
- `deploy.yml` queda solo con `workflow_dispatch` (respaldo manual, sin borrar el archivo), para que el push a `main` no dispare un deploy fallido sin secrets.
- Falta confirmar en producción tras el merge `dev` → `main`.
