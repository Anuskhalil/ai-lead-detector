// lib/types.ts - COMPREHENSIVE TYPES

export interface LeadAudit {
  _id?: string;
  userId: string;
  url: string;
  businessName?: string;
  location?: string;
  contactEmail?: string;
  
  // WEB SERVICES
  webServices: {
    seo: SEOAnalysis;
    design: DesignAnalysis;
    structure: StructureAnalysis;
    techStack: TechStackAnalysis;
    performance: PerformanceAnalysis;
  };
  
  // AI AUTOMATION
  aiAutomation: {
    chatbot: ChatbotAnalysis;
    socialBot: SocialBotAnalysis;
    voiceAssistant: VoiceAssistantAnalysis;
    aiFeatures: AIFeaturesAnalysis;
  };
  
  // PROBLEMS & OPPORTUNITIES
  detectedProblems: {
    critical: string[];
    important: string[];
    minor: string[];
  };
  
  opportunities: {
    webServices: string[];
    aiServices: string[];
  };
  
  status: 'Audited' | 'Email Sent' | 'Saved';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SEOAnalysis {
  hasTitleTag: boolean;
  hasMetaDescription: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
  hasXmlSitemap: boolean;
  hasCanonicalTags: boolean;
  score: number; // 0-100
}

export interface DesignAnalysis {
  hasModernLayout: boolean;
  hasResponsiveDesign: boolean;
  hasCustomFonts: boolean;
  hasAnimations: boolean;
  designQuality: 'poor' | 'average' | 'good' | 'excellent';
}

export interface StructureAnalysis {
  hasHeader: boolean;
  hasFooter: boolean;
  hasNavigation: boolean;
  hasHeroSection: boolean;
  hasCTA: boolean;
  layoutType: 'single-page' | 'multi-section' | 'complex';
}

export interface TechStackAnalysis {
  frameworks: string[];     // React, Vue, Angular, etc.
  libraries: string[];      // jQuery, Lodash, etc.
  cssFrameworks: string[];  // Bootstrap, Tailwind, etc.
  platforms: string[];      // WordPress, Shopify, etc.
  buildTools: string[];     // Webpack, Vite, etc.
}

export interface PerformanceAnalysis {
  usesHTTPS: boolean;
  hasServiceWorker: boolean;
  isPWA: boolean;
  usesModernJS: boolean;
  hasLazyLoading: boolean;
}

export interface ChatbotAnalysis {
  hasAny: boolean;
  type: 'none' | 'third-party' | 'custom' | 'ai-powered';
  platforms: string[];      // Tidio, Intercom, Drift, etc.
  isCustomBuilt: boolean;
  hasAI: boolean;
  features: string[];
}

export interface SocialBotAnalysis {
  hasAny: boolean;
  platforms: string[];      // WhatsApp, Messenger, etc.
  isAutomated: boolean;
}

export interface VoiceAssistantAnalysis {
  hasAny: boolean;
  isImplemented: boolean;
  features: string[];
}

export interface AIFeaturesAnalysis {
  hasRecommendationEngine: boolean;
  hasPersonalization: boolean;
  hasSearchAutocomplete: boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  marketingEmails: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}