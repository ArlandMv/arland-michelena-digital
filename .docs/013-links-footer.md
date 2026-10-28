# 013 — Links genéricos en el footer

- **Issue:** #15 · **Prioridad media**
- **Estado:** Propuesta

## Problema y evidencia
`Footer.tsx:36,44` apuntan a `linkedin.com` y `github.com`. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/15](https://github.com/ArlandMv/arland-michelena-digital/issues/15).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| URLs reales centralizadas en `portfolioData.ts` | Un solo lugar. | — |

## Solución escogida
Centralizar y agregar test E2E de links.

## Qué falta
URL de LinkedIn de Arland.
