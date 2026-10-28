# 009 — Logo alojado en googleusercontent

- **Issue:** #11 · **Prioridad alta**
- **Estado:** Resuelto en rama `fix/logo-local-assets` (PR hacia `dev`), 28 oct 2026

## Problema y evidencia
`src/data/portfolioData.ts:12-13` apuntaba a `lh3.googleusercontent.com` (URLs temporales generadas por AI Studio).
- `logoUrl` (navbar) respondía **403** el 28 oct 2026 01:40: el logo no se veía en producción y quedaba sólo la "A" de respaldo.
- `facetedMarkUrl` (hero) respondía 200, pero era también una URL temporal y la imagen era una captura de un *mockup* de sitio (512×279), no la gema.
Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/11](https://github.com/ArlandMv/arland-michelena-digital/issues/11).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Descargar las URLs de Google y servirlas locales tal cual | Mínimo cambio visual. | El logo ya no se puede descargar (403); la imagen del hero es un mockup, no la marca. |
| Usar `public/logos/logo-400.webp` tal cual | Inmediato. | Es 3:2 con fondo blanco con trama: en un cuadro de 32 px sobre fondo oscuro se ve como un parche claro. |
| Recorte cuadrado de la gema desde `logo-1536.png`, fondo claro convertido a transparencia, en WebP a varios tamaños | Se ve bien sobre fondo oscuro, liviano, sin terceros, con `srcset` para pantallas retina. | Es un recorte automático; un SVG vectorial sigue siendo lo ideal (ver `public/logos/README.md`). |
| Cloudflare Images | Variantes automáticas. | Costo y configuración para un solo logo. |

## Solución escogida
Recorte cuadrado de la gema, con el halo blanco/gris pasado a transparencia, en `public/brand/`:
| Archivo | Uso | Peso |
|---|---|---|
| `logo-mark-64.webp` / `logo-mark-128.webp` | Navbar (1x / 2x) | 4 KB / 11 KB |
| `logo-mark-320.webp` / `logo-mark-640.webp` | Gema del hero (`srcset` 320w/640w) | 32 KB / 101 KB |

- `portfolioData.ts` apunta a `/brand/...`; `Navbar.tsx` y `HeroSection.tsx` declaran `width`/`height` (evita saltos de layout) y `srcset`. La gema del hero usa `fetchPriority="high"` porque está sobre el pliegue.
- Test E2E `e2e/logo.spec.ts`: ambos `<img>` cargan y no se hace ninguna petición a `googleusercontent.com`.
- No se borró ningún archivo: `public/logos/` queda igual (su peso se trata en el issue #13).

## Qué falta
- Opcional: versión SVG vectorial del logo y favicons a partir de ella (issues #10 y #13, y `public/logos/README.md`).
