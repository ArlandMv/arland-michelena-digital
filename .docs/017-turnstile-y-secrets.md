# 017 — Activación del formulario: Turnstile, secrets y variable de build

- **Estado:** Implementado (2026-10-28)
- **Relacionado:** [001](001-formulario-contacto.md), [003](003-anti-spam.md), [004](004-despliegue.md)

## Problema
`/api/contact` respondía `503 not_configured`: el Worker no tenía `AIRTABLE_TOKEN` ni `TURNSTILE_SECRET_KEY`, y el build no tenía `VITE_TURNSTILE_SITE_KEY`, por lo que el widget no se renderizaba.

## Qué se configuró
| Elemento | Dónde | Valor / nota |
|---|---|---|
| Widget Turnstile `arlandstack-contacto` | Cloudflare → Turnstile (API `challenges/widgets`) | Modo **managed**. Dominios: `arlandstack.com`, `www.arlandstack.com`, `arland-michelena-digital.michelenaarland.workers.dev` |
| Site key (pública) | Workers Builds → variables de build de **ambos** triggers (producción `main` y no‑producción `*`) | `VITE_TURNSTILE_SITE_KEY=0x4AAAAAAFpHYgnvoHqXIVFP` |
| `TURNSTILE_SECRET_KEY` | Secret del Worker (`wrangler secret put`) | No se versiona |
| `AIRTABLE_TOKEN` | Secret del Worker (`wrangler secret put`) | Token personal con alcance a la base `appP7fO5tHH0hmYal`; no se versiona |
| `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID` | `wrangler.jsonc` → `vars` | Sin cambios |

## Por qué así
- **Site key como variable de build y no en el repo:** Vite la incrusta en el bundle al compilar; Workers Builds la inyecta en `npm run build`. Rotar el widget no requiere commit.
- **Secrets con `wrangler secret put`:** agrega/actualiza un secret sin tocar los demás ni las `vars`.
- **Managed:** Cloudflare decide si mostrar desafío; la mayoría de usuarios no interactúa.
- **Dominio workers.dev incluido:** permite probar previews/no‑producción.

## Verificación
- Con token Turnstile falso, `POST /api/contact` responde `403 {"error":"turnstile"}` (ya no `503 not_configured`).
- Escritura en Airtable validada creando un registro marcado "PRUEBA del Revisor" (se conserva).
- `www.arlandstack.com` redirige (301) a `arlandstack.com`.

## Rotación
1. Turnstile: regenerar secret en el dashboard → `wrangler secret put TURNSTILE_SECRET_KEY`.
2. Airtable: crear token nuevo → `wrangler secret put AIRTABLE_TOKEN` → revocar el anterior.
