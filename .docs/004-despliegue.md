# 004 — Una sola vía de despliegue

- **Issue:** #6 · **Prioridad alta**
- **Estado:** Esperando decisión/credenciales de Arland

## Problema y evidencia
Producción la publica Workers Builds (integración Git de Cloudflare), mientras `.github/workflows/deploy.yml` intenta `wrangler pages deploy` y falla (run 34179448469: falta `CLOUDFLARE_API_TOKEN`). El check Workers Builds también falla en PR #2 y #19. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/6](https://github.com/ArlandMv/arland-michelena-digital/issues/6).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Solo Workers Builds | Ya publica producción; sin secrets en GitHub; previews por rama. | Log solo visible en el dashboard. |
| Solo GitHub Actions + wrangler | Todo visible en GitHub. | Requiere API token en secrets; `pages deploy` no corresponde a un proyecto Worker. |

## Solución escogida
Solo Workers Builds, con `wrangler.jsonc` versionado (assets `./dist`, fallback SPA) y retiro de `deploy.yml` (deshabilitarlo, no borrar historial sin acuerdo).

## Qué falta
Acceso al dashboard o al log del build fallido para diagnosticar; luego PR con `wrangler.jsonc` y desactivación de `deploy.yml`. Mientras falle, ningún merge a main cumple 'todos los checks en verde'.
