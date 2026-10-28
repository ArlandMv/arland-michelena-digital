import React, { useMemo, useState } from 'react';
import { X, Clock, CheckCircle, Video } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config/contact';

// Próximos 5 días hábiles (L–V) a partir de mañana, en hora de Santiago.
// Antes las fechas eran fijas (8–12 sep 2026) y la "reserva" era simulada (#4).
export function nextBusinessDays(from: Date = new Date(), count = 5) {
  const fmtValue = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' });
  const fmtLabel = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', weekday: 'short', day: 'numeric', month: 'short' });
  const fmtDow = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', weekday: 'short' });
  const out: { label: string; value: string }[] = [];
  const d = new Date(from.getTime());
  while (out.length < count) {
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    const dow = fmtDow.format(d);
    if (dow === 'Sat' || dow === 'Sun') continue;
    const label = fmtLabel.format(d).replace(/\./g, '');
    out.push({ label: label.charAt(0).toUpperCase() + label.slice(1), value: fmtValue.format(d) });
  }
  return out;
}

export function buildScheduleWhatsAppUrl(p: { name: string; email: string; date: string; time: string; topic: string }) {
  const text = `Hola Arland, vi tu portafolio en arlandstack.com y me gustaría agendar una llamada técnica de 30 min.\n` +
    `Nombre: ${p.name}\nEmail: ${p.email}\nFecha propuesta: ${p.date}\nHora propuesta: ${p.time} (hora de Santiago)\nObjetivo: ${p.topic}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const dates = useMemo(() => nextBusinessDays(), [isOpen]);
  const [selectedDate, setSelectedDate] = useState(() => nextBusinessDays()[0].value);
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Evaluación de arquitectura e integración de IA');
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '09:30', '10:30', '11:30', '14:30', '15:30', '16:30'
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // No hay agenda real: se abre WhatsApp con la propuesta y Arland confirma manualmente.
    const dateLabel = dates.find((d) => d.value === selectedDate)?.label ?? selectedDate;
    window.open(
      buildScheduleWhatsAppUrl({ name, email, date: `${dateLabel} (${selectedDate})`, time: selectedTime, topic }),
      '_blank',
      'noopener,noreferrer',
    );
    setBooked(true);
  };

  return (
    <div
      id="schedule-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="schedule-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Agendar llamada técnica"
        className="bg-[#141418] border border-[#292930] rounded-[10px] w-full max-w-lg p-6 sm:p-8 shadow-2xl text-[#F4F1ED] relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#A8A6AD] hover:text-[#F4F1ED] p-1 rounded hover:bg-[#1B1B21] transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="py-8 flex flex-col items-center text-center gap-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#7A2E84]/20 border border-[#7A2E84] flex items-center justify-center text-[#B67ABA]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-['IBM_Plex_Sans'] text-2xl font-medium">
              Solicitud lista en WhatsApp
            </h3>
            <p className="font-['IBM_Plex_Sans'] text-sm text-[#A8A6AD] max-w-sm">
              Envía el mensaje en WhatsApp para proponer el {selectedDate} a las {selectedTime} (hora de Santiago). Te confirmaré el horario y te enviaré el enlace de Google Meet a <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setBooked(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-[#7A2E84] hover:bg-[#67276B] text-sm font-semibold rounded-[6px] transition-colors cursor-pointer"
            >
              Listo
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 border-b border-[#292930] pb-4">
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#D38A5F] uppercase tracking-wider font-semibold">
                SESIÓN DE DESCUBRIMIENTO TÉCNICO
              </span>
              <h3 className="font-['IBM_Plex_Sans'] text-xl sm:text-2xl font-medium text-[#F4F1ED]">
                Llamada técnica de 30 minutos
              </h3>
              <p className="font-['IBM_Plex_Sans'] text-[12px] text-[#A8A6AD]">
                Propón un horario y lo confirmo por WhatsApp; aún no hay reserva automática.
              </p>
              <div className="flex items-center gap-4 text-[12px] text-[#A8A6AD] mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D38A5F]" />
                  30 min
                </span>
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-[#D38A5F]" />
                  Google Meet
                </span>
                <span className="font-['IBM_Plex_Mono'] text-[11px]">
                  UTC-3 (Santiago)
                </span>
              </div>
            </div>

            <form id="schedule-form" onSubmit={handleBooking} className="flex flex-col gap-4">
              {/* Date Selection */}
              <div className="flex flex-col gap-2">
                <label className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider">
                  1. Elige una fecha preferida
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`px-3 py-2 text-xs rounded border text-left font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                        selectedDate === d.value
                          ? 'bg-[#7A2E84] border-[#B67ABA] text-[#F4F1ED]'
                          : 'bg-[#1B1B21] border-[#292930] text-[#d3c1cf] hover:border-[#7A2E84]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex flex-col gap-2">
                <label className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider">
                  2. Horario preferido (hora de Santiago)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-1.5 text-xs text-center rounded border font-['IBM_Plex_Mono'] transition-colors cursor-pointer ${
                        selectedTime === time
                          ? 'bg-[#B66A43] border-[#E7AD89] text-[#0D0D0F] font-bold'
                          : 'bg-[#1B1B21] border-[#292930] text-[#F4F1ED] hover:border-[#B66A43]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* User details */}
              <div className="flex flex-col gap-3 pt-2 border-t border-[#292930]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase">
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Mateo Larraín"
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded px-3 py-2 text-sm text-[#F4F1ED] focus:outline-none focus:border-[#7A2E84]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mateo@empresa.com"
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded px-3 py-2 text-sm text-[#F4F1ED] focus:outline-none focus:border-[#7A2E84]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase">
                    Objetivo principal de la llamada
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#0D0D0F] border border-[#292930] rounded px-3 py-2 text-sm text-[#F4F1ED] focus:outline-none focus:border-[#7A2E84]"
                  />
                </div>
              </div>

              <button
                id="schedule-submit-button"
                type="submit"
                className="mt-2 w-full py-3 bg-[#7A2E84] hover:bg-[#67276B] text-[#F4F1ED] font-semibold text-sm rounded-[6px] transition-all cursor-pointer shadow-md"
              >
                Proponer horario por WhatsApp ({selectedTime} hrs)
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
