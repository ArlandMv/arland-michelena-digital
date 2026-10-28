# 009 — Logo alojado en googleusercontent

- **Issue:** #11 · **Prioridad alta**
- **Estado:** Propuesta

## Problema y evidencia
`src/data/portfolioData.ts:12-13` apunta a `lh3.googleusercontent.com` (URLs temporales de AI Studio); la petición del logo falla en producción. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/11](https://github.com/ArlandMv/arland-michelena-digital/issues/11).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Usar `public/logos/*.webp` ya existentes | Inmediato, sin terceros. | — |
| Cloudflare Images | Variantes automáticas. | Costo y configuración. |

## Solución escogida
Assets locales con width/height explícitos.

## Qué falta
Ver también `LOGO_OPTIMIZATION_TODO.md`.
