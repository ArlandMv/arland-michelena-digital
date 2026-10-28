# 019 — ScheduleModal ya no simula reservas

- **Issue:** [#4](https://github.com/ArlandMv/arland-michelena-digital/issues/4) · relacionados [#18](https://github.com/ArlandMv/arland-michelena-digital/issues/18), [#24](https://github.com/ArlandMv/arland-michelena-digital/issues/24) · **Prioridad alta**
- **Estado:** Implementado en rama `fix/schedule-modal-whatsapp` (Ciclo 04, 28 oct 2026)

## Problema
`ScheduleModal.tsx` mostraba fechas fijas (8–12 sep 2026), horarios fijos y, al enviar, decía "Sesión agendada con éxito" y que se había enviado una invitación de Google Meet, sin crear nada ni avisar a Arland. El ícono del header estaba deshabilitado como medida transitoria (ver [016](016-agenda-reuniones.md)).

## Alternativas evaluadas
| Opción | Pros | Contras |
|---|---|---|
| Dejar el modal oculto | Cero riesgo | El ícono del header queda muerto; no resuelve el código engañoso |
| Cal.com / Google Calendar API | Agenda real | Requiere decisión y cuentas de Arland (#24) |
| **Modal honesto que propone el horario por WhatsApp** | Sin backend ni credenciales; usa el canal preferido de Arland; datos reales (fechas dinámicas) | No reserva automáticamente; Arland confirma a mano |

## Solución escogida
- Fechas dinámicas: próximos 5 días hábiles (L–V) desde mañana, calculados en `America/Santiago` (`nextBusinessDays`).
- Al enviar se abre `wa.me` en pestaña nueva con un mensaje prellenado (nombre, email, fecha, hora y objetivo) vía `buildScheduleWhatsAppUrl`.
- Textos honestos: "Elige una fecha preferida", "Proponer horario por WhatsApp", aviso "aún no hay reserva automática" y confirmación "Solicitud lista en WhatsApp".
- Ícono `#header-profile-icon` reactivado para abrir el modal; `role="dialog"` y `aria-modal`.
- Pruebas: `e2e/schedule-modal.spec.ts` y `e2e/whatsapp-cta.spec.ts` actualizado.

## Qué falta
Agenda real con disponibilidad (Cal.com o Google Calendar API): decisión de Arland en [#24](https://github.com/ArlandMv/arland-michelena-digital/issues/24).
