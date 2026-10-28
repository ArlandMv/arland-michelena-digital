# 024 — Pruebas en WebKit (Safari) escritorio y iPhone, también en CI

- **Issues relacionados:** #34 (pruebas en móvil) y #35 (calidad: a11y, consola, recursos, SEO); viene de la tabla de próximos ciclos (Ciclo 13).
- **Ciclo:** 13 · 28 oct 2026 · rama `test/webkit-ci`
- **Estado:** Implementada.

## Problema
La suite Playwright solo corría en Chromium (escritorio `Desktop Chrome` y móvil `Pixel 7`). Safari es el navegador por defecto en iPhone y Mac y usa otro motor (WebKit), así que un bug exclusivo de Safari (CSS, `backdrop-filter`, fuentes, eventos táctiles, formularios) podía llegar a producción sin que el CI lo detectara.

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| Proyectos WebKit en Playwright (`Desktop Safari` + `iPhone 14`) en el mismo job | Cero servicios extra; misma suite; reutiliza `npm ci`, build y servidor. | El job tarda más (≈ el doble de pruebas). |
| Job separado de WebKit (matriz) | Paraleliza en runners distintos. | Duplica `npm ci`/build y minutos de Actions; más YAML que mantener. |
| Servicio externo (BrowserStack / Sauce Labs, Safari real) | Safari real en iOS. | Costo, credenciales extra, más lento; excesivo para un portafolio. |
| No probar Safari | Nada que hacer. | Riesgo real en el navegador de los iPhone. |

## Solución escogida
- `playwright.config.ts`: dos proyectos nuevos, `webkit` (`Desktop Safari`) y `movil-webkit` (`iPhone 14`), junto a `chromium` y `movil` (Pixel 7) que se mantienen. Los `test.skip` por `isMobile` de `navegacion.spec.ts` aplican igual en WebKit.
- CI (`.github/workflows/ci.yml`): instala `chromium webkit`; los binarios se cachean en `~/.cache/ms-playwright` con clave por versión de `@playwright/test` (en acierto de caché solo se corre `playwright install-deps`). Para que el tiempo no se duplique, `workers` en CI pasa de 1 a 2; `retries: 2` en CI se mantiene. Reporter `list` + `html` en CI para ver el progreso en el log.
- `e2e/calidad.spec.ts`: WebKit móvil no soporta `page.mouse.wheel` ("Mouse wheel is not supported in mobile WebKit"). En vez de saltar la prueba, se reemplazó por un helper `recorrerPagina` que hace scroll por script (`window.scrollTo`) y funciona en los cuatro proyectos. No era un bug del sitio.

## Skips
No se añadió ningún skip por WebKit. Los únicos skips son los ya existentes por tamaño de pantalla (menú de escritorio vs. menú móvil) en `navegacion.spec.ts`.

## Resultado
Suite local: 228 pruebas, 198 pasan y 30 se saltan por diseño (escritorio/móvil). Por proyecto: `chromium` 48 ✓ / 9 skip, `movil` 51 ✓ / 6 skip, `webkit` 48 ✓ / 9 skip, `movil-webkit` 51 ✓ / 6 skip. Capturas de Safari escritorio e iPhone 14 sin diferencias visibles respecto a Chromium.

## Notas
- En el box de agentes `playwright install --with-deps` falla porque el proxy devuelve 500 para `deb.debian.org`; se instalaron las librerías de WebKit con un mirror alternativo. En GitHub Actions no pasa.
- Pendiente sugerido: Firefox no se agregó (no lo pidió el ciclo y alargaría el CI); se puede sumar si aparece tráfico relevante de Firefox.
