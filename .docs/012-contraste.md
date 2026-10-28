# 012 — Contraste de #B66A43 en texto pequeño

- **Issue:** [#14](https://github.com/ArlandMv/arland-michelena-digital/issues/14) · **Prioridad media**
- **Estado:** Implementado en rama `fix/footer-links-contraste` (Ciclo 05, 28 oct 2026)

## Problema y evidencia
Lighthouse Accesibilidad daba 95: la auditoría `color-contrast` fallaba en spans `text-[#B66A43]` de 10-12 px (IBM Plex Mono / JetBrains Mono) y en badges `bg-[#70402D]/30`. Todos los fondos donde se usa este texto son **oscuros**, por lo que la corrección es **aclarar** el tono (oscurecerlo empeoraría el contraste).

Ratios WCAG 2.x de `#B66A43` (texto normal requiere ≥ 4.5:1):

| Fondo | #B66A43 (antes) | #D38A5F (ahora) |
|---|---|---|
| `#0D0D0F` (fondo de sección) | 4.74 | **7.00** |
| `#141418` (tarjetas) | 4.49 ✗ | **6.62** |
| `#1B1B21` (badges, paneles) | 4.19 ✗ | **6.18** |
| `#70402D` al 30 % sobre `#141418` (≈ `#30211E`, badge "En producción") | 3.77 ✗ | **5.56** |
| `#67276B` al 40 % sobre `#0D0D0F` (≈ `#311734`) | 3.94 ✗ | **5.81** |
| `#292930` (hover de botón móvil) | 3.53 ✗ | **5.21** |

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Aclarar a `#D08A62` (propuesta del issue) | Ratios ≥ 5.5:1 | Un tono nuevo más en la paleta |
| **Usar `#D38A5F` para texto** | Ya existía en la paleta (hover de botones); ratios ≥ 5.2:1 en todos los fondos | Ligeramente más claro que el cobre de marca |
| Aumentar tamaño/peso | No toca color | Cambia el ritmo tipográfico; con 4.19:1 tampoco alcanza para "texto grande" en 11-12 px |
| Oscurecer el tono | — | Empeora el contraste: los fondos son oscuros |

## Solución escogida
Todas las clases `text-[#B66A43]` (29 ocurrencias en 6 componentes) pasan a `text-[#D38A5F]`. `#B66A43` se mantiene como color de identidad en bordes, puntos, fondos y `hover:border`, donde WCAG exige 3:1 para elementos no textuales (se cumple sobre todos los fondos oscuros). El botón seleccionado del modal (`bg-[#B66A43]` con texto `#0D0D0F`) ya cumplía: 4.74:1.

Verificación:
- `e2e/links-footer.spec.ts` comprueba que ningún nodo con texto visible use `rgb(182, 106, 67)`.
- Lighthouse 12 (build de producción, `vite preview`): **Accesibilidad 100**, `color-contrast` sin fallos.

## Qué falta
—
