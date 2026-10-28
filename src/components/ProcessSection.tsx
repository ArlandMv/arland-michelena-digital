import React from 'react';
import { PROCESS_DATA } from '../data/portfolioData';
import { Layers, ArrowRight, Package } from 'lucide-react';

interface ProcessSectionProps {
  onOpenSchedule: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenSchedule }) => {
  return (
    <section
      id="proceso"
      className="w-full bg-[#0D0D0F] text-[#F4F1ED] py-20 lg:py-28 border-b border-[#292930]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#B66A43] tracking-wider font-semibold uppercase">
            04 / PROCESO
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[36px] text-[#F4F1ED] tracking-tight font-medium">
            Del problema al sistema desplegado.
          </h2>
        </div>

        {/* 4-Step Technical Architecture Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {PROCESS_DATA.map((phase) => (
            <div
              key={phase.id}
              id={`process-card-${phase.id}`}
              className="bg-[#141418] border border-[#292930] p-6 rounded-[8px] flex flex-col gap-4 relative group hover:border-[#B66A43] transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#292930] pb-3">
                <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#B66A43] font-medium tracking-wide">
                  {phase.phaseCode}
                </span>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD]">
                  {phase.percentage}
                </span>
              </div>

              <h3 className="font-['IBM_Plex_Sans'] font-semibold text-[16px] text-[#F4F1ED] tracking-wide">
                {phase.title}
              </h3>

              <p className="font-['IBM_Plex_Sans'] text-[14px] leading-[22px] text-[#A8A6AD]">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        {/* Commercial Callout Box */}
        <div className="bg-[#1B1B21] border border-[#B66A43]/40 rounded-[8px] p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <Package className="w-7 h-7 text-[#B66A43] shrink-0" aria-hidden="true" />
            <p className="font-['IBM_Plex_Sans'] text-[15px] sm:text-[16px] leading-relaxed text-[#F4F1ED]">
              Puedo entrar en un proyecto como implementador técnico o asumir una solución de punta a punta, dependiendo del alcance.
            </p>
          </div>

          <a
            id="process-availability-link"
            href="#contacto"
            className="shrink-0 font-['IBM_Plex_Mono'] text-[12px] text-[#B66A43] hover:text-[#F4F1ED] transition-colors uppercase font-medium flex items-center gap-1.5 focus:outline-none"
          >
            <span>Consultar disponibilidad</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
