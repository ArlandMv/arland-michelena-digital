# 006 — Cabeceras de seguridad y CSP

- **Issue:** #8 · **Prioridad media**
- **Estado:** Propuesta

## Problema y evidencia
Sin CSP, HSTS, nosniff ni frame-ancestors en `https://arlandstack.com`. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/8](https://github.com/ArlandMv/arland-michelena-digital/issues/8).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| `public/_headers` | Declarativo, versionado. | Depende de cómo Workers Assets aplique `_headers`. |
| Headers en un Worker | Control total. | Más código. |

## Solución escogida
`public/_headers` con CSP que permita Google Fonts, Turnstile y el propio origen; HSTS; nosniff; `frame-ancestors 'none'`; Referrer-Policy.

## Qué falta
Validar en securityheaders.com tras el deploy.
