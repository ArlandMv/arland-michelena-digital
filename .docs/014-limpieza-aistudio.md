# 014 — Restos de AI Studio

- **Issue:** [#16](https://github.com/ArlandMv/arland-michelena-digital/issues/16) · **Prioridad baja**
- **Estado:** Implementada (Ciclo 09) — archivos `metadata.json` y `legacy.html`: **Esperando decisión de Arland**

## Problema y evidencia
El proyecto nació como plantilla de Google AI Studio y arrastraba piezas que el sitio no usa:
- `package.json` con `name: react-example`, dependencias sin uso (`@google/genai`, `express`, `dotenv`, `motion`; dev: `@types/express`, `tsx`) y un script `clean` que borraba `server.js`, archivo inexistente.
- `.env.example` documentaba `GEMINI_API_KEY` y `APP_URL`, que ningún código lee.
- `vite.config.ts` tenía un interruptor `DISABLE_HMR` propio del editor de AI Studio.
- `README.md` describía cómo correr la app en AI Studio con una clave de Gemini.
- `metadata.json` (manifiesto de AI Studio, declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) y `legacy.html` (versión HTML anterior del sitio) no participan del build.

Verificación: `rg` sobre `src/`, `worker/`, `e2e/`, `index.html` y configuraciones no encontró imports ni referencias a esas dependencias, variables ni archivos.

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Quitar deps/variables no usadas, renombrar paquete y reescribir README | Menos superficie de ataque y peso de instalación; documentación fiel al proyecto real. | Requiere confirmar con `rg` y con CI que nada las usa. |
| Además borrar `metadata.json` y `legacy.html` | Repo totalmente limpio. | Borrar archivos está fuera de lo autorizado para los ciclos automáticos; `legacy.html` podría servir de referencia de diseño. |
| Dejar como está | Cero riesgo. | Confusión, dependencias innecesarias y README engañoso. |

## Solución escogida
Primera opción (Ciclo 09, rama `chore/limpieza-ai-studio`):
- `package.json`: `name` → `arland-michelena-digital`; fuera `@google/genai`, `express`, `dotenv`, `motion`, `@types/express` y `tsx`; `clean` → `rm -rf dist`. `package-lock.json` regenerado con `npm install` (≈2 000 líneas menos).
- `.env.example`: se quitan `GEMINI_API_KEY` y `APP_URL`; quedan solo las variables reales (WhatsApp, Turnstile, secrets del Worker).
- `vite.config.ts`: se quita el bloque `server` con `DISABLE_HMR` (HMR y watch quedan con los valores por defecto de Vite).
- `README.md`: reescrito en español con stack, despliegue, scripts y flujo de ramas.
- Se mantienen `esbuild` (fijado a 0.25 para el bundle del Worker/Vite) y `autoprefixer` (sin uso aparente con Tailwind 4; se deja para no ampliar el alcance).

Pruebas: `npm ci`, `npm run lint`, `npm run build`, `npx playwright test` (32/32), bundle del Worker con esbuild y `wrangler deploy --dry-run` OK.

## Qué falta (decisión de Arland)
- `metadata.json`: no se usa en el build ni en Cloudflare. Propuesta: borrarlo.
- `legacy.html`: no se publica (Vite solo empaqueta `index.html`). Propuesta: borrarlo o moverlo a una carpeta de referencia.
- `autoprefixer`: confirmar si se quita en una limpieza futura.
