# 027 · Favicon, apple-touch-icon, manifest y JSON-LD

- **Issue:** [#10](https://github.com/ArlandMv/arland-michelena-digital/issues/10) (resto: canonical, og:url y og:image ya se resolvieron en el Ciclo 10, ver [021](021-pruebas-movil-a11y-seo.md) y [008](008-seo-og.md))
- **Ciclo:** 16 (28-10-2026)
- **Prioridad:** media · **Tipo:** SEO / redes
- **Estado:** Implementado, probado y mergeado a `main` (release #70, `aacd780`). **Deploy a producción pendiente**: Workers Builds no inicializó el build de `main` (ver "Incidente de deploy").

## Problema
- El sitio no declaraba favicon: los navegadores pedían `/favicon.ico` y, por el `not_found_handling: single-page-application` del Worker, recibían **200 con el HTML de la SPA** (ícono genérico en pestañas, marcadores y resultados de Google).
- Sin `apple-touch-icon` (iOS generaba una captura de la página al "Añadir a inicio") ni `site.webmanifest` / `theme-color`.
- Sin datos estructurados: Google no podía asociar el sitio con la persona (Arland E. Michelena Villegas) ni con sus perfiles de GitHub y LinkedIn.

## Alternativas evaluadas
1. **Solo `favicon.ico` en la raíz.** Mínimo, pero borroso en pantallas de alta densidad y sin ícono para iOS/Android.
2. **RealFaviconGenerator (servicio externo).** Buen resultado, pero agrega pasos manuales fuera del repo y muchos archivos que no hacen falta.
3. **Favicon SVG vectorial dibujado a mano + respaldos PNG/ICO generados desde `public/brand/logo-mark-640.webp` (Pillow).** ✅ Elegida: el SVG (846 B) se ve nítido a 16 px porque simplifica la gema (hexágono cobrizo sobre violeta); los PNG conservan el render detallado del logo para tamaños grandes (apple-touch, manifest). Todo queda versionado.
4. **SVG con el raster incrustado en base64.** Descartado: pesa decenas de KB y a 16 px se ve peor que el vector simplificado.

Para el JSON-LD:
1. **Inyectarlo desde React (`useEffect`).** Descartado: Google lo lee, pero otros consumidores sin JS no; además agrega JS.
2. **`<script type="application/ld+json">` estático en `index.html` con `@graph` (Person + WebSite).** ✅ Elegido.

### CSP
`script-src 'self' …` no incluye `'unsafe-inline'` ni hashes/nonce. Un bloque `application/ld+json` **no es un script ejecutable** (tipo de datos), así que la CSP no lo bloquea ni genera violaciones; no hubo que tocarla. `manifest-src` cae en `default-src 'self'` (el manifest es del mismo origen). La prueba `el favicon se carga sin violar la CSP` vigila la consola.

## Solución implementada
- `public/favicon.svg` (vector, 64×64 con fondo `#0D0D0F` redondeado).
- `public/favicon.ico` (16/32/48), `public/favicon-32.png`, `public/apple-touch-icon.png` (180×180 opaco, sin esquinas: iOS las redondea), `public/icon-192.png`, `public/icon-512.png` (cuantizados a 256 colores: 10 KB y 43 KB).
- `public/site.webmanifest` en español con `theme_color`/`background_color` `#0D0D0F`, `display: browser` (no es una PWA).
- `index.html`: `<link rel="icon">` (ico → svg → png; los navegadores modernos eligen el SVG), `apple-touch-icon`, `manifest`, `<meta name="theme-color">` y JSON-LD `@graph` con:
  - `Person`: `name` "Arland E. Michelena Villegas", `alternateName`, `jobTitle` "Desarrollador fullstack y Agentforce", `url`, `image` (og), `knowsLanguage`, `sameAs` GitHub y LinkedIn.
  - `WebSite`: `name`, `url`, `inLanguage: es`, `author`/`publisher` → la Person por `@id`.
- `public/_headers`: `Cache-Control` de 1 día + `stale-while-revalidate` para los íconos (nombres sin hash, igual que `/brand/*`).

## Pruebas
`e2e/favicon-jsonld.spec.ts` (en los 4 proyectos: Chromium, Pixel 7, Safari, iPhone 14):
- cada ícono responde 200 con su `content-type` y no es el HTML de la SPA;
- el HTML declara favicon, apple-touch-icon, manifest y theme-color; el manifest se parsea;
- el JSON-LD se parsea y tiene `Person` con nombre, jobTitle, `sameAs` y `WebSite`;
- sin mensajes de CSP en consola.

## Pendiente / ideas
- Validar en [Rich Results Test](https://search.google.com/test/rich-results) y en Search Console tras la indexación (manual, requiere la cuenta de Arland).
- Si en el futuro hay un logo SVG oficial (ver `public/logos/README.md`), reemplazar `favicon.svg` por esa versión.

## Incidente de deploy (Ciclo 16, 28-10-2026)
- PR a dev #69 y release #70 mergeados con CI verde (lint, build, E2E en 4 proyectos y Workers Build de la preview).
- La preview de la rama (`seo-favicon-jsonld-…workers.dev`) sirvió los íconos y el manifest con 200 y `content-type` correcto; Lighthouse móvil: rendimiento 99, accesibilidad 100, buenas prácticas 100 (SEO 69 solo por el `noindex` de workers.dev).
- El build de producción de `main` (`aacd780`, 08:53 hora de Chile) terminó en **`terminated`**: *"Build initialization failed: unable to verify Worker · Build failed to initialize and was timed out"*. Un reintento manual del mismo trigger (08:59) falló igual. Cloudflare reportaba en ese momento "Network Performance Issues in Ashburn, IAD".
- Producción siguió sirviendo `f21095f` (Ciclo 15) sin caída; el smoke de Actions falló como corresponde ("producción sigue sirviendo f21095f").

### Posibles soluciones
1. Reintentar el build de `main` desde el dashboard (Workers → arland-michelena-digital → Deployments/Builds → *Retry*) o con la API de Workers Builds cuando Cloudflare normalice; luego re-ejecutar el workflow smoke.
2. Si persiste "unable to verify Worker": revisar en el dashboard que la conexión con GitHub y el *build token* sigan válidos (los builds de ramas sí funcionaron, así que es poco probable).
3. Último recurso (decisión de Arland): `npx wrangler deploy` manual desde `main` con `WORKERS_CI_COMMIT_SHA=aacd780…` para que el meta `build-commit` coincida.
