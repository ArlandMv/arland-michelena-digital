# 006 — Cabeceras de seguridad y CSP

- **Issue:** [#8](https://github.com/ArlandMv/arland-michelena-digital/issues/8) · **Prioridad media**
- **Estado:** Implementado en `fix/cabeceras-seguridad` (Ciclo 07, 28 oct 2026). Falta validar en producción con securityheaders.com.

## Problema y evidencia
`curl -I https://arlandstack.com` no devolvía `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors` ni `Referrer-Policy`. No existía `public/_headers`.

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| `public/_headers` | Declarativo, versionado, lo aplica Workers Static Assets sin ejecutar el Worker. | No cubre las respuestas que arma el Worker (`/api/*`). |
| Headers en el Worker para todo | Control total. | Obliga a `run_worker_first` en todas las rutas: más latencia y costo. |
| Cabeceras desde reglas del dashboard (Transform Rules) | Sin tocar el repo. | No versionado; el token no tiene ese permiso. |

## Solución escogida
Combinación: `public/_headers` para los assets (Vite lo copia a `dist/`) y cabeceras base en la función `json()` de `worker/index.ts` para `/api/*`.

CSP de los assets:
- `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`.
- `script-src` y `frame-src` permiten `https://challenges.cloudflare.com` (Turnstile); `script-src` y `connect-src` permiten Cloudflare Web Analytics por si se activa.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` y `font-src https://fonts.gstatic.com` (Google Fonts). `'unsafe-inline'` en estilos se mantiene por los estilos en línea de `motion`; los scripts no lo necesitan.
- Sin `'unsafe-eval'`.

Además: HSTS de 1 año con subdominios (sin `preload` hasta que Arland lo decida, porque es difícil de revertir), `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva, `Cross-Origin-Opener-Policy: same-origin` y caché inmutable para `/assets/*` (nombres con hash).

## Verificación
- `npm run lint`, `npm run build` y Playwright (18 pruebas, incluye `e2e/cabeceras-seguridad.spec.ts`) en verde.
- `wrangler dev` local sobre `dist/`: las cabeceras aparecen en `/`, `/assets/*` lleva `immutable` y `/api/contact` devuelve las cabeceras base.
- Chromium de escritorio y móvil cargando el build con la CSP: sin errores ni avisos en consola y Google Fonts cargadas.

## Qué falta
- Tras el deploy: `curl -I https://arlandstack.com` y securityheaders.com (meta ≥ A).
- Probar el widget de Turnstile en producción con la CSP activa (localmente no hay site key).
- Decidir si se agrega `preload` a HSTS.
