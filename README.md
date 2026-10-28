# arland-michelena-digital

Portafolio de Arland Michelena publicado en **https://arlandstack.com**.

- Frontend: React 19 + Vite 6 + Tailwind CSS 4.
- Despliegue: Cloudflare Workers Builds desde la rama `main` (configuración en `wrangler.jsonc`).
- Worker (`worker/index.ts`): endpoint `POST /api/contact`, que guarda los leads del formulario en Airtable con verificación Cloudflare Turnstile. El resto del sitio se sirve como assets estáticos desde `dist/`.
- Decisiones técnicas y hallazgos: carpeta [`.docs`](.docs/README.md).

## Desarrollo local

**Requisitos:** Node.js 20 o superior.

1. Instalar dependencias: `npm install`
2. (Opcional) Copiar `.env.example` a `.env.local` y completar las variables públicas `VITE_*`. Los secrets del Worker van en `.dev.vars` (ignorado por git), nunca en el repositorio.
3. Levantar el sitio: `npm run dev` (http://localhost:3000)

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite en el puerto 3000 |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | Chequeo de tipos con TypeScript (`tsc --noEmit`) |
| `npm run test:e2e` | Suite Playwright (`e2e/`), incluye pruebas del endpoint `/api/contact` |

## Flujo de ramas

Los cambios entran por ramas cortas hacia `dev`; `dev` se publica en `main` con un PR `release: ...`. El CI (lint, build y E2E) y el check de Workers Builds deben pasar antes de cada merge. Ver [.docs/005-ci-ramas.md](.docs/005-ci-ramas.md).
