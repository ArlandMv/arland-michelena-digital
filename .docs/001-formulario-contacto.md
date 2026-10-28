# 001 — Formulario de contacto real

- **Issue:** #3 · **Prioridad alta**
- **Estado:** Propuesta

## Problema y evidencia
`src/components/ContactSection.tsx:21-27` simula el envío (`setTimeout` → `success`); `POST /api/contact` responde 405. Los mensajes de clientes se pierden. Issue: [https://github.com/ArlandMv/arland-michelena-digital/issues/3](https://github.com/ArlandMv/arland-michelena-digital/issues/3).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| Cloudflare Function (`/api/contact`) + D1 + correo (Cloudflare Email Sending o Resend) | Todo en la misma plataforma que ya sirve el sitio; datos propios y consultables con SQL; costo ~0; sin dependencias de terceros para guardar. | Requiere escribir el endpoint y el esquema; correo requiere dominio verificado. |
| Airtable vía API | Interfaz visual cómoda para revisar leads. | Otra cuenta y token que proteger; límites de API; datos fuera de Cloudflare. |
| n8n (webhook) | Flujos visuales flexibles. Propuesto en las conversaciones de AI Studio. | Requiere hospedar/pagar n8n; otra pieza que mantener para un caso simple. |
| Netlify Forms | Cero backend. También propuesto en AI Studio. | El sitio no está en Netlify; implicaría migrar el hosting. |

## Solución escogida
Cloudflare Function + D1 + notificación por correo. Es la opción con menos piezas, coherente con el hosting actual y que deja los envíos guardados aunque falle el correo.

## Qué falta
Endpoint con validación servidor; tabla D1 `contact_submissions`; binding y secret del proveedor de correo; fetch real y estado `error` en el frontend; depende de 005 (anti-spam) y 006 (deploy).
