# 014 — Restos de AI Studio

- **Issue:** #16 · **Prioridad baja**
- **Estado:** Propuesta

## Problema y evidencia
`GEMINI_API_KEY`/`APP_URL` en `.env.example`, deps `@google/genai`/`express`/`dotenv`, `metadata.json`, nombre `react-example`. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/16](https://github.com/ArlandMv/arland-michelena-digital/issues/16).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Quitar deps no usadas y renombrar | Menos superficie y peso de instalación. | Confirmar que nada las usa. |
| Dejar como está | Cero riesgo. | Confusión y dependencias innecesarias. |

## Solución escogida
Quitar dependencias y variables no usadas; archivos (`metadata.json`, `legacy.html`) solo con acuerdo de Arland.

## Qué falta
—
