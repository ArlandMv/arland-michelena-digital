# 018 · Etiquetas de sección y textos en inglés innecesario

**Issue:** [#32](https://github.com/ArlandMv/arland-michelena-digital/issues/32) · **Estado:** Implementada (PR hacia `dev`, Ciclo 03, 28-10-2026)

## Problema
El sitio está en español, pero las etiquetas numeradas de cada sección (`01 / WHAT I BUILD`, `02 / SELECTED WORK`, `03 / CAPABILITIES`, `04 / PROCESS`, `05 / ABOUT`, `06 / CONTACT`) y el cargo (`Full-Stack & AI Engineer`, en `<title>`, `og:title`, navbar, footer y tarjeta de contacto) estaban en inglés. Arland prefiere los textos en español y mantener solo los términos técnicos (React, Agentforce, fullstack).

## Alternativas evaluadas
1. **Traducir los textos directamente en los componentes** (escogida): el sitio es monolingüe; el cambio es mínimo y no agrega dependencias.
2. **Sistema i18n (react-i18next) con ES/EN:** útil si en el futuro se quiere versión en inglés, pero hoy sería sobreingeniería.
3. **Dejar el inglés como estilo "tech":** descartada por la preferencia explícita de Arland.

## Solución
- Etiquetas: `QUÉ CONSTRUYO`, `PROYECTOS DESTACADOS`, `CAPACIDADES`, `PROCESO`, `SOBRE MÍ`, `CONTACTO`.
- Cargo: `Ingeniero Full-Stack e IA` (título, `og:title`, navbar, footer); tarjeta de contacto `Ingeniero de Software · Full-Stack e IA`; trayectoria `Ingeniero Full-Stack`.
- Servicios: `Despliegue e infraestructura`, `Desarrollo de producto`, `IA y automatización`. Capacidades: `Datos y persistencia`, `IA y automatización`, `Infraestructura`, `Integraciones y APIs` (`Frontend` y `Backend` se mantienen). Proceso: `ENTENDER`, `DISEÑAR`, `CONSTRUIR`, `ENTREGAR E ITERAR`. Insignia del hero: `FULL-STACK · IA · AUTOMATIZACIÓN · INFRAESTRUCTURA`. Se mantienen nombres oficiales como `Agentforce Specialist` y `Salesforce Certified`.
- Categorías de proyectos: `DESPLIEGUE / INFRAESTRUCTURA`, `WEB / SEO TÉCNICO`, `IA / SISTEMAS INTERNOS`.
- Diagrama de proyectos: `FLUJO DE INTEGRACIÓN`, `Portal de usuarios`, `Motor de tickets`, `Controlador de ruteo`, `Agente IA en Python`. Se mantienen términos técnicos (`REST API`, `Payload`, `ASYNC_QUEUE`, `Classifier / RAG`, `PostgreSQL`, `pgvector`).
- Prueba `e2e/etiquetas.spec.ts`: verifica las seis etiquetas y que no queden las versiones en inglés.

## Pendiente
- Si se decide una versión en inglés, evaluar i18n (alternativa 2).
