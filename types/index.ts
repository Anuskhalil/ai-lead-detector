// types/index.ts
// All TypeScript type definitions for the project

export interface ChatbotResult {
  hasChatbot: boolean;
  detectedServices: string[];
}

export interface VoiceAssistantResult {
  hasVoiceAssistant: boolean;
  detectedServices: string[];
}

export interface SocialBotResult {
  hasSocialBot: boolean;
  detectedPlatforms: string[];
}

export interface FrameworkResult {
  type: 'Modern' | 'Legacy' | 'Unknown';
  detected: string[];
}

export interface SEOResult {
  score: number;
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasH1: boolean;
  issues: string[];
}

export interface DesignResult {
  isMobileResponsive: boolean;
  hasModernLayout: boolean;
  issues: string[];
}

export interface DetectionResult {
  url: string;
  timestamp: string;
  chatbot: ChatbotResult;
  voiceAssistant: VoiceAssistantResult;
  socialMediaBot: SocialBotResult;
  framework: FrameworkResult;
  seo: SEOResult;
  design: DesignResult;
  opportunities: string[];
  leadQuality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface GooglePlacesResult {
  name: string;
  address: string;
  website?: string;
  phone?: string;
  rating?: number;
  types: string[];
}