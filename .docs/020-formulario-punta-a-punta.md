# 020 — Formulario de contacto de punta a punta (Ciclo 08)

- **Issues:** #3 (formulario real), #5 (anti-spam), #33 (pruebas del endpoint)
- **Estado:** Implementada (Ciclo 08, 28-10-2026)
- **Relacionado:** [001](001-formulario-contacto.md), [003](003-anti-spam.md), [017](017-turnstile-y-secrets.md)

## Problema
Se reportó que `POST /api/contact` en producción respondía **422 con cuerpo vacío**.

### Diagnóstico
| Hipótesis | Verificación | Resultado |
|---|---|---|
| Falta `VITE_TURNSTILE_SITE_KEY` en el build | El bundle de producción contiene la site key `0x4AAAAAAFpHYgnvoHqXIVFP` | Descartada |
| Validación | `POST {}` → `422 {"ok":false,"error":"validation","fields":["name","email","projectStage","message"]}` | **Causa**: el 422 es la respuesta esperada a un cuerpo incompleto; el cuerpo JSON sí existe (la observación previa no leyó el cuerpo, p. ej. `curl -o /dev/null`) |
| Turnstile fallando | Payload válido con token falso → `403 {"error":"turnstile"}` | Funciona como se espera |
| Nombres de campos de Airtable | Esquema de `tblcCzdpPS1DHa7m8` (Nombre, Email, Empresa, Estado del proyecto, Qué necesita, Recibido, Origen, Estado del lead, Notas) coincide con el Worker | Correcto |

Riesgos reales encontrados en la revisión:
1. Si `siteverify` o Airtable lanzaban un error de red, el Worker respondía **500 sin cuerpo** (excepción no capturada).
2. El frontend mostraba un mensaje genérico ante un 422, sin indicar qué campo corregir.
3. Si el usuario enviaba antes de que Turnstile emitiera el token, el servidor respondía 403 y el mensaje sugería recargar la página.
4. El Worker no tenía pruebas automatizadas (#33).

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| Pruebas con `vitest` + `@cloudflare/vitest-pool-workers` | Runtime workerd real | Nueva dependencia y configuración; `compatibility_date` del repo es mayor que la soportada por el workerd local |
| **Pruebas con Playwright importando `worker/index.ts` y simulando `fetch`** | Sin dependencias nuevas; corren en el mismo paso de CI que ya bloquea el merge | Corre en Node, no en workerd (las APIs usadas — `Request`, `Response`, `FormData`, `fetch` — son estándar en ambos) |
| Probar contra la preview de Cloudflare | Entorno real | Requiere token Turnstile válido y escribe en Airtable en cada corrida |

## Solución escogida
- `worker/index.ts`: `try/catch` en `siteverify` (falla → 403 `turnstile`), en la llamada a Airtable (falla → 502 `upstream`) y alrededor del handler (→ 500 `internal`). **Toda** respuesta de `/api/*` es JSON. Se registra `error-codes` de Turnstile en los logs. Se exportan `handleContact` y `resetRateLimit` para pruebas.
- `ContactSection.tsx`: si existe la site key y aún no hay token, no envía y pide completar la verificación; ante 422 lista los campos a corregir; ante respuesta no JSON muestra error genérico.
- `e2e/api-contact.spec.ts` (12 pruebas, #33): éxito con mapeo exacto de campos a Airtable, 422 con `fields`, 400 JSON inválido, 405, honeypot sin escritura, rate limit (6.º envío → 429, otra IP no afectada), Turnstile inválido/ausente/caído → 403, 503 sin configuración, Airtable con error o caído → 502 sin filtrar detalles, 404 en otras rutas `/api/*`.
- `e2e/contact-form.spec.ts`: +2 pruebas (422 con campos; respuesta no JSON).

## Pendientes
- Rate limit es best-effort por instancia del Worker; para un límite global conviene una regla de Rate Limiting/WAF en Cloudflare (requiere permiso de zona) o Durable Objects.
