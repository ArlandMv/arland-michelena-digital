# 002 — Agenda simulada → WhatsApp

- **Issue:** #4, #18 · **Prioridad alta**
- **Estado:** Implementada en `dev` (PR #19); ajustes en PR posterior: [https://github.com/ArlandMv/arland-michelena-digital/pull/19](https://github.com/ArlandMv/arland-michelena-digital/pull/19)

## Problema y evidencia
`ScheduleModal.tsx:31-34` confirma reservas que no existen. Issues: [https://github.com/ArlandMv/arland-michelena-digital/issues/4](https://github.com/ArlandMv/arland-michelena-digital/issues/4), [https://github.com/ArlandMv/arland-michelena-digital/issues/18](https://github.com/ArlandMv/arland-michelena-digital/issues/18).

## Alternativas
| Opción | Pros | Contras |
|---|---|---|
| WhatsApp (`wa.me` con mensaje prellenado) | Contacto inmediato, el visitante escribe desde su propio WhatsApp; sin backend. | Requiere publicar un número; no agenda horarios. |
| Cal.com / Calendly | Agenda real con disponibilidad. | Cuenta externa e integración con calendario; aún no existe. |
| Conectar el modal al endpoint del formulario | Reutiliza 001. | Sigue sin confirmar horario real. |

## Solución escogida
WhatsApp en la tarjeta SESIÓN TÉCNICA, número vía `VITE_WHATSAPP_NUMBER` y fallback al formulario si falta. El código original queda en la rama `archive/schedule-modal` (no borrar) y `ScheduleModal.tsx` se conserva.

## Qué falta
Número público por defecto en `src/config/contact.ts` (56997722404), `VITE_WHATSAPP_NUMBER` como override opcional. Menú móvil apunta a WhatsApp e ícono del header deshabilitado. Agenda real: ver [016](016-agenda-reuniones.md) e issue #24.
