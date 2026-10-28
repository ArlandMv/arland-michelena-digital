# 011 — logo-1536.png de 1,9 MB

- **Issue:** #13 · **Prioridad baja**
- **Estado:** Implementada (Ciclo 06)

## Problema y evidencia
`public/logos/logo-1536.png` (1.984.825 bytes, 1536×1024 RGBA) se copiaba tal cual a `dist` y quedaba publicado en `https://arlandstack.com/logos/logo-1536.png`. No lo referencia ningún componente (la UI usa `/brand/logo-mark-*.webp` desde el Ciclo 01, #11), pero sumaba peso al repo, al build y a cualquier descarga directa. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/13](https://github.com/ArlandMv/arland-michelena-digital/issues/13).

## Alternativas
| Opción | Resultado | Pros | Contras |
|---|---|---|---|
| WebP con pérdida (q85, alfa) | 345.872 B | Formato moderno. | Cambia la extensión: rompe cualquier enlace externo a `.png`. |
| PNG cuantizado con Pillow FASTOCTREE | 144.977 B | Muy liviano. | Bandas visibles en el brillo del fondo. |
| **PNG cuantizado con libimagequant (256 colores, dithering, calidad 70–95)** | **489.775 B (−75 %)** | Mismo nombre, tamaño y canal alfa; visualmente equivalente. | Sigue siendo más pesado que un WebP. |
| Mover el archivo fuera de `public/` | 0 B publicados | Nada pesado en producción. | Equivale a borrarlo de la ruta pública (regla: no borrar archivos). |

## Solución escogida
Reemplazar el archivo en el mismo lugar por la versión cuantizada con libimagequant: misma ruta, mismas dimensiones (1536×1024) y transparencia, 1,9 MB → 478 KB. El original queda en el historial de git (commit anterior a este cambio) por si se necesita el máster sin pérdida. Un test E2E (`e2e/seo-archivos.spec.ts`) falla si vuelve a superar 600 KB.

## Qué falta
- Opcional: si Arland obtiene un logo vectorial (SVG), reemplazar también este PNG.
