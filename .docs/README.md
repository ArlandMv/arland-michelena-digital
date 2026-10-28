# Decisiones técnicas — arlandstack.com

Registro de hallazgos de la auditoría y decisiones (estilo ADR) del portafolio publicado en https://arlandstack.com.

**Última actualización:** 28-10-2026, 06:45 (hora de Chile, UTC-3).

## Cómo se usa
- Un archivo por tema: `NNN-titulo.md`, con problema, evidencia, alternativas, solución escogida, estado y pendientes.
- Cada documento enlaza su issue en GitHub; el issue es donde se discute y el documento registra la decisión.
- Estados: **Propuesta** · **En PR** · **Implementada** · **Esperando decisión de Arland**.
- Al cambiar el estado, actualizar el documento y esta tabla en el mismo PR.

## Estado general
- El CI de GitHub (lint, build, E2E) pasa; las pruebas E2E corren en Chromium y WebKit (Safari), escritorio y móvil ([024](024-webkit-ci.md)).
- Después de cada push a `main`, el workflow **Smoke test producción** verifica arlandstack.com ([022](022-smoke-produccion.md)).
- El check **Workers Builds** de Cloudflare pasa desde que `wrangler.jsonc` está versionado ([004](004-despliegue.md)).
- La agenda simulada se reemplazó por WhatsApp ([002](002-agenda-whatsapp.md)); el formulario guarda los leads en Airtable con Turnstile, honeypot y rate-limit ([001](001-formulario-contacto.md), [020](020-formulario-punta-a-punta.md)).

## Índice
| # | Tema | Issue | Prioridad | Estado |
|---|---|---|---|---|
| [001](001-formulario-contacto.md) | Formulario de contacto real | #3 | alta | Implementada (Ciclo 08) |
| [002](002-agenda-whatsapp.md) | Agenda simulada → WhatsApp | #4, #18 | alta | Implementada en `dev` ([PR #19](https://github.com/ArlandMv/arland-michelena-digital/pull/19)); falta `VITE_WHATSAPP_NUMBER` en Cloudflare |
| [003](003-anti-spam.md) | Protección anti-spam del formulario | #5 | alta | Implementada (Ciclo 08); rate-limit global pendiente |
| [004](004-despliegue.md) | Una sola vía de despliegue | #6 | alta | Implementada en `dev` ([PR #21](https://github.com/ArlandMv/arland-michelena-digital/pull/21)) |
| [005](005-ci-ramas.md) | CI escuchando `develop` | #7 | media | Resuelto en `dev`; llega a `main` con el PR `dev` → `main` |
| [006](006-cabeceras-seguridad.md) | Cabeceras de seguridad y CSP | #8 | media | Propuesta |
| [007](007-robots-sitemap.md) | robots.txt y sitemap.xml | #9 | media | Implementada (Ciclo 06) |
| [008](008-seo-og.md) | Metadatos OG, canonical y favicon | #10 | media | Parcial (Ciclo 10): canonical, og:url y og:image; faltan favicon y JSON-LD |
| [009](009-logo-roto.md) | Logo alojado en googleusercontent | #11 | alta | Implementada (Ciclo 01) |
| [010](010-fuentes.md) | Fuente Material Symbols de ~3,9 MB | #12 | alta | Implementada (Ciclo 02) |
| [011](011-imagen-pesada.md) | logo-1536.png de 1,9 MB | #13 | baja | Implementada (Ciclo 06) |
| [012](012-contraste.md) | Contraste de #B66A43 en texto pequeño | #14 | media | Implementada (Ciclo 05) |
| [013](013-links-footer.md) | Links genéricos en el footer | #15 | media | Implementada (Ciclo 05) |
| [014](014-limpieza-aistudio.md) | Restos de AI Studio | #16 | baja | Implementada (Ciclo 09); `metadata.json` y `legacy.html` esperan decisión de Arland |
| [015](015-rama-first-design.md) | Rama first-design obsoleta | #17 | baja | Esperando decisión de Arland |
| [016](016-agenda-reuniones.md) | Agenda de reuniones (Calendly / Cal.com / Google Calendar) | #24 | media | Propuesta — decisión de Arland |
| [017](017-turnstile-y-secrets.md) | Activación del formulario: Turnstile, secrets y variable de build | — | alta | Implementado |
| [018](018-etiquetas-espanol.md) | Etiquetas de sección en inglés | #32 | media | Implementada (Ciclo 03) |
| [019](019-schedule-modal-honesto.md) | ScheduleModal simulaba reservas | #4 | alta | Implementada (Ciclo 04) |
| [020](020-formulario-punta-a-punta.md) | Formulario de punta a punta: errores JSON y pruebas del endpoint | #3, #5, #33 | alta | Implementada (Ciclo 08) |
| [021](021-pruebas-movil-a11y-seo.md) | Pruebas de móvil, navegación, accesibilidad, consola, recursos y SEO | #34, #35 | media | Implementada (Ciclo 10) |
| [022](022-smoke-produccion.md) | Smoke test contra producción después de cada deploy | #36 | media | Implementada (Ciclo 11) |
| [023](023-fuentes-self-host.md) | Fuentes servidas desde el propio dominio (self-host) | #12 | media | Implementada (Ciclo 12) |
| [024](024-webkit-ci.md) | Pruebas en WebKit (Safari) escritorio y iPhone, también en CI | #34, #35 | media | Implementada (Ciclo 13) |
