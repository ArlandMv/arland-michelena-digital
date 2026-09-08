import React from 'react';
import { SERVICES_DATA } from '../data/portfolioData';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="servicios"
      className="w-full bg-[#FAF8F5] text-[#171619] py-20 lg:py-28 border-b border-[#D8D3CD]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#70402D] tracking-wider font-semibold uppercase">
            01 / WHAT I BUILD
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[40px] text-[#171619] tracking-tight font-medium leading-tight">
            De una necesidad técnica a un sistema funcionando.
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#4f4e54] mt-1">
            Puedo cubrir múltiples capas técnicas cuando un proyecto necesita desarrollo, integración y despliegue coordinado en lugar de múltiples proveedores desconectados.
          </p>
        </div>

        {/* 3 Structured Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-[#FAF8F5] rounded-[8px] border border-[#D8D3CD] p-7 flex flex-col justify-between hover:border-[#B66A43] hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-4">
                <span className="font-['IBM_Plex_Mono'] text-3xl sm:text-4xl text-[#70402D] leading-none font-bold tracking-tight">
                  {service.number}
                </span>
                <h3 className="font-['IBM_Plex_Sans'] text-[22px] text-[#171619] font-semibold leading-snug group-hover:text-[#70402D] transition-colors">
                  {service.title}
                </h3>
                <p className="font-['IBM_Plex_Sans'] text-[14px] leading-[22px] text-[#4f4e54]">
                  {service.description}
                </p>
              </div>

              {/* Technologies list */}
              <div className="pt-6 mt-6 border-t border-[#D8D3CD]/70 flex flex-wrap gap-1.5">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-[#ede9e3] text-[#341000] font-['JetBrains_Mono'] text-[11px] font-medium rounded hover:bg-[#B66A43] hover:text-[#FAF8F5] transition-colors select-none"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
