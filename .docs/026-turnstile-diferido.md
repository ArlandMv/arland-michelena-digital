# 026 · Turnstile diferido y Cloudflare Web Analytics

- **Issue:** [#65](https://github.com/ArlandMv/arland-michelena-digital/issues/65)
- **Ciclo:** 15 (28-10-2026)
- **Prioridad:** media · **Tipo:** rendimiento
- **Estado:** Implementada (Turnstile diferido + dns-prefetch del beacon). Desactivar la auto-inyección del beacon queda como **decisión de Arland**.

## Problema
Lighthouse móvil en producción quedaba por debajo de la preview de rama (Ciclo 14: producción 91, preview 97). Medición previa del Ciclo 15 (Lighthouse 12.8.2, Chromium de Playwright, móvil simulado, 3 corridas sobre `https://arlandstack.com/`): **65 / 91 / 86** (mediana 86). Lo que pesaba:

| Recurso | Origen | Impacto observado |
|---|---|---|
| `challenges.cloudflare.com/turnstile/v0/api.js` + challenge-platform | `ContactSection` lo insertaba al montar la página | ~986 KB transferidos por cloudflare.com durante la carga inicial; compite con la imagen LCP (LCP: ~1,0 s de *load delay* y ~1,6 s de *render delay* simulados) |
| `static.cloudflareinsights.com/beacon.min.js` | Auto-inyección de Cloudflare Web Analytics en el edge (no está en el repo) | ~10 KB y ~70 ms de CPU; `type="module"`, no bloquea el render |
| `index-*.css` | propio | bloqueo de render ~150 ms (7,5 KB) — no se toca en este ciclo |

## Alternativas evaluadas
1. **Mantener la carga implícita de Turnstile** (`.cf-turnstile` + api.js al montar). Simple, pero paga el coste en todas las visitas, aunque el 90 % no llegue al formulario.
2. **Cargar Turnstile solo al enviar.** Mínimo coste, pero el usuario esperaría el challenge al hacer clic (peor UX y más fallos).
3. **Turnstile en modo explícito, cargado cuando el formulario se acerca (IntersectionObserver, `rootMargin: 1200px`) o al primer foco/toque en el formulario.** ✅ Elegida: la carga inicial queda libre y el widget suele estar listo antes de que el usuario termine de escribir.
4. **Beacon: `preconnect` a static.cloudflareinsights.com.** Descartado: abre una conexión TLS temprana que compite con la imagen LCP por un script de 10 KB no crítico.
5. **Beacon: `dns-prefetch`.** ✅ Elegido: coste casi nulo, ahorra la resolución DNS cuando el edge inyecta el script.
6. **Beacon: desactivar la auto-inyección y cargarlo desde el código tras `load`/`requestIdleCallback`.** Posible mejora extra; requiere cambiar la configuración de Web Analytics en el dashboard de Cloudflare → **decisión de Arland** (ver abajo).

## Solución implementada
- `src/components/ContactSection.tsx`
  - `loadTurnstile()` inserta una sola vez `api.js?render=explicit` (promesa compartida, reintento si falla la red).
  - Un `IntersectionObserver` sobre `#contacto` con `rootMargin: '1200px 0px'` y los eventos `focusin`/`pointerdown`/`touchstart` del formulario disparan la carga; luego `turnstile.render()` sobre `#turnstile-widget` con `sitekey`, `theme: 'dark'`, `language: 'es'`.
  - El contenedor reserva `min-h-[65px]` para que la aparición diferida no genere CLS.
  - Al volver al formulario tras un envío exitoso el widget se vuelve a renderizar (antes, con carga implícita, no se re-renderizaba); `reset()` usa el id del widget.
  - Se mantiene la lógica del Ciclo 08: sin token `cf-turnstile-response`, el envío muestra “Completa la verificación anti-bots…” y no llama a `/api/contact`.
- `index.html`: `<link rel="dns-prefetch" href="https://static.cloudflareinsights.com">`.
- `public/_headers`: sin cambios; la CSP ya permite `challenges.cloudflare.com` en `script-src`, `frame-src` y `connect-src`.
- Pruebas: `e2e/turnstile-diferido.spec.ts` (3 pruebas × 4 proyectos) sobre una segunda instancia de Vite en `:3001` con la site key pública de pruebas de Cloudflare y `api.js` simulado: no se pide Turnstile al abrir; se pide con `render=explicit` al acercarse al formulario; el envío lleva el token; sin token no se envía.

## Decisión pendiente para Arland: beacon de Web Analytics
Hoy el edge inyecta `beacon.min.js` (auto-inyección). Opciones:
- **Dejarlo así** (recomendado por ahora): ya es `type="module"` y su impacto medido es pequeño.
- **Desactivar la auto-inyección** (Cloudflare → Analytics & Logs → Web Analytics → sitio → *Manage site* → desactivar *Automatic setup*/JS snippet) y cargar el snippet manual desde el código tras `requestIdleCallback`. Requiere copiar el `token` público del sitio a una variable de build (`VITE_CF_BEACON_TOKEN`) y mantener la CSP actual. No se cambió el dashboard en este ciclo.

## Medidas
| Medición | Antes | Después |
|---|---|---|
| Producción (3 corridas, mediana) | 65 / 91 / 86 → **86** | ver tabla abajo |
| Preview de rama | 97 (Ciclo 14) | ver tabla abajo |
