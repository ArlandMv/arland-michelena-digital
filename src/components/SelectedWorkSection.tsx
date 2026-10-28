import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { Activity, Cpu, Server, CheckCircle2, ArrowRight } from 'lucide-react';

export const SelectedWorkSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="trabajo"
      className="w-full bg-[#0D0D0F] text-[#F4F1ED] py-20 lg:py-28 border-b border-[#292930]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#D38A5F] tracking-wider font-semibold uppercase">
            02 / PROYECTOS DESTACADOS
          </span>
          <h2 className="font-['IBM_Plex_Sans'] text-3xl sm:text-4xl lg:text-[36px] text-[#F4F1ED] tracking-tight font-medium">
            Trabajo aplicado a problemas reales.
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD]">
            Casos reales con foco en problemas concretos, decisiones de arquitectura y ejecución en producción.
          </p>
        </div>

        {/* 3 Project Cards */}
        <div className="flex flex-col gap-8">
          {/* Project 1: Huly self-hosted */}
          <div
            id="project-card-huly"
            className="bg-[#141418] rounded-[8px] border border-[#292930] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-between hover:border-[#7A2E84]/60 transition-all shadow-lg"
          >
            <div className="flex-1 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#1B1B21] font-['IBM_Plex_Mono'] text-[11px] text-[#D38A5F] border border-[#292930] font-medium tracking-wide">
                  DESPLIEGUE / INFRAESTRUCTURA
                </span>
              </div>

              <h3 className="font-['IBM_Plex_Sans'] text-2xl text-[#F4F1ED] font-medium leading-snug">
                Huly self-hosted para continuidad operacional
              </h3>

              <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD]">
                Despliegue integral de entorno colaborativo Huly self-hosted en servidor VPS dedicado para la agencia OQO, asegurando continuidad operativa y privacidad de datos.
              </p>

              <div className="bg-[#1B1B21] p-4 rounded-[6px] border border-[#292930] flex flex-col gap-1">
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] font-medium tracking-wider">
                  CONTRIBUCIÓN:
                </span>
                <p className="font-['IBM_Plex_Sans'] text-[14px] leading-[22px] text-[#d3c1cf]">
                  VPS deployment · Docker / infraestructura · Configuración y optimización de app · Mantención y continuidad operacional.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {['VPS', 'Docker', 'Linux', 'Self-hosted Huly'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#0D0D0F] font-['JetBrains_Mono'] text-[11px] text-[#D8D3CD] rounded border border-[#292930]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Diagram 1 */}
            <div className="w-full lg:w-96 bg-[#0D0D0F] p-5 rounded-[6px] border border-[#292930] flex flex-col gap-3">
              <div className="font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider uppercase border-b border-[#292930] pb-2 flex items-center justify-between">
                <span>TOPOLOGÍA DE ARQUITECTURA</span>
                <span className="text-[#D38A5F] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B66A43] animate-pulse" />
                  SIS_EN_EJECUCIÓN
                </span>
              </div>

              <div className="flex flex-col gap-2 py-2">
                <div className="bg-[#141418] border border-[#292930] px-3 py-2 rounded text-center font-['JetBrains_Mono'] text-[13px] text-[#F4F1ED] flex items-center justify-between">
                  <span>[Host VPS dedicado]</span>
                  <span className="w-2 h-2 rounded-full bg-[#B66A43]" />
                </div>

                <div className="text-center font-['JetBrains_Mono'] text-[11px] text-[#D38A5F] leading-none py-0.5">
                  ↓ Docker Engine
                </div>

                <div className="bg-[#2a2a2c] border border-[#7A2E84] px-3 py-2.5 rounded text-center font-['JetBrains_Mono'] text-[13px] text-[#f9a1ff] shadow-[0_0_12px_rgba(122,46,132,0.2)]">
                  [Núcleo Huly y microservicios]
                </div>

                <div className="text-center font-['JetBrains_Mono'] text-[11px] text-[#D38A5F] leading-none py-0.5">
                  ↓ Nginx (proxy inverso)
                </div>

                <div className="bg-[#141418] border border-[#292930] px-3 py-2 rounded text-center font-['JetBrains_Mono'] text-[13px] text-[#A8A6AD]">
                  [SSL / Volúmenes persistentes]
                </div>
              </div>
            </div>
          </div>

          {/* Project 2: Site & Ecommerce Optimization */}
          <div
            id="project-card-ecommerce"
            className="bg-[#141418] rounded-[8px] border border-[#292930] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-between hover:border-[#7A2E84]/60 transition-all shadow-lg"
          >
            <div className="flex-1 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#1B1B21] font-['IBM_Plex_Mono'] text-[11px] text-[#B67ABA] border border-[#292930] font-medium tracking-wide">
                  WEB / SEO TÉCNICO
                </span>
              </div>

              <h3 className="font-['IBM_Plex_Sans'] text-2xl text-[#F4F1ED] font-medium leading-snug">
                Optimización técnica de sitios y ecommerce
              </h3>

              <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD]">
                Auditoría, resolución de cuellos de botella estructurales y optimización técnica para tres plataformas y ecosistemas distintos en producción.
              </p>

              {/* 3 Platforms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-[#0D0D0F] rounded border border-[#292930] hover:border-[#B67ABA] transition-colors">
                  <span className="font-['IBM_Plex_Sans'] font-semibold text-[14px] text-[#F4F1ED] block">
                    OQO.cl
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD] block mt-1">
                    Nuxt (SSR, ruteo, pipeline de renderizado)
                  </span>
                </div>

                <div className="p-3 bg-[#0D0D0F] rounded border border-[#292930] hover:border-[#B67ABA] transition-colors">
                  <span className="font-['IBM_Plex_Sans'] font-semibold text-[14px] text-[#F4F1ED] block">
                    CEIM.cl
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD] block mt-1">
                    Salesforce B2C (arquitectura componentes)
                  </span>
                </div>

                <div className="p-3 bg-[#0D0D0F] rounded border border-[#292930] hover:border-[#B67ABA] transition-colors">
                  <span className="font-['IBM_Plex_Sans'] font-semibold text-[14px] text-[#F4F1ED] block">
                    Belkin.cl
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD] block mt-1">
                    Shopify ecommerce (Liquid, scripts y assets)
                  </span>
                </div>
              </div>

              <div className="bg-[#1B1B21] p-4 rounded-[6px] border border-[#292930] flex flex-col gap-1 mt-1">
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#A8A6AD] font-medium tracking-wider">
                  CONTRIBUCIÓN:
                </span>
                <p className="font-['IBM_Plex_Sans'] text-[14px] leading-[22px] text-[#d3c1cf]">
                  Análisis de renderizado, optimización de estructura semántica y corrección de bloqueos de rastreo.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Nuxt', 'Salesforce B2C', 'Shopify', 'Estándares web'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#0D0D0F] font-['JetBrains_Mono'] text-[11px] text-[#D8D3CD] rounded border border-[#292930]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 3: AI Ticket System */}
          <div
            id="project-card-ticket-ai"
            className="bg-[#141418] rounded-[8px] border border-[#292930] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-between hover:border-[#7A2E84]/60 transition-all shadow-lg"
          >
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#1B1B21] font-['IBM_Plex_Mono'] text-[11px] text-[#D38A5F] border border-[#292930] font-medium tracking-wide">
                  IA / SISTEMAS INTERNOS
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#70402D]/30 border border-[#B66A43] text-[#D38A5F] font-['IBM_Plex_Mono'] text-[11px] font-medium">
                  EN DESARROLLO
                </span>
              </div>

              <h3 className="font-['IBM_Plex_Sans'] text-2xl text-[#F4F1ED] font-medium leading-snug">
                Sistema de tickets con clasificación asistida por IA
              </h3>

              <p className="font-['IBM_Plex_Sans'] text-[16px] leading-[26px] text-[#A8A6AD]">
                Plataforma interna para gestión de solicitudes y triaje automatizado con clasificación contextual para derivación inteligente de incidentes técnicos.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Angular', 'Python', 'RAG', 'PostgreSQL (pgvector)', 'LLM APIs'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#0D0D0F] font-['JetBrains_Mono'] text-[11px] text-[#D8D3CD] rounded border border-[#292930]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Diagram 3 (Interactive Pipeline Flow) */}
            <div className="w-full lg:w-[420px] bg-[#0D0D0F] p-5 rounded-[6px] border border-[#292930] flex flex-col gap-3">
              <div className="font-['JetBrains_Mono'] text-[10px] text-[#A8A6AD] tracking-wider uppercase border-b border-[#292930] pb-2 flex items-center justify-between">
                <span>FLUJO DE INTEGRACIÓN</span>
                <span className="text-[#B67ABA] font-['IBM_Plex_Mono'] font-medium">
                  ASYNC_QUEUE
                </span>
              </div>

              <div className="flex flex-col gap-2 font-['JetBrains_Mono'] text-[12px]">
                {/* Node 1 */}
                <div className="flex items-center justify-between p-2.5 bg-[#1B1B21] rounded border border-[#292930]">
                  <span className="text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold">Portal de usuarios</span>
                  <span className="text-[#B67ABA] text-[11px]">Angular App</span>
                </div>

                <div className="flex justify-center text-[#D38A5F] font-['IBM_Plex_Mono'] text-[10px] leading-none py-0.5">
                  │ REST API
                </div>

                {/* Node 2 */}
                <div className="flex items-center justify-between p-2.5 bg-[#1B1B21] rounded border border-[#292930]">
                  <span className="text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold">Motor de tickets</span>
                  <span className="text-[#A8A6AD] text-[11px]">Controlador de ruteo</span>
                </div>

                <div className="flex justify-center text-[#D38A5F] font-['IBM_Plex_Mono'] text-[10px] leading-none py-0.5">
                  │ Payload
                </div>

                {/* Node 3 */}
                <div className="flex items-center justify-between p-2.5 bg-[#67276B]/40 rounded border border-[#7A2E84] shadow-[0_0_12px_rgba(122,46,132,0.2)]">
                  <span className="text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold">Agente IA en Python</span>
                  <span className="text-[#B67ABA] text-[11px]">Classifier / RAG</span>
                </div>

                <div className="flex justify-center text-[#D38A5F] font-['IBM_Plex_Mono'] text-[10px] leading-none py-0.5">
                  │ Consulta de embeddings
                </div>

                {/* Node 4 */}
                <div className="flex items-center justify-between p-2.5 bg-[#1B1B21] rounded border border-[#292930]">
                  <span className="text-[#F4F1ED] font-['IBM_Plex_Sans'] font-semibold">PostgreSQL</span>
                  <span className="text-[#D38A5F] font-['IBM_Plex_Mono'] text-[11px]">pgvector DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
