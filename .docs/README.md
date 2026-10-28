# Decisiones técnicas — arlandstack.com

Registro de hallazgos de la auditoría y decisiones (estilo ADR) del portafolio publicado en https://arlandstack.com.

**Última actualización:** 28-10-2026, 00:48 (hora de Chile, UTC-3).

## Cómo se usa
- Un archivo por tema: `NNN-titulo.md`, con problema, evidencia, alternativas, solución escogida, estado y pendientes.
- Cada documento enlaza su issue en GitHub; el issue es donde se discute y el documento registra la decisión.
- Estados: **Propuesta** · **En PR** · **Implementada** · **Esperando decisión de Arland**.
- Al cambiar el estado, actualizar el documento y esta tabla en el mismo PR.

## Estado general
- El CI de GitHub (lint, build, E2E) pasa.
- El check **Workers Builds** de Cloudflare falla en todos los PR; bloquea merges a `main` hasta resolver [004](004-despliegue.md).
- Formulario y agenda no entregan mensajes hoy; son la prioridad ([001](001-formulario-contacto.md), [002](002-agenda-whatsapp.md)).

## Índice
| # | Tema | Issue | Prioridad | Estado |
|---|---|---|---|---|
| [001](001-formulario-contacto.md) | Formulario de contacto real | #3 | alta | Propuesta |
| [002](002-agenda-whatsapp.md) | Agenda simulada → WhatsApp | #4, #18 | alta | En PR: [https://github.com/ArlandMv/arland-michelena-digital/pull/19](https://github.com/ArlandMv/arland-michelena-digital/pull/19) |
| [003](003-anti-spam.md) | Protección anti-spam del formulario | #5 | alta | Propuesta |
| [004](004-despliegue.md) | Una sola vía de despliegue | #6 | alta | Esperando decisión/credenciales de Arland |
| [005](005-ci-ramas.md) | CI escuchando `develop` | #7 | media | En PR: [https://github.com/ArlandMv/arland-michelena-digital/pull/2](https://github.com/ArlandMv/arland-michelena-digital/pull/2) |
| [006](006-cabeceras-seguridad.md) | Cabeceras de seguridad y CSP | #8 | media | Propuesta |
| [007](007-robots-sitemap.md) | robots.txt y sitemap.xml | #9 | media | Propuesta |
| [008](008-seo-og.md) | Metadatos OG, canonical y favicon | #10 | media | Propuesta |
| [009](009-logo-roto.md) | Logo alojado en googleusercontent | #11 | alta | Propuesta |
| [010](010-fuentes.md) | Fuente Material Symbols de ~3,9 MB | #12 | alta | Propuesta |
| [011](011-imagen-pesada.md) | logo-1536.png de 1,9 MB | #13 | baja | Propuesta |
| [012](012-contraste.md) | Contraste de #B66A43 en texto pequeño | #14 | media | Propuesta |
| [013](013-links-footer.md) | Links genéricos en el footer | #15 | media | Propuesta |
| [014](014-limpieza-aistudio.md) | Restos de AI Studio | #16 | baja | Propuesta |
| [015](015-rama-first-design.md) | Rama first-design obsoleta | #17 | baja | Esperando decisión de Arland |
