import React, { useState, useEffect } from 'react';
import { HERO_DATA } from '../data/portfolioData';
import { ArrowDown, Radio } from 'lucide-react';

// Deben coincidir con el <link rel="preload" as="image"> de index.html (si no, el navegador descarga dos veces).
const HERO_MARK_SIZES = '(min-width: 640px) 320px, 288px';
const HERO_MARK_SRCSET_AVIF = '/brand/logo-mark-320.avif 320w, /brand/logo-mark-480.avif 480w, /brand/logo-mark-640.avif 640w';
const HERO_MARK_SRCSET_WEBP = '/brand/logo-mark-320.webp 320w, /brand/logo-mark-480.webp 480w, /brand/logo-mark-640.webp 640w';
const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const HERO_MARK_HTML =
  '<picture class="block w-full h-full">' +
  `<source type="image/avif" srcset="${HERO_MARK_SRCSET_AVIF}" sizes="${HERO_MARK_SIZES}">` +
  `<img src="${HERO_DATA.facetedMarkUrl}" srcset="${HERO_MARK_SRCSET_WEBP}" sizes="${HERO_MARK_SIZES}"` +
  ` alt="${escapeAttr(HERO_DATA.facetedMarkAlt)}" width="640" height="640" fetchpriority="high" loading="eager" decoding="async"` +
  ' class="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(122,46,132,0.35)] select-none">' +
  '</picture>';

interface HeroSectionProps {
  onOpenSchedule: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSchedule }) => {
  const [sclTime, setSclTime] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('es-CL', {
          timeZone: 'America/Santiago',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(new Date());
        setSclTime(timeStr);
      } catch (e) {
        setSclTime('17:02:11');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <section
      id="hero"
      className="relative w-full bg-[#0D0D0F] text-[#F4F1ED] overflow-hidden py-16 lg:py-24 border-b border-[#292930]"
    >
      {/* Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] [background-image:linear-gradient(to_right,#F4F1ED_1px,transparent_1px),linear-gradient(to_bottom,#F4F1ED_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />

      {/* Subtle ambient radial glow behind faceted mark */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#7A2E84]/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start gap-4 z-10">
          {/* Engineering Category Chip */}
          <div
            id="hero-badge"
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1B1B21] border border-[#292930]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B66A43]" />
            <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#D38A5F] tracking-widest uppercase font-medium">
              FULL-STACK · IA · AUTOMATIZACIÓN · INFRAESTRUCTURA
            </span>
          </div>

          {/* Heading block */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['JetBrains_Mono'] text-[12px] text-[#A8A6AD] tracking-wide uppercase">
              Ingeniero de Software · Santiago, Chile
            </span>
            <h1
              id="hero-heading"
              className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[58px] text-[#F4F1ED] tracking-[-0.03em] font-medium leading-[1.08]"
            >
              Construyo sistemas completos, desde la aplicación hasta producción.
            </h1>
          </div>

          {/* Subtitle */}
          <p
            id="hero-description"
            className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD] max-w-xl"
          >
            {HERO_DATA.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
            <a
              id="hero-cta-contact"
              href="#contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#7A2E84] text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold text-[15px] rounded-[6px] border border-[#292930] hover:border-[#B66A43] hover:bg-[#67276B] transition-all shadow-sm cursor-pointer text-center"
            >
              Hablemos de tu proyecto
            </a>

            <a
              id="hero-cta-work"
              href="#trabajo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#1B1B21] text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold text-[15px] rounded-[6px] border border-[#292930] hover:border-[#B66A43] hover:text-[#D38A5F] transition-all cursor-pointer text-center"
            >
              Ver trabajo seleccionado
            </a>
          </div>

          {/* Node Telemetry Readout */}
          <div
            id="hero-telemetry-readout"
            className="pt-4 grid grid-cols-3 gap-3 w-full max-w-md border-t border-[#292930]/70 mt-3"
          >
            <div>
              <span className="block font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD]">COORDENADAS</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#d3c1cf] font-medium">
                {HERO_DATA.coordinates}
              </span>
            </div>

            <div>
              <span className="block font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD]">UBICACIÓN</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#d3c1cf] font-medium flex items-center gap-1">
                <span>{HERO_DATA.timezone}</span>
                {sclTime && (
                  <span className="text-[10px] text-[#A8A6AD]">({sclTime})</span>
                )}
              </span>
            </div>

            <div>
              <span className="block font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD]">ESTADO</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#D38A5F] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B66A43] animate-pulse" />
                ACTIVO
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Faceted Mark Visual Presentation */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div
            id="faceted-mark-card"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setMousePosition({ x: 0, y: 0 });
            }}
            className="relative w-full max-w-lg aspect-square rounded-[8px] bg-[#141418] border border-[#292930] p-6 flex flex-col justify-between overflow-hidden group shadow-2xl transition-all duration-300 hover:border-[#7A2E84]"
          >
            {/* Structural corner registration markers */}
            <div className="absolute top-3 left-3 font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider select-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 border-t border-l border-[#A8A6AD]" />
              GRILLA:REF_001
            </div>
            <div className="absolute top-3 right-3 font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider select-none flex items-center gap-1">
              SIS:PROD
              <span className="w-1.5 h-1.5 border-t border-r border-[#A8A6AD]" />
            </div>
            <div className="absolute bottom-3 left-3 font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider select-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 border-b border-l border-[#A8A6AD]" />
              GEOMETRÍA_ING
            </div>
            <div className="absolute bottom-3 right-3 font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider select-none flex items-center gap-1">
              100% VECTORIAL_OCTA
              <span className="w-1.5 h-1.5 border-b border-r border-[#A8A6AD]" />
            </div>

            {/* Subtle Background Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-px bg-[#292930]" />
              <div className="h-full w-px bg-[#292930] absolute" />
              <div className="w-48 h-48 rounded-full border border-dashed border-[#292930] absolute" />
            </div>

            {/* Central Faceted Mark graphic */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-4">
              <div
                className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center transition-transform duration-500 ease-out"
                style={{
                  transform: isHovered
                    ? `perspective(1000px) rotateY(${mousePosition.x * 20}deg) rotateX(${-mousePosition.y * 20}deg) scale(1.05)`
                    : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)',
                }}
              >
                {/*
                  Ciclo 14: imagen LCP. AVIF (12–35 KB) con respaldo WebP; index.html la precarga con el
                  mismo srcset/sizes. Se inserta como HTML (no como elementos React) para que el <img> nazca
                  ya dentro del <picture>: React crea el <img> suelto y le asigna srcset antes de anexarlo,
                  y WebKit alcanza a descargar la variante WebP además de la AVIF (doble descarga).
                */}
                <div className="contents" dangerouslySetInnerHTML={{ __html: HERO_MARK_HTML }} />
              </div>
            </div>

            {/* Container Spec Readout */}
            <div className="relative z-10 w-full pt-3 border-t border-[#292930] flex items-center justify-between text-[#A8A6AD] font-['JetBrains_Mono'] text-[11px]">
              <span className="tracking-wider">MARCA FACETADA COMPLETA // V-2025</span>
              <span className="text-[#D38A5F] font-['IBM_Plex_Mono'] font-medium tracking-wider">
                NÚCLEO_AMATISTA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
