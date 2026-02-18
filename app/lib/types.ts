// app/lib/types.ts - Updated to match production analyzer

export interface LeadAudit {
  _id: string;
  userId: string;
  url: string;
  businessName?: string;
  contactEmail?: string;
  
  // Scores from production analyzer
  seoScore: number;                    // 0-100
  performanceScore: number;            // 0-100
  accessibilityScore: number;          // 0-100
  bestPracticesScore: number;          // 0-100
  designScore: number;                 // 1-10
  
  // PageSpeed data (from production analyzer)
  pagespeed?: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    issues: string[];
    opportunities: string[];
  };
  
  // Tech Stack (from production analyzer)
  techStack: {
    frameworks: string[];
    cms: string[];
    cssFrameworks: string[];
    analytics: string[];
    cdn: string[];
    hosting: string[];
    programming: string[];
    all: any[];
  };
  
  // Chatbots (from production analyzer)
  chatbots: {
    detected: boolean;
    providers: string[];
    isAIPowered: boolean;
    networkEndpoints: string[];
  };
  
  // Social Bots (from production analyzer)
  socialBots: {
    detected: boolean;
    platforms: string[];
  };
  
  // Voice Assistant (from production analyzer)
  voiceAssistant?: {
    detected: boolean;
    implementation: string[];
  };
  
  // Design Analysis (from production analyzer with Gemini)
  designAnalysis?: {
    layoutQuality: number;
    colorScheme: number;
    typography: number;
    visualHierarchy: number;
    modernityScore: number;
    overallScore: number;
    rating: string;
    feedback: string[];
    strengths: string[];
    recommendations: string[];
  };
  
  // Problems (from production analyzer)
  problems: {
    critical: string[];
    important: string[];
    minor: string[];
  };
  
  // Opportunities (from production analyzer)
  opportunities: {
    webServices: string[];
    aiServices: string[];
    estimatedValue: number;
  };
  
  // Backward compatibility with old structure
  webServices?: {
    seoTagsPresent: boolean;
    isMobileResponsive: boolean;
    techStack: string[];
  };
  
  automation?: {
    hasChatbot: boolean;
    hasVoiceAssistant: boolean;
    hasSocialBot: boolean;
  };
  
  detectedProblems?: string[];
  estimatedValue?: number;
  
  // Status
  status: 'Audited' | 'Email Sent' | 'Saved';
  createdAt?: string | Date;
}