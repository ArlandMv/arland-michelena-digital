import { ServiceItem, ProjectCase, CapabilityCategory, ProcessPhase, ProofItem } from '../types';

export const HERO_DATA = {
  name: 'ARLAND',
  title: 'Ingeniero Full-Stack e IA',
  location: 'Santiago, Chile',
  coordinates: '-33.4489, -70.6693',
  timezone: 'SCL / UTC-3',
  status: 'ACTIVO',
  headline: 'Construyo sistemas completos, desde la aplicación hasta producción.',
  subheadline: 'Desarrollo aplicaciones, automatizaciones e integraciones de IA para startups, agencias y equipos que necesitan convertir una necesidad técnica en un sistema funcionando en producción.',
  logoUrl: '/brand/logo-mark-64.webp',
  facetedMarkUrl: '/brand/logo-mark-480.webp',
  facetedMarkAlt: 'Emblema de ARLAND: icosaedro facetado en 3D, violeta profundo con aristas de cobre y oro rosa, sobre un fondo oscuro tipo plano técnico.'
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'deployment-infra',
    number: '01',
    title: 'Despliegue e infraestructura',
    description: 'Despliegue y operación de aplicaciones utilizando Docker, VPS, Coolify, CI/CD e infraestructura cloud adecuada para garantizar continuidad operacional.',
    technologies: ['Docker', 'VPS', 'Coolify', 'CI/CD', 'Nginx / Cloudflare']
  },
  {
    id: 'product-development',
    number: '02',
    title: 'Desarrollo de producto',
    description: 'Aplicaciones web y herramientas internas de extremo a extremo, cubriendo frontend reactivo, APIs backend robustas, persistencia y servicios de terceros.',
    technologies: ['Angular', 'Nuxt', 'Next.js', 'Spring Boot', 'NestJS', 'Node.js']
  },
  {
    id: 'ai-automation',
    number: '03',
    title: 'IA y automatización',
    description: 'Implementación práctica de agentes de IA, arquitecturas RAG, integraciones de LLMs y automatización de flujos con Python y n8n orientados a resolver procesos de negocio concretos.',
    technologies: ['RAG', 'AI Agents', 'LLM APIs', 'Python', 'n8n', 'Vector DB']
  }
];

export const PROJECTS_DATA: ProjectCase[] = [
  {
    id: 'huly-self-hosted',
    category: 'DESPLIEGUE / INFRAESTRUCTURA',
    badgeType: 'default',
    title: 'Huly self-hosted para continuidad operacional',
    description: 'Despliegue integral de entorno colaborativo Huly self-hosted en servidor VPS dedicado para la agencia OQO, asegurando continuidad operativa y privacidad de datos.',
    contribution: 'VPS deployment · Docker / infraestructura · Configuración y optimización de app · Mantención y continuidad operacional.',
    tags: ['VPS', 'Docker', 'Linux', 'Self-hosted Huly'],
    architectureType: 'topology'
  },
  {
    id: 'site-optimization',
    category: 'WEB / SEO TÉCNICO',
    badgeType: 'default',
    title: 'Optimización técnica de sitios y ecommerce',
    description: 'Auditoría, resolución de cuellos de botella estructurales y optimización técnica para tres plataformas y ecosistemas distintos en producción.',
    contribution: 'Análisis de renderizado, optimización de estructura semántica y corrección de bloqueos de rastreo.',
    platforms: [
      { name: 'OQO.cl', description: 'Nuxt (SSR, routing, rendering pipeline)' },
      { name: 'CEIM.cl', description: 'Salesforce B2C (arquitectura componentes)' },
      { name: 'Belkin.cl', description: 'Shopify ecommerce (Liquid, scripts y assets)' }
    ],
    tags: ['Nuxt', 'Salesforce B2C', 'Shopify', 'Estándares web'],
    architectureType: 'platforms'
  },
  {
    id: 'ai-ticket-system',
    category: 'IA / SISTEMAS INTERNOS',
    badgeType: 'development',
    title: 'Sistema de tickets con clasificación asistida por IA',
    description: 'Plataforma interna para gestión de solicitudes y triaje automatizado con clasificación contextual para derivación inteligente de incidentes técnicos.',
    contribution: 'Arquitectura full-stack, clustering vectorial y prompt pipelines con fallback tolerante a fallos.',
    tags: ['Angular', 'Python', 'RAG', 'PostgreSQL (pgvector)', 'LLM APIs'],
    architectureType: 'pipeline'
  }
];

export const CAPABILITIES_DATA: CapabilityCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    iconName: 'web',
    tools: ['Angular', 'AngularJS', 'Nuxt', 'Next.js', 'TypeScript']
  },
  {
    id: 'backend',
    title: 'Backend',
    iconName: 'dns',
    tools: ['Spring', 'Spring Boot', 'NestJS', 'Node.js', 'Express']
  },
  {
    id: 'data',
    title: 'Datos y persistencia',
    iconName: 'database',
    tools: ['PostgreSQL', 'MySQL', 'Cassandra']
  },
  {
    id: 'ai',
    title: 'IA y automatización',
    iconName: 'neurology',
    tools: ['RAG', 'LLM integrations', 'AI agents', 'MCP (Model Context Protocol)', 'Ollama', 'LibreChat', 'n8n', 'Pydantic']
  },
  {
    id: 'infra',
    title: 'Infraestructura',
    iconName: 'terminal',
    tools: ['Docker', 'Coolify', 'CI/CD', 'CDNs', 'Linux VPS']
  },
  {
    id: 'integrations',
    title: 'Integraciones y APIs',
    iconName: 'sync_alt',
    tools: ['REST', 'SOAP', 'GraphQL', 'Meta APIs', 'Salesforce APIs']
  }
];

export const PROCESS_DATA: ProcessPhase[] = [
  {
    id: 'phase-01',
    phaseCode: 'PHASE_01',
    percentage: '[ 25% ]',
    title: 'ENTENDER',
    description: 'Entender el problema de raíz, procesos vigentes, restricciones operativas y sistemas existentes.'
  },
  {
    id: 'phase-02',
    phaseCode: 'PHASE_02',
    percentage: '[ 50% ]',
    title: 'DISEÑAR',
    description: 'Definir arquitectura técnica, integraciones, alcance y la solución más pequeña y efectiva posible.'
  },
  {
    id: 'phase-03',
    phaseCode: 'PHASE_03',
    percentage: '[ 75% ]',
    title: 'CONSTRUIR',
    description: 'Implementación incremental, pruebas y conexión controlada de los sistemas necesarios.'
  },
  {
    id: 'phase-04',
    phaseCode: 'PHASE_04',
    percentage: '[ 100% ]',
    title: 'ENTREGAR E ITERAR',
    description: 'Despliegue a producción, validación en vivo, monitoreo y mejoras basadas en datos.'
  }
];

export const PROOF_DATA: ProofItem[] = [
  {
    tag: 'ROL ACTUAL',
    title: 'OQO Agency',
    subtitle: 'Dic 2025 – Presente',
    detail: 'Ecommerce, IA & Salesforce B2C'
  },
  {
    tag: 'TRAYECTORIA',
    title: 'Sector Bancario',
    subtitle: 'Ingeniero Full-Stack',
    detail: 'Microservicios Spring Boot & Angular'
  },
  {
    tag: 'CERTIFICACIÓN',
    title: 'Agentforce Specialist',
    subtitle: 'Salesforce Certified',
    detail: 'Agentes de IA y workflows autónomos'
  },
  {
    tag: 'IDIOMAS & ALCANCE',
    title: 'Multilingüe',
    subtitle: 'Español (Nat) · Inglés (Fluido)',
    detail: 'Francés (Profesional) · Remoto Global'
  }
];

// Perfiles públicos de Arland (usados en el footer y verificados por e2e/links-footer.spec.ts).
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arland-michelena' },
  { label: 'GitHub', href: 'https://github.com/ArlandMv' },
] as const;
