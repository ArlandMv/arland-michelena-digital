import React from 'react';
import { PROOF_DATA } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="sobre-mi"
      className="w-full bg-[#FAF8F5] text-[#171619] py-20 lg:py-28 border-b border-[#D8D3CD]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#70402D] tracking-wider font-semibold uppercase">
            05 / ABOUT
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[36px] text-[#171619] tracking-tight font-medium">
            Ingeniería orientada a sistemas que deben funcionar de verdad.
          </h2>
        </div>

        {/* 2-Column Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left: Credibility Narrative */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#171619] font-medium">
              Base en <strong>Santiago, Chile</strong> · Disponible para proyectos y contratos remotos en cualquier huso horario compatible.
            </p>
            <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#4f4e54]">
              Actualmente me desempeño en la agencia <strong>OQO</strong> (desde diciembre 2025), donde estoy enfocado en desarrollo para ecosistemas de comercio electrónico y la estructuración de automatizaciones asistidas por IA.
            </p>
            <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#4f4e54]">
              Como parte de este rol, doy soporte y extiendo soluciones sobre <strong>Salesforce B2C Commerce</strong> para marcas y clientes de gran volumen.
            </p>
            <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#4f4e54]">
              Anteriormente trabajé como <strong>Desarrollador Full-Stack en el sector bancario</strong>, diseñando e implementando arquitecturas de microservicios con Angular y Spring Boot bajo estrictos requerimientos de tolerancia a fallos, auditoría y seguridad corporativa.
            </p>
          </div>

          {/* Right: 4 Proof Blocks */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROOF_DATA.map((proof, index) => (
              <div
                key={index}
                id={`proof-block-${index}`}
                className="bg-[#FAF8F5] border border-[#D8D3CD] rounded-[8px] p-5 flex flex-col justify-between hover:border-[#B66A43] transition-colors"
              >
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#70402D] font-semibold tracking-wider">
                  {proof.tag}
                </span>

                <div className="mt-3">
                  <h3 className="font-['IBM_Plex_Sans'] font-semibold text-[15px] text-[#171619]">
                    {proof.title}
                  </h3>
                  <p className="font-['IBM_Plex_Sans'] text-[13px] text-[#4f4e54] mt-0.5">
                    {proof.subtitle}
                  </p>
                  <p className="font-['JetBrains_Mono'] text-[11px] text-[#70402D] mt-2 leading-tight">
                    {proof.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
