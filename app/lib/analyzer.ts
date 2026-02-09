// lib/analyzer.ts - COMPREHENSIVE PROBLEM ANALYZER

import { ComprehensiveAuditData } from './comprehensiveScraper';

/**
 * Analyze comprehensive audit data and identify problems/opportunities
 */
export function analyzeComprehensiveAudit(data: ComprehensiveAuditData) {
  const problems = {
    critical: [] as string[],
    important: [] as string[],
    minor: [] as string[],
  };
  
  const opportunities = {
    webServices: [] as string[],
    aiServices: [] as string[],
  };
  
  // ============================================
  // CRITICAL PROBLEMS (Must Fix Immediately)
  // ============================================
  
  if (!data.webServices.seo.hasTitleTag) {
    problems.critical.push('Missing Title Tag - Critical for SEO');
  }
  
  if (!data.webServices.seo.hasMetaDescription) {
    problems.critical.push('Missing Meta Description - Critical for SEO');
  }
  
  if (!data.webServices.performance.usesHTTPS) {
    problems.critical.push('Not Using HTTPS - Security Risk');
  }
  
  if (!data.webServices.design.hasResponsiveDesign) {
    problems.critical.push('Not Mobile Responsive - Losing 50%+ Traffic');
  }
  
  // ============================================
  // IMPORTANT PROBLEMS (Should Fix Soon)
  // ============================================
  
  if (data.webServices.seo.score < 50) {
    problems.important.push(`Poor SEO Score (${data.webServices.seo.score}/100) - Need Optimization`);
  }
  
  if (!data.webServices.seo.hasOgTags) {
    problems.important.push('Missing Open Graph Tags - Poor Social Media Sharing');
  }
  
  if (!data.webServices.structure.hasCTA) {
    problems.important.push('No Call-to-Action Buttons - Lower Conversion Rate');
  }
  
  if (data.webServices.design.designQuality === 'poor') {
    problems.important.push('Outdated Design - Need Modern UI/UX');
  }
  
  if (!data.webServices.structure.hasNavigation) {
    problems.important.push('Poor Navigation Structure - Bad User Experience');
  }
  
  // ============================================
  // MINOR IMPROVEMENTS (Nice to Have)
  // ============================================
  
  if (!data.webServices.seo.hasStructuredData) {
    problems.minor.push('Missing Structured Data - Limits Rich Search Results');
  }
  
  if (!data.webServices.design.hasAnimations) {
    problems.minor.push('No Animations/Transitions - Static Feel');
  }
  
  if (!data.webServices.performance.hasLazyLoading) {
    problems.minor.push('No Lazy Loading - Slower Page Speed');
  }
  
  if (!data.webServices.performance.isPWA) {
    problems.minor.push('Not a PWA - Missing Offline Capability');
  }
  
  if (!data.aiAutomation.chatbot.hasAny) {
    problems.minor.push('No Chatbot - Missing 24/7 Customer Support');
  }
  
  // ============================================
  // WEB SERVICE OPPORTUNITIES
  // ============================================
  
  if (data.webServices.seo.score < 70) {
    opportunities.webServices.push('SEO Optimization & Strategy');
  }
  
  if (data.webServices.design.designQuality !== 'excellent') {
    opportunities.webServices.push('Modern UI/UX Design Upgrade');
  }
  
  if (!data.webServices.design.hasModernLayout) {
    opportunities.webServices.push('Modern Layout Implementation (Grid/Flexbox)');
  }
  
  if (!data.webServices.design.hasCustomFonts) {
    opportunities.webServices.push('Custom Typography & Branding');
  }
  
  if (!data.webServices.design.hasAnimations) {
    opportunities.webServices.push('UI Animations & Micro-interactions');
  }
  
  if (data.webServices.techStack.frameworks.length === 0 && 
      data.webServices.techStack.platforms.includes('WordPress')) {
    opportunities.webServices.push('Modern Framework Migration (React/Next.js)');
  }
  
  if (!data.webServices.performance.isPWA) {
    opportunities.webServices.push('Progressive Web App Conversion');
  }
  
  if (!data.webServices.performance.hasLazyLoading) {
    opportunities.webServices.push('Performance Optimization Package');
  }
  
  if (!data.webServices.structure.hasHeroSection) {
    opportunities.webServices.push('Landing Page Optimization');
  }
  
  // ============================================
  // AI SERVICE OPPORTUNITIES
  // ============================================
  
  if (!data.aiAutomation.chatbot.hasAny) {
    opportunities.aiServices.push('AI Chatbot Integration (24/7 Support)');
  }
  
  if (data.aiAutomation.chatbot.hasAny && !data.aiAutomation.chatbot.hasAI) {
    opportunities.aiServices.push('Upgrade to AI-Powered Chatbot');
  }
  
  if (data.aiAutomation.chatbot.type === 'third-party') {
    opportunities.aiServices.push('Custom AI Chatbot Development');
  }
  
  if (!data.aiAutomation.socialBot.hasAny) {
    opportunities.aiServices.push('Social Media Bot Automation (WhatsApp/Messenger)');
  }
  
  if (!data.aiAutomation.voiceAssistant.hasAny) {
    opportunities.aiServices.push('Voice Search Integration');
  }
  
  if (!data.aiAutomation.aiFeatures.hasPersonalization) {
    opportunities.aiServices.push('AI-Powered Personalization Engine');
  }
  
  if (!data.aiAutomation.aiFeatures.hasRecommendationEngine) {
    opportunities.aiServices.push('AI Recommendation System');
  }
  
  if (!data.aiAutomation.aiFeatures.hasSearchAutocomplete) {
    opportunities.aiServices.push('Smart Search with AI Autocomplete');
  }
  
  return { problems, opportunities };
}

/**
 * Calculate estimated service value based on opportunities
 */
export function calculateOpportunityValue(opportunities: {
  webServices: string[];
  aiServices: string[];
}): number {
  // Pricing estimates (in USD)
  const servicePricing: { [key: string]: number } = {
    // Web Services
    'SEO Optimization & Strategy': 5000,
    'Modern UI/UX Design Upgrade': 8000,
    'Modern Layout Implementation (Grid/Flexbox)': 3000,
    'Custom Typography & Branding': 2000,
    'UI Animations & Micro-interactions': 3000,
    'Modern Framework Migration (React/Next.js)': 15000,
    'Progressive Web App Conversion': 6000,
    'Performance Optimization Package': 4000,
    'Landing Page Optimization': 3000,
    
    // AI Services
    'AI Chatbot Integration (24/7 Support)': 10000,
    'Upgrade to AI-Powered Chatbot': 5000,
    'Custom AI Chatbot Development': 12000,
    'Social Media Bot Automation (WhatsApp/Messenger)': 5000,
    'Voice Search Integration': 6000,
    'AI-Powered Personalization Engine': 12000,
    'AI Recommendation System': 10000,
    'Smart Search with AI Autocomplete': 4000,
  };
  
  let totalValue = 0;
  
  [...opportunities.webServices, ...opportunities.aiServices].forEach(service => {
    totalValue += servicePricing[service] || 0;
  });
  
  return totalValue;
}

/**
 * Generate pitch email based on detected problems
 */
export function generatePitchSummary(
  businessName: string,
  problems: { critical: string[]; important: string[]; minor: string[] },
  opportunities: { webServices: string[]; aiServices: string[] }
): string {
  const allOpportunities = [...opportunities.webServices, ...opportunities.aiServices];
  const estimatedValue = calculateOpportunityValue(opportunities);
  
  let pitch = `Hi ${businessName} team,\n\n`;
  pitch += `I recently analyzed your website and identified several opportunities to enhance your online presence:\n\n`;
  
  // Critical issues
  if (problems.critical.length > 0) {
    pitch += `🚨 CRITICAL ISSUES:\n`;
    problems.critical.forEach(p => pitch += `• ${p}\n`);
    pitch += `\n`;
  }
  
  // Important issues
  if (problems.important.length > 0) {
    pitch += `⚠️ IMPORTANT IMPROVEMENTS:\n`;
    problems.important.slice(0, 3).forEach(p => pitch += `• ${p}\n`);
    pitch += `\n`;
  }
  
  // Opportunities
  pitch += `💡 RECOMMENDED SERVICES:\n`;
  allOpportunities.slice(0, 5).forEach(o => pitch += `• ${o}\n`);
  pitch += `\n`;
  
  pitch += `💰 Estimated Project Value: $${estimatedValue.toLocaleString()}\n\n`;
  pitch += `Would you be interested in a detailed proposal on how we can help improve your website's performance and conversion rate?\n\n`;
  pitch += `Best regards,\nYour Agency Name`;
  
  return pitch;
}

/**
 * Create LeadAudit from comprehensive audit data (for database storage)
 */
export function createLeadAuditFromComprehensive(
  data: ComprehensiveAuditData,
  userId: string,
  location?: string
) {
  const analysis = analyzeComprehensiveAudit(data);
  
  return {
    userId,
    url: data.url,
    businessName: data.businessName,
    location,
    contactEmail: data.contactEmail,
    webServices: data.webServices,
    aiAutomation: data.aiAutomation,
    detectedProblems: analysis.problems,
    opportunities: analysis.opportunities,
    status: 'Audited' as const,
  };
}