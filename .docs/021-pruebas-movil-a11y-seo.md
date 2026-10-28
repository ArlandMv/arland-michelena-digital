# 021 — Pruebas de móvil, navegación, accesibilidad, consola, recursos y SEO

- **Issues:** #34, #35 · **Prioridad media**
- **Estado:** Implementada (Ciclo 10)

## Problema y evidencia
- La suite Playwright corría solo en escritorio (`Desktop Chrome`); nada verificaba el menú móvil, las anclas del navbar ni el scroll horizontal.
- `e2e/home.spec.ts` tenía una prueba obsoleta del modal de agenda: buscaba un botón con texto "schedule" que ya no existe y, por estar envuelta en `if (isVisible)`, **pasaba sin verificar nada**.
- No había pruebas de accesibilidad automática, consola limpia, peticiones 4xx/5xx ni metadatos SEO.
- Al escribir las pruebas aparecieron dos bugs reales:
  1. `index.html` no tenía `link rel="canonical"`, `og:url` ni `og:image` (relacionado con #10).
  2. El botón del menú móvil no exponía `aria-expanded` / `aria-controls` y su etiqueta decía "Abrir" también con el menú abierto.

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Proyecto móvil `Pixel 7` en `playwright.config.ts` (toda la suite corre dos veces) | Usa Chromium: el CI no instala navegadores extra; cubre todas las pruebas en móvil. | Duplica el tiempo de E2E (~45 s local). |
| Proyecto `iPhone 14` (WebKit) | Más fiel a Safari. | Requiere instalar WebKit en CI (más lento y frágil). |
| Solo pruebas móviles sueltas con `setViewportSize` | Más rápido. | No cumple "la suite pasa en escritorio y móvil". |
| `@axe-core/playwright` | Estándar, reglas WCAG 2.1 A/AA, sin servicios externos. | Una dependencia de desarrollo más. |
| Lighthouse CI en Actions | Puntajes completos. | Lento, ruidoso y con umbrales difíciles de estabilizar. |
| Imagen OG: usar `logo-1536.png` (cuadrada) | Sin archivos nuevos. | Las redes recortan mal una imagen cuadrada en `summary_large_image`. |
| Imagen OG nueva 1200×630 (`public/brand/og-arlandstack.png`) | Tamaño recomendado, paleta del sitio. | Diseño simple generado; puede reemplazarse por el definitivo de #10. |

## Solución escogida
- Proyecto `movil` (Pixel 7, Chromium) junto a `chromium` (escritorio). Las pruebas propias de cada formato se saltan en el otro con `test.skip(({ isMobile }) => …)`.
- `e2e/navegacion.spec.ts` (#34): secciones existentes, sin scroll horizontal, cada link del navbar de escritorio lleva a su sección, CTA del header → `#contacto`, menú móvil abre/cierra (`aria-expanded`), cada link del menú móvil navega y cierra el menú, CTA de WhatsApp visible y clickeable en móvil (menú y contacto). Los links del footer ya los cubre `links-footer.spec.ts` (#15).
- `e2e/home.spec.ts`: la prueba obsoleta se reemplazó por una real que abre y cierra el modal con `#header-profile-icon` y "Cerrar modal".
- `e2e/calidad.spec.ts` (#35): axe sin violaciones `serious`/`critical` (WCAG 2.1 A/AA), consola sin errores ni excepciones, ninguna respuesta ≥ 400 ni petición fallida, SEO (lang `es`, title y description con largo razonable, canonical, `og:title`, `og:url`, `og:image` existente y de tipo imagen), un único `h1` sin saltos de jerarquía, todas las `img` con `alt`. `robots.txt` y `sitemap.xml` siguen cubiertos por `seo-archivos.spec.ts` (#9).
- Bugs corregidos: canonical + `og:url` + `og:image` (1200×630) + `og:locale` en `index.html`; `aria-expanded`, `aria-controls` y etiqueta dinámica en el botón del menú móvil.
- Todo corre en el workflow `ci.yml` existente (`npx playwright test`) sin secretos.

## Resultado (Ciclo 10)
- 95 pruebas pasan y 15 se saltan por diseño (escritorio/móvil) en 2 proyectos.
- Lighthouse móvil sobre el build: rendimiento 89, accesibilidad 100, buenas prácticas 96, SEO 100.

## Qué falta
- #10 sigue abierto para el favicon, el JSON-LD `Person` y, si Arland quiere, una imagen OG diseñada (el PR externo #42 propone `og-image.png`; no se tocó).
- Evaluar WebKit (iPhone) en CI si aparecen bugs propios de Safari.
