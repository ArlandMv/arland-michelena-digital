# 003 — Protección anti-spam del formulario

- **Issue:** #5 · **Prioridad alta**
- **Estado:** Implementada (Turnstile + honeypot + rate-limit por instancia; ver [020](020-formulario-punta-a-punta.md)). Pendiente: límite global con regla WAF.

## Problema y evidencia
Solo validación HTML (`required`, `type=email`). Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/5](https://github.com/ArlandMv/arland-michelena-digital/issues/5).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Cloudflare Turnstile | Gratis, sin captchas molestos, nativo de Cloudflare. | Requiere verificación servidor (`siteverify`) y ajustar CSP. |
| Honeypot | Trivial, invisible para personas. | Solo detiene bots simples. |
| Rate-limit (regla WAF o contador en D1/KV) | Frena abuso masivo por IP. | Configuración adicional. |
| reCAPTCHA | Conocido. | Peor privacidad y UX; otra cuenta de Google. |

## Solución escogida
Turnstile + honeypot + rate-limit en capas: cada una cubre lo que la otra no.

## Qué falta
Site key pública (`VITE_TURNSTILE_SITE_KEY`) y secret solo en Cloudflare; implementar junto con 001.
