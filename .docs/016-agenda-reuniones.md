# 016 — Agenda de reuniones (Calendly vs Cal.com vs Google Calendar/Meet)

- **Issue:** [#24](https://github.com/ArlandMv/arland-michelena-digital/issues/24) · relacionados [#4](https://github.com/ArlandMv/arland-michelena-digital/issues/4), [#18](https://github.com/ArlandMv/arland-michelena-digital/issues/18) · **Prioridad media**
- **Estado:** Propuesta — decisión de Arland

## Problema y evidencia
`src/components/ScheduleModal.tsx` no es una agenda real:
- Fechas **estáticas**: Lun 8 Sep – Vie 12 Sep 2026 (L19-25), en vez de lunes a viernes de la semana actual.
- Horarios **fijos**: 09:30, 10:30, 11:30, 14:30, 15:30, 16:30 (L28), sin consultar disponibilidad.
- `handleBooking` (L31-34) solo hace `setBooked(true)`: no crea evento ni avisa a Arland.

## Medidas transitorias (implementadas en este PR)
| Punto de entrada | Antes | Ahora |
|---|---|---|
| Tarjeta SESIÓN TÉCNICA (`ContactSection`) | Abría el modal | WhatsApp (PR #19) |
| Ícono de header `#header-profile-icon` | Abría el modal | `disabled`, `aria-disabled`, `cursor-not-allowed`, opacidad 50 %, title "Agenda en desarrollo"; sin `onClick` (comentado, no borrado) |
| Botón "Agendar llamada 30 min" del menú móvil (`Navbar`) | Abría el modal | "Conversemos por WhatsApp" (`wa.me`, pestaña nueva) |
| `HeroSection`, `ProcessSection` | Reciben `onOpenSchedule` pero **no lo usan** | Sin cambios |

`ScheduleModal.tsx` se conserva en el repo y en la rama `archive/schedule-modal`.

## Alternativas
| Criterio | Calendly | Cal.com | Google Calendar API + Meet (directo) |
|---|---|---|---|
| Costo | Gratis limitado; pagos desde ~US$10/mes | Gratis para uso individual; open source | Gratis (cuotas de API) |
| Plan gratuito | 1 tipo de evento, 1 calendario, marca Calendly | Tipos de evento ilimitados, 1 usuario | N/A (solo cuotas) |
| Embed | Inline/popup, maduro | Inline/popup/floating (`@calcom/embed-react`) | UI propia (reutiliza diseño del modal) |
| Control de marca | Bajo en plan gratis (logo Calendly) | Medio-alto (colores, tema oscuro) | Total |
| Privacidad | Datos en Calendly (EE.UU.) | Datos en Cal.com o self-host | Solo Google y el Worker propio |
| Mantenimiento | Nulo | Nulo (cloud) | Alto: OAuth, refresh token, errores, cuotas |
| Zona horaria America/Santiago | Sí, detecta zona del visitante | Sí, detecta zona del visitante | Manual (`timeZone` en freebusy/evento; cuidado con cambio de horario) |
| Esfuerzo inicial | ~1 h | ~1-2 h | ~2-4 días (Worker + UI + tests) |
| Credenciales | Cuenta Calendly | Cuenta Cal.com conectada a Google Calendar | Proyecto GCP, OAuth client, refresh token como secret del Worker (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) |
| Flujo | Página/embedding de Calendly | Embed de Cal.com; crea evento con Meet | `freebusy.query` (L–V semana actual) → slots libres → `events.insert` con `conferenceData.createRequest` (Meet) + `sendUpdates=all` |

## Solución recomendada
1. **Paso 1 — Cal.com embed** (gratis, tema oscuro con la paleta #0D0D0F / #7A2E84 / #B66A43), conectado a Google Calendar de Arland con Meet automático, evento de 30 min L–V. Reemplaza el contenido del modal; reactiva `#header-profile-icon`.
2. **Evolución — Google Calendar API directa** desde el Worker (`/api/availability`, `/api/book`) si se quiere control total de marca y datos, reutilizando la UI de `ScheduleModal` con fechas dinámicas.

Calendly se descarta: el plan gratuito impone marca y limita a un tipo de evento sin ventajas sobre Cal.com.

## Qué falta
- Decisión de Arland (Cal.com vs. directo).
- Si Cal.com: crear cuenta, conectar Google Calendar, compartir el link del evento (público, no secreto).
- Si directo: proyecto GCP y OAuth; cargar secrets en Cloudflare (nunca en el repo).
