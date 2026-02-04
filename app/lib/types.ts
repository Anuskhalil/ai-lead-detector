// lib/types.ts

export interface LeadAudit {
  _id?: string;
  userId: string;                  // NEW: User who created this audit
  url: string;
  businessName?: string;
  location?: string;
  contactEmail?: string;
  
  webServices: {
    seoTagsPresent: boolean;
    isMobileResponsive: boolean;
    techStack: string[];
  };

  automation: {
    hasChatbot: boolean;
    hasVoiceAssistant: boolean;
    hasSocialBot: boolean;
  };

  detectedProblems: string[];
  status: 'Audited' | 'Email Sent' | 'Saved';
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}