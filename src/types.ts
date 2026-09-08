export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
}

export interface ProjectCase {
  id: string;
  category: string;
  badgeType?: 'default' | 'development';
  title: string;
  description: string;
  contribution: string;
  platforms?: {
    name: string;
    description: string;
  }[];
  tags: string[];
  architectureType: 'topology' | 'platforms' | 'pipeline';
  architectureData?: any;
}

export interface CapabilityCategory {
  id: string;
  title: string;
  iconName: string;
  tools: string[];
}

export interface ProcessPhase {
  id: string;
  phaseCode: string;
  percentage: string;
  title: string;
  description: string;
}

export interface ProofItem {
  tag: string;
  title: string;
  subtitle: string;
  detail: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  projectStage: string;
  message: string;
}
