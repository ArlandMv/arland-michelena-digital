# 001 — Formulario de contacto real

- **Issue:** #3 · **Prioridad alta**
- **Estado:** Implementado (pendiente cargar secrets en Cloudflare)

## Problema y evidencia
`src/components/ContactSection.tsx:21-27` simula el envío (`setTimeout` → `success`); `POST /api/contact` responde 405. Los mensajes de clientes se pierden. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/3](https://github.com/ArlandMv/arland-michelena-digital/issues/3).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Cloudflare Function (`/api/contact`) + D1 + correo (Cloudflare Email Sending o Resend) | Todo en la misma plataforma que ya sirve el sitio; datos propios y consultables con SQL; costo ~0; sin dependencias de terceros para guardar. | Requiere escribir el endpoint y el esquema; correo requiere dominio verificado. |
| Airtable vía API | Interfaz visual cómoda para revisar leads. | Otra cuenta y token que proteger; límites de API; datos fuera de Cloudflare. |
| n8n (webhook) | Flujos visuales flexibles. Propuesto en las conversaciones de AI Studio. | Requiere hospedar/pagar n8n; otra pieza que mantener para un caso simple. |
| Netlify Forms | Cero backend. También propuesto en AI Studio. | El sitio no está en Netlify; implicaría migrar el hosting. |

## Solución escogida
**Airtable vía API desde un Worker de Cloudflare** (decisión de Arland, reemplaza la propuesta inicial de D1 + correo). Los leads se revisan en la base *CRM Leads · arlandstack.com* (`appH6NWzsko5eLlyu`), tabla *Solicitudes de contacto* (`tblY7Lm88XH1YqdM7`).

### Implementación
- `worker/index.ts`: Worker con assets estáticos (Workers Builds, no Pages). `run_worker_first: ["/api/*"]`; el resto lo sirve `env.ASSETS`.
- `POST /api/contact`: honeypot `website` (200 silencioso, no guarda) → rate-limit best-effort 5/10 min por IP (429) → validación (422) → Turnstile `siteverify` (403) → Airtable `POST /v0/{base}/{table}` con `typecast: true` (502 si falla). Sin configuración responde 503.
- Campos escritos: Nombre, Email, Empresa, Estado del proyecto, Qué necesita, Recibido, Origen = "Formulario web", Estado del lead = "Nuevo".
- Opciones exactas de *Estado del proyecto*: `Idea inicial / Definición`, `En desarrollo activo`, `En producción (requiere mejoras)`, `Migración / Refactorización`.
- Frontend: estados idle/submitting/success/error con spinner y mensaje de error; widget Turnstile sólo si existe `VITE_TURNSTILE_SITE_KEY`.
- E2E: `e2e/contact-form.spec.ts` (mock de `/api/contact`, éxito y error).

### Configuración requerida (Cloudflare → Worker → Settings)
| Nombre | Tipo | Dónde |
|---|---|---|
| `AIRTABLE_TOKEN` | Secret | Variables and Secrets (PAT con `data.records:write` sólo sobre la base) |
| `TURNSTILE_SECRET_KEY` | Secret | Variables and Secrets |
| `VITE_TURNSTILE_SITE_KEY` | Variable de build | Workers Builds → Build variables |
| `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID` | Var (no secreta) | Ya en `wrangler.jsonc` |

Local: copiar a `.dev.vars` (ignorado por git).
