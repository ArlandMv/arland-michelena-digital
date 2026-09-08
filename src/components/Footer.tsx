import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="w-full bg-[#0D0D0F] border-t border-[#292930] py-8 lg:py-10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap font-['IBM_Plex_Sans'] text-[14px]">
            <span className="font-semibold text-[#F4F1ED] tracking-[-0.01em]">
              ARLAND MICHELENA VILLEGAS
            </span>
            <span className="text-[#A8A6AD]">·</span>
            <span className="text-[#d3c1cf]">Full-Stack & AI Engineer</span>
            <span className="text-[#A8A6AD]">·</span>
            <span className="font-['JetBrains_Mono'] text-[12px] text-[#A8A6AD]">
              Santiago, Chile
            </span>
          </div>
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD]">
            Diseñado bajo Engineering Geometry · Todos los derechos reservados.
          </p>
        </div>

        {/* Right Links & Back to Top */}
        <div className="flex items-center gap-6 flex-wrap">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['IBM_Plex_Mono'] text-[12px] text-[#d3c1cf] hover:text-[#B66A43] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['IBM_Plex_Mono'] text-[12px] text-[#d3c1cf] hover:text-[#B66A43] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://arlandstack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['IBM_Plex_Mono'] text-[12px] text-[#d3c1cf] hover:text-[#B67ABA] transition-colors"
          >
            arlandstack.com
          </a>

          <button
            onClick={scrollToTop}
            title="Volver arriba"
            aria-label="Volver arriba"
            className="w-8 h-8 rounded bg-[#1B1B21] border border-[#292930] hover:border-[#B66A43] text-[#A8A6AD] hover:text-[#F4F1ED] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
