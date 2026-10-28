# 022 — Smoke test contra producción después de cada deploy

- **Issue:** [#36](https://github.com/ArlandMv/arland-michelena-digital/issues/36) · **Prioridad media**
- **Estado:** Implementada (Ciclo 11, 28 oct 2026)

## Problema y evidencia
- El CI (`ci.yml`) prueba el código en un servidor local, pero nada verificaba **producción** después de que Workers Builds publica `main`: un secret borrado, un `_headers` mal aplicado o un asset roto solo se descubrían a mano.
- Comportamiento real de producción medido con `curl` antes de implementar (28 oct 2026, 05:50 hora de Chile):
  - `https://arlandstack.com` → 200, `<title>ARLAND — Ingeniero Full-Stack e IA</title>`, con CSP, HSTS (`max-age=31536000; includeSubDomains`), `nosniff`, `X-Frame-Options: DENY`.
  - `https://www.arlandstack.com` → **301** a `https://arlandstack.com/`.
  - `POST /api/contact` con campos válidos y token Turnstile falso → **403** `{"ok":false,"error":"turnstile"}`. El Worker valida Turnstile antes de llamar a Airtable, así que la prueba **no crea leads**. Un 503 `not_configured` indicaría secrets faltantes.

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Esperar un tiempo fijo (p. ej. 3 min) y probar | Simple. | Frágil: si el build tarda más, prueba la versión anterior y da un falso verde. |
| Reintentar con backoff hasta que pase | Sin cambios en el sitio. | No distingue "aún no desplegó" de "desplegó roto"; puede dar verde con la versión vieja. |
| Consultar la API de Workers Builds con un token de Cloudflare en Actions | Sabe exactamente cuándo terminó el build. | Requiere guardar un token de Cloudflare como secret de GitHub (más superficie de ataque). |
| **`<meta name="build-commit">` en el HTML + espera hasta que coincida con el commit pusheado** | Sin secrets; prueba exactamente el commit nuevo; también sirve para diagnosticar qué versión está en producción. | Agrega un meta (inofensivo) al HTML. |
| Playwright contra producción | Reusa la suite. | Lento, instala navegadores, más ruido; la suite E2E ya cubre la UI. |
| Script Node sin dependencias (`fetch`) | Rápido (~1 s), corre igual en local y en Actions. | Chequeos HTTP, no de UI. |

## Solución escogida
- `vite.config.ts` agrega `<meta name="build-commit" content="…">` con `WORKERS_CI_COMMIT_SHA` (variable que Workers Builds inyecta en el build), `GITHUB_SHA` o `local`.
- `scripts/smoke.mjs` (`npm run smoke`), Node 20 sin dependencias:
  1. Si hay `SMOKE_EXPECTED_SHA`, espera (hasta `SMOKE_WAIT_SECONDS`, 480 s por defecto, sondeando cada 20 s con cache-busting) a que la home sirva ese commit.
  2. Home 200 con título `ARLAND…`.
  3. Cabeceras de seguridad (#8): CSP con `default-src 'self'` y `frame-ancestors 'none'`, HSTS ≥ 1 año, `nosniff`, `X-Frame-Options: DENY`.
  4. `www` → 301 a la raíz.
  5. JS y CSS de `/assets/` referenciados en el HTML: 200, content-type correcto, no vacíos.
  6. Logo (`/brand/logo-mark-320.webp`, `-128.webp`) e imagen `og:image`: 200 y `image/*`.
  7. `robots.txt` (con `Sitemap:`) y `sitemap.xml` (con `<urlset>`/`<loc>`).
  8. `POST /api/contact` con token falso → 403 `turnstile`. Mensajes explícitos para 503 (secrets faltantes) y 429 (rate-limit). Solo 2 intentos para no gastar el rate-limit (5 cada 10 min por IP).
  - Cada chequeo reintenta con backoff exponencial (4 intentos, base 3 s) para absorber errores transitorios del edge.
  - En Actions escribe anotaciones `::error` y una tabla en el resumen del job.
- `.github/workflows/smoke.yml`: corre en cada push a `main` y por `workflow_dispatch` (input `esperar_deploy`). Si falla, el job queda en rojo (GitHub notifica al autor) y abre o comenta el issue **"Smoke test de producción falló"** con el link al run. Usa solo `GITHUB_TOKEN` (permisos `contents: read`, `issues: write`); no necesita secrets de Cloudflare.
- `e2e/build-commit.spec.ts` asegura que el meta siga existiendo.

## Verificación (Ciclo 11)
- `npm run smoke` local contra producción: 7/7 chequeos OK en ~1 s.
- Prueba negativa: `SMOKE_BASE_URL=https://example.com` → 6 fallos y exit 1; `SMOKE_EXPECTED_SHA=deadbeef SMOKE_WAIT_SECONDS=5` → falla la espera del deploy con mensaje claro.
- `actionlint` sin observaciones en `smoke.yml`.

## Qué falta
- Si Workers Builds dejara de inyectar `WORKERS_CI_COMMIT_SHA`, la espera fallaría tras 8 min: revisar el build o correr el workflow a mano con `esperar_deploy` desactivado.
- Opcional: smoke programado (cron diario) para detectar caídas sin deploy.
