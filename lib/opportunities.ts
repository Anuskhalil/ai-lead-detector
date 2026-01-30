// lib/opportunities.ts
// Generates service opportunities based on detection results

import {
  ChatbotResult,
  VoiceAssistantResult,
  SocialBotResult,
  FrameworkResult,
  SEOResult,
  DesignResult,
} from '../types';

/**
 * Generates a list of service opportunities based on what's missing
 * @param chatbot - Chatbot detection result
 * @param voiceAssistant - Voice assistant detection result
 * @param socialMediaBot - Social media bot detection result
 * @param framework - Framework detection result
 * @param seo - SEO analysis result
 * @param design - Design analysis result
 * @returns Array of opportunity strings
 */
export function generateOpportunities(
  chatbot: ChatbotResult,
  voiceAssistant: VoiceAssistantResult,
  socialMediaBot: SocialBotResult,
  framework: FrameworkResult,
  seo: SEOResult,
  design: DesignResult
): string[] {
  const opportunities: string[] = [];

  // ===== AI AUTOMATION OPPORTUNITIES =====

  // 1. Chatbot Opportunity
  if (!chatbot.hasChatbot) {
    opportunities.push('🤖 Pitch AI Chatbot Service - No chatbot detected');
  }

  // 2. Voice Assistant Opportunity
  if (!voiceAssistant.hasVoiceAssistant) {
    opportunities.push('🎤 Pitch Voice Assistant Integration - No voice features detected');
  }

  // 3. Social Media Bot Opportunity
  if (!socialMediaBot.hasSocialBot) {
    opportunities.push('💬 Pitch Social Media Bot - No automated social messaging');
  }

  // ===== WEB SERVICES OPPORTUNITIES =====

  // 4. Framework/Technology Opportunity
  if (framework.type === 'Legacy') {
    opportunities.push(
      `🔧 Pitch Website Redesign - Using legacy technology (${framework.detected.join(', ')})`
    );
  } else if (framework.type === 'Unknown') {
    opportunities.push('🔧 Pitch Website Modernization - Technology stack unclear or outdated');
  }

  // 5. SEO Opportunity
  if (seo.score < 70) {
    opportunities.push(`📈 Pitch SEO Optimization - SEO score only ${seo.score}%`);
    
    // Add specific SEO issues
    if (!seo.hasTitle) {
      opportunities.push('📝 Critical: Missing title tag (major SEO issue)');
    }
    if (!seo.hasMetaDescription) {
      opportunities.push('📝 Critical: Missing meta description (hurts search rankings)');
    }
  } else if (seo.score < 85) {
    opportunities.push(`📈 Pitch SEO Improvements - SEO score ${seo.score}% (room for improvement)`);
  }

  // 6. Mobile Responsiveness Opportunity
  if (!design.isMobileResponsive) {
    opportunities.push('📱 Pitch Mobile Optimization - Website not mobile-friendly');
  }

  // 7. Design/Layout Opportunity
  if (!design.hasModernLayout) {
    opportunities.push('🎨 Pitch Modern Design - Using outdated layout techniques');
  }

  // 8. Comprehensive Issues
  const totalIssues = design.issues.length + seo.issues.length;
  if (totalIssues >= 5) {
    opportunities.push(
      `⚠️ Pitch Full Website Audit - ${totalIssues} issues detected across design and SEO`
    );
  }

  return opportunities;
}

/**
 * Calculates lead quality based on number of opportunities
 * @param opportunityCount - Number of opportunities found
 * @returns Lead quality rating
 */
export function calculateLeadQuality(opportunityCount: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (opportunityCount >= 4) {
    return 'HIGH'; // Many opportunities = High quality lead
  } else if (opportunityCount >= 2) {
    return 'MEDIUM'; // Some opportunities = Medium quality lead
  } else {
    return 'LOW'; // Few opportunities = Low quality lead
  }
}