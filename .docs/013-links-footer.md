# 013 — Links genéricos en el footer

- **Issue:** [#15](https://github.com/ArlandMv/arland-michelena-digital/issues/15) · **Prioridad media**
- **Estado:** Implementado en rama `fix/footer-links-contraste` (Ciclo 05, 28 oct 2026)

## Problema y evidencia
`Footer.tsx:36,44` apuntaban a `https://linkedin.com` y `https://github.com`, no a los perfiles de Arland. Revisado el resto del sitio: no hay otros links genéricos a redes (los demás externos son `wa.me` y `arlandstack.com`).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Corregir las URLs en línea en `Footer.tsx` | Cambio mínimo | Datos duplicados si otro componente los necesita |
| **URLs reales centralizadas en `portfolioData.ts`** | Un solo lugar; el footer las recorre con `map` | — |

## Solución escogida
- `SOCIAL_LINKS` en `src/data/portfolioData.ts`: LinkedIn `https://www.linkedin.com/in/arland-michelena`, GitHub `https://github.com/ArlandMv`.
- El footer los renderiza con `target="_blank"`, `rel="noopener noreferrer"` y `aria-label` en español que avisa que se abre en pestaña nueva. El hover usa `#D38A5F` (ver [012](012-contraste.md)).
- Prueba `e2e/links-footer.spec.ts`: valida los `href`, que no exista ningún link a la raíz de LinkedIn/GitHub/X/Instagram y que **todo** link externo del sitio abra en pestaña nueva con `rel="noopener"`.

## Qué falta
—
