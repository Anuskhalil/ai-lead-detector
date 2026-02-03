// lib/types.ts

/**
 * Main data structure for a Lead Audit
 * This represents a single website audit with all its analysis
 */
export interface LeadAudit {
  _id?: string;                    // MongoDB ID (auto-generated)
  url: string;                     // Website URL
  businessName?: string;           // Business name (extracted from site)
  location?: string;               // Location (if searched by location)
  contactEmail?: string;           // Contact email (extracted from site)
  
  // Web Services Analysis
  webServices: {
    seoTagsPresent: boolean;       // Does site have SEO meta tags?
    isMobileResponsive: boolean;   // Is site mobile-friendly?
    techStack: string[];           // Technologies used (React, WordPress, etc.)
  };

  // Automation Analysis
  automation: {
    hasChatbot: boolean;           // Does site have a chatbot?
    hasVoiceAssistant: boolean;    // Does site have voice assistant?
    hasSocialBot: boolean;         // Does site have social media bot?
  };

  // Results
  detectedProblems: string[];      // List of issues found
  status: 'Audited' | 'Email Sent' | 'Saved';  // Current status
  
  createdAt?: Date;                // When audit was created
  updatedAt?: Date;                // When audit was last updated
}