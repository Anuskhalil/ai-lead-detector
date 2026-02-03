// lib/analyzer.ts

import { LeadAudit } from './types';
import { ScrapedData } from './scraper';

/**
 * Analyze scraped data and identify problems/opportunities
 * @param scrapedData - Data from the scraper
 * @returns Array of detected problems
 */
export function analyzeProblems(scrapedData: ScrapedData): string[] {
  const problems: string[] = [];

  // ============================================
  // WEB SERVICES PROBLEMS
  // ============================================
  
  if (!scrapedData.seoTagsPresent) {
    problems.push('SEO Optimization Needed');
  }

  if (!scrapedData.isMobileResponsive) {
    problems.push('Mobile Responsiveness Required');
  }

  // Check for outdated technology
  const outdatedTech = ['HTML/CSS/JS', 'jQuery'];
  const modernFrameworks = ['React', 'Next.js', 'Vue.js', 'Angular'];
  
  const hasOutdatedTech = scrapedData.techStack.some(tech => 
    outdatedTech.includes(tech)
  );
  
  const hasModernFramework = scrapedData.techStack.some(tech => 
    modernFrameworks.includes(tech)
  );
  
  if (hasOutdatedTech && !hasModernFramework) {
    problems.push('Modern Framework Migration Recommended');
  }

  // ============================================
  // AUTOMATION PROBLEMS
  // ============================================
  
  if (!scrapedData.hasChatbot) {
    problems.push('Missing AI Chatbot Integration');
  }

  if (!scrapedData.hasVoiceAssistant) {
    problems.push('Voice Assistant Integration Available');
  }

  if (!scrapedData.hasSocialBot) {
    problems.push('Social Media Bot Automation Missing');
  }

  return problems;
}

/**
 * Convert scraped data into a LeadAudit object for database storage
 * @param scrapedData - Data from the scraper
 * @param location - Optional location (if searched by location)
 * @returns LeadAudit object ready for database
 */
export function createLeadAuditFromScrapedData(
  scrapedData: ScrapedData,
  location?: string
): Omit<LeadAudit, '_id' | 'createdAt' | 'updatedAt'> {
  const detectedProblems = analyzeProblems(scrapedData);

  return {
    url: scrapedData.url,
    businessName: scrapedData.businessName,
    location,
    contactEmail: scrapedData.contactEmail,
    webServices: {
      seoTagsPresent: scrapedData.seoTagsPresent,
      isMobileResponsive: scrapedData.isMobileResponsive,
      techStack: scrapedData.techStack,
    },
    automation: {
      hasChatbot: scrapedData.hasChatbot,
      hasVoiceAssistant: scrapedData.hasVoiceAssistant,
      hasSocialBot: scrapedData.hasSocialBot,
    },
    detectedProblems,
    status: 'Audited',
  };
}