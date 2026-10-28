import React, { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle, Send, Copy, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { ContactFormData } from '../types';
import { WHATSAPP_URL } from '../config/contact';

interface ContactSectionProps {
  onOpenSchedule: () => void;
}

// Site key pública de Cloudflare Turnstile (no es secreta). Ver .env.example y .docs/003-anti-spam.md.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  validation: 'Revisa los campos: nombre, email válido y un mensaje de al menos 10 caracteres.',
  turnstile: 'No pudimos verificar que no eres un bot. Recarga la página e inténtalo de nuevo.',
  rate_limited: 'Demasiados envíos seguidos. Espera unos minutos e inténtalo de nuevo.',
};
const DEFAULT_ERROR = 'No se pudo enviar tu mensaje. Inténtalo de nuevo o escríbeme por WhatsApp o email.';

// onOpenSchedule se mantiene en la interfaz para retomar ScheduleModal (ver rama archive/schedule-modal, issue #18).
export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    organization: '',
    projectStage: 'idea',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || document.getElementById('cf-turnstile-script')) return;
    const script = document.createElement('script');
    script.id = 'cf-turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          website: form.get('website') ?? '',
          turnstileToken: form.get('cf-turnstile-response') ?? '',
        }),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !out.ok) throw new Error(out.error || 'unknown');
      setStatus('success');
    } catch (err) {
      setErrorMessage(ERROR_MESSAGES[(err as Error).message] ?? DEFAULT_ERROR);
      setStatus('error');
      window.turnstile?.reset();
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('arlandmichelenav@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contacto"
      className="w-full bg-[#0D0D0F] text-[#F4F1ED] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#D38A5F] tracking-wider font-semibold uppercase">
            06 / CONTACTO
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[36px] text-[#F4F1ED] tracking-tight font-medium">
            ¿Tienes un sistema que necesitas construir, integrar o desplegar?
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD]">
            Cuéntame brevemente qué necesitas y podemos revisar si existe un buen encaje técnico.
          </p>
        </div>

        {/* 2-Column Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Project Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#141418] border border-[#292930] rounded-[8px] p-6 lg:p-8 shadow-xl">
            {status === 'success' ? (
              <div
                id="form-success-message"
                className="py-12 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#7A2E84]/20 border border-[#7A2E84] flex items-center justify-center text-[#B67ABA]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-['IBM_Plex_Sans'] text-2xl font-semibold text-[#F4F1ED]">
                  Mensaje recibido
                </h3>
                <p className="font-['IBM_Plex_Sans'] text-[15px] text-[#A8A6AD] max-w-md">
                  Gracias por tu contacto, {formData.name}. He recibido los detalles de tu proyecto y te responderé a <strong>{formData.email}</strong> en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFormData({
                      name: '',
                      email: '',
                      organization: '',
                      projectStage: 'idea',
                      message: ''
                    });
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#1B1B21] border border-[#292930] hover:border-[#B66A43] text-sm text-[#F4F1ED] rounded-[6px] transition-colors cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="relative flex flex-col gap-5"
                aria-busy={status === 'submitting'}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider font-medium"
                    >
                      Nombre <span className="text-[#D38A5F]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded-[6px] px-3.5 py-2.5 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] placeholder-[#4f4e54] focus:outline-none focus:border-[#7A2E84] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider font-medium"
                    >
                      Email <span className="text-[#D38A5F]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@empresa.com"
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded-[6px] px-3.5 py-2.5 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] placeholder-[#4f4e54] focus:outline-none focus:border-[#7A2E84] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-organization"
                      className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider font-medium"
                    >
                      Empresa / Organización
                    </label>
                    <input
                      id="contact-organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Nombre de la empresa"
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded-[6px] px-3.5 py-2.5 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] placeholder-[#4f4e54] focus:outline-none focus:border-[#7A2E84] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-stage"
                      className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider font-medium"
                    >
                      Estado del proyecto
                    </label>
                    <select
                      id="contact-stage"
                      value={formData.projectStage}
                      onChange={(e) => setFormData({ ...formData, projectStage: e.target.value })}
                      className="w-full bg-[#0D0D0F] border border-[#292930] rounded-[6px] px-3.5 py-2.5 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] focus:outline-none focus:border-[#7A2E84] transition-colors"
                    >
                      <option value="idea">Idea inicial / Definición</option>
                      <option value="desarrollo">En desarrollo activo</option>
                      <option value="produccion">En producción (requiere mejoras)</option>
                      <option value="migracion">Migración / Refactorización</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] uppercase tracking-wider font-medium"
                  >
                    ¿Qué necesitas? <span className="text-[#D38A5F]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe el sistema, restricciones técnicas, tecnologías o alcance preliminar..."
                    className="w-full bg-[#0D0D0F] border border-[#292930] rounded-[6px] px-3.5 py-2.5 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] placeholder-[#4f4e54] focus:outline-none focus:border-[#7A2E84] resize-none transition-colors"
                  />
                </div>

                {/* Honeypot anti-spam: oculto para personas, los bots suelen llenarlo. */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label htmlFor="contact-website">No llenar este campo</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {TURNSTILE_SITE_KEY && (
                  <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" data-language="es" />
                )}

                {status === 'error' && (
                  <div
                    id="form-error-message"
                    role="alert"
                    className="flex items-start gap-2 p-3 rounded-[6px] border border-[#B66A43] bg-[#70402D]/20 text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px]"
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-[#D08A62] shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  id="contact-submit-button"
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7A2E84] text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold text-[15px] rounded-[6px] border border-[#292930] hover:border-[#B66A43] hover:bg-[#67276B] transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar proyecto</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Scheduling Alternative (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card 1: Direct Session */}
            <div className="bg-[#141418] border border-[#292930] rounded-[8px] p-6 lg:p-8 flex flex-col gap-4 shadow-lg">
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#D38A5F] tracking-wider font-semibold uppercase">
                SESIÓN TÉCNICA
              </span>

              <h3 className="font-['IBM_Plex_Sans'] text-2xl text-[#F4F1ED] font-medium leading-tight">
                ¿Prefieres conversar primero?
              </h3>

              <p className="font-['IBM_Plex_Sans'] text-[15px] leading-[24px] text-[#A8A6AD]">
                Si prefieres explicar tu caso directamente, escríbeme por WhatsApp: el mensaje llega a mi teléfono y coordinamos una conversación para evaluar el alcance, los cuellos de botella y la viabilidad del proyecto.
              </p>

              <div className="pt-2">
                {WHATSAPP_URL ? (
                  <a
                    id="whatsapp-cta"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1B1B21] text-[#F4F1ED] border border-[#292930] rounded-[6px] font-['IBM_Plex_Sans'] font-semibold text-[15px] hover:border-[#B66A43] hover:text-[#D38A5F] hover:bg-[#202026] transition-all cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5 text-[#D38A5F]" />
                    <span>Conversemos por WhatsApp</span>
                  </a>
                ) : (
                  <a
                    id="whatsapp-cta-fallback"
                    href="#contact-form"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1B1B21] text-[#F4F1ED] border border-[#292930] rounded-[6px] font-['IBM_Plex_Sans'] font-semibold text-[15px] hover:border-[#B66A43] hover:text-[#D38A5F] hover:bg-[#202026] transition-all cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5 text-[#D38A5F]" />
                    <span>Escríbeme por el formulario</span>
                  </a>
                )}
              </div>
            </div>

            {/* Card 2: Professional Details with Copy */}
            <div className="p-6 bg-[#1B1B21] rounded-[8px] border border-[#292930] flex flex-col gap-2 font-['JetBrains_Mono'] text-[13px] text-[#A8A6AD]">
              <span className="text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold text-[16px]">
                Arland Michelena Villegas
              </span>
              <span>Ingeniero de Software · Full-Stack e IA</span>
              <span>Santiago, Chile · UTC-3</span>

              <div className="pt-3 border-t border-[#292930] flex items-center justify-between text-[12px]">
                <a
                  href="https://arlandstack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D38A5F] hover:underline font-['IBM_Plex_Mono'] flex items-center gap-1"
                >
                  <span>arlandstack.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="text-[#d3c1cf] hover:text-[#F4F1ED] flex items-center gap-1 cursor-pointer py-1 px-2 rounded bg-[#141418] border border-[#292930]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedEmail ? '¡Copiado!' : 'Copiar email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
