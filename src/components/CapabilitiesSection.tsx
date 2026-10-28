import React from 'react';
import { CAPABILITIES_DATA } from '../data/portfolioData';
import { Globe, Server, Database, Brain, Terminal, ArrowLeftRight } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  const getLucideIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Globe className="w-5 h-5 text-[#70402D]" />;
      case 'backend':
        return <Server className="w-5 h-5 text-[#70402D]" />;
      case 'data':
        return <Database className="w-5 h-5 text-[#70402D]" />;
      case 'ai':
        return <Brain className="w-5 h-5 text-[#70402D]" />;
      case 'infra':
        return <Terminal className="w-5 h-5 text-[#70402D]" />;
      case 'integrations':
        return <ArrowLeftRight className="w-5 h-5 text-[#70402D]" />;
      default:
        return <Server className="w-5 h-5 text-[#70402D]" />;
    }
  };

  return (
    <section
      id="capacidades"
      className="w-full bg-[#FAF8F5] text-[#171619] py-20 lg:py-28 border-b border-[#D8D3CD]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#70402D] tracking-wider font-semibold uppercase">
            03 / CAPABILITIES
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[36px] text-[#171619] tracking-tight font-medium">
            Capacidades a través del stack.
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#4f4e54]">
            Agrupadas por capa técnica. Herramientas seleccionadas por su confiabilidad y ajuste a la solución.
          </p>
        </div>

        {/* 6 Category Grid (3x2 Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES_DATA.map((item) => (
            <div
              key={item.id}
              id={`capability-card-${item.id}`}
              className="bg-[#FAF8F5] border border-[#D8D3CD] rounded-[8px] p-6 flex flex-col gap-3 hover:border-[#B66A43] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center" aria-hidden="true">
                  {getLucideIcon(item.id)}
                </span>
                <h3 className="font-['IBM_Plex_Sans'] font-semibold text-[16px] text-[#171619]">
                  {item.title}
                </h3>
              </div>

              <p className="font-['IBM_Plex_Sans'] text-[14px] leading-[22px] text-[#4f4e54]">
                {item.tools.join(', ')}.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
