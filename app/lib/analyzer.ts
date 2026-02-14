// lib/analyzer.ts - FINAL WORKING VERSION (No Wappalyzer!)
import puppeteer, { Browser, Page } from 'puppeteer';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// TYPES
// ============================================

export interface ComprehensiveAnalysis {
  url: string;
  businessName?: string;
  contactEmail?: string;
  
  pagespeed: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    issues: string[];
    opportunities: string[];
  };
  
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
  
  chatbots: {
    detected: boolean;
    providers: string[];
    isAIPowered: boolean;
    networkEndpoints: string[];
  };
  
  socialBots: {
    detected: boolean;
    platforms: string[];
  };
  
  voiceAssistant: {
    detected: boolean;
    implementation: string[];
  };
  
  designAnalysis: {
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
  
  problems: {
    critical: string[];
    important: string[];
    minor: string[];
  };
  
  opportunities: {
    webServices: string[];
    aiServices: string[];
    estimatedValue: number;
  };
}

// ============================================
// MAIN ANALYZER
// ============================================

export async function comprehensiveAIAnalysis(url: string): Promise<ComprehensiveAnalysis> {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 AI-POWERED WEBSITE ANALYSIS');
  console.log('='.repeat(80));
  console.log(`🌐 URL: ${url}\n`);
  
  let browser: Browser | null = null;
  
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('📌 Launching Browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Network monitoring
    console.log('📌 Setting up Network Monitoring...');
    const networkDetection = setupNetworkMonitoring(page);
    
    console.log('⏳ Loading page...');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Extract all data in one go
    console.log('🔍 Analyzing page...');
    const pageData = await page.evaluate((pageUrl) => {
      function isVisible(el: Element | null): boolean {
        if (!el || !(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               el.offsetHeight > 0;
      }

      const html = document.documentElement.outerHTML.toLowerCase();
      const bodyText = document.body.innerText.toLowerCase();
      
      // Tech Stack Detection (Manual - Reliable!)
      const frameworks: string[] = [];
      const cms: string[] = [];
      const cssFrameworks: string[] = [];
      
      if ((window as any).React || (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || html.includes('react')) {
        frameworks.push('React');
      }
      if ((window as any).__NEXT_DATA__ || html.includes('_next/static')) {
        frameworks.push('Next.js');
      }
      if ((window as any).Vue || html.includes('vue')) {
        frameworks.push('Vue.js');
      }
      if ((window as any).angular || html.includes('angular')) {
        frameworks.push('Angular');
      }
      
      if (html.includes('wp-content') || html.includes('wordpress')) {
        cms.push('WordPress');
      }
      if ((window as any).Shopify || html.includes('shopify')) {
        cms.push('Shopify');
      }
      if (html.includes('wixstatic')) {
        cms.push('Wix');
      }
      if (html.includes('webflow')) {
        cms.push('Webflow');
      }
      
      if (html.includes('bootstrap')) {
        cssFrameworks.push('Bootstrap');
      }
      if (html.includes('tailwind') || document.querySelector('[class*="bg-"]')) {
        cssFrameworks.push('Tailwind CSS');
      }
      
      // SEO Detection
      const title = document.querySelector('title');
      const metaDesc = document.querySelector('meta[name="description"]');
      const ogTags = document.querySelector('meta[property="og:title"]');
      
      let seoScore = 0;
      if (title?.textContent) seoScore += 25;
      if (metaDesc?.getAttribute('content')) seoScore += 25;
      if (ogTags) seoScore += 25;
      if (document.querySelector('meta[name="viewport"]')) seoScore += 25;
      
      // Chatbot Detection (Visual)
      const chatSelectors = [
        '#tidio-chat', '#intercom-container', '#drift-widget',
        '.crisp-client', '#tawkchat-container', '[class*="chatbot"]'
      ];
      const hasChatbot = chatSelectors.some(sel => {
        const el = document.querySelector(sel);
        return el && isVisible(el);
      });
      
      // Social Bots
      const hasWhatsApp = Array.from(document.querySelectorAll('a[href*="wa.me"]')).some(el => isVisible(el));
      const hasMessenger = !!document.querySelector('.fb-customerchat');
      
      // Business Info
      const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
      const titleText = document.querySelector('title')?.textContent;
      const businessName = siteName || titleText?.split('|')[0]?.trim() || '';
      
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emails = document.body.innerText.match(emailRegex) || [];
      const validEmails = emails.filter(e => 
        !e.includes('example.com') && !e.includes('test.com')
      );
      const contactEmail = validEmails.find(e => 
        e.includes('contact') || e.includes('info')
      ) || validEmails[0];
      
      return {
        businessName,
        contactEmail,
        seoScore,
        techStack: { frameworks, cms, cssFrameworks },
        hasChatbot,
        socialBots: {
          whatsapp: hasWhatsApp,
          messenger: hasMessenger
        }
      };
    }, url);
    
    // Get network detection results
    await new Promise(resolve => setTimeout(resolve, 1000));
    const networkResults = networkDetection.getResults();
    
    // PageSpeed Insights
    console.log('\n📌 Running PageSpeed Insights...');
    const pagespeedResults = await runPageSpeedInsights(url);
    
    // Gemini Vision (optional)
    let designResults = getDefaultDesignAnalysis();
    if (process.env.GOOGLE_AI_API_KEY) {
      console.log('\n📌 Analyzing Design with Gemini Vision...');
      try {
        const screenshot = await page.screenshot({ 
          encoding: 'base64',
          fullPage: false
        }) as string;
        designResults = await analyzeDesignWithGemini(screenshot, url);
      } catch (error) {
        console.log('⚠️ Gemini Vision skipped');
      }
    }
    
    await browser.close();
    
    // Combine results
    const comprehensiveResults: ComprehensiveAnalysis = {
      url,
      businessName: pageData.businessName,
      contactEmail: pageData.contactEmail,
      pagespeed: pagespeedResults,
      techStack: {
        ...pageData.techStack,
        analytics: [],
        cdn: [],
        hosting: [],
        programming: [],
        all: []
      },
      chatbots: {
        detected: pageData.hasChatbot || networkResults.chatbots.length > 0,
        providers: networkResults.chatbots,
        isAIPowered: networkResults.chatbots.some(p => 
          ['Intercom', 'Drift', 'HubSpot'].includes(p)
        ),
        networkEndpoints: networkResults.chatbots,
      },
      socialBots: {
        detected: pageData.socialBots.whatsapp || pageData.socialBots.messenger,
        platforms: [
          ...(pageData.socialBots.whatsapp ? ['WhatsApp'] : []),
          ...(pageData.socialBots.messenger ? ['Facebook Messenger'] : [])
        ],
      },
      voiceAssistant: {
        detected: false,
        implementation: [],
      },
      designAnalysis: designResults,
      problems: { critical: [], important: [], minor: [] },
      opportunities: { webServices: [], aiServices: [], estimatedValue: 0 },
    };
    
    const analysis = analyzeResults(comprehensiveResults);
    comprehensiveResults.problems = analysis.problems;
    comprehensiveResults.opportunities = analysis.opportunities;
    
    printSummary(comprehensiveResults);
    
    return comprehensiveResults;
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    if (browser) await browser.close();
    throw error;
  }
}

// ============================================
// NETWORK MONITORING
// ============================================

function setupNetworkMonitoring(page: Page) {
  const chatbotEndpoints = new Set<string>();
  
  const providers: Record<string, string[]> = {
    'Intercom': ['intercom.io'],
    'Tidio': ['tidio.com'],
    'Drift': ['drift.com'],
    'Crisp': ['crisp.chat'],
    'Tawk.to': ['tawk.to'],
    'LiveChat': ['livechatinc.com'],
    'Zendesk': ['zendesk.com'],
    'HubSpot': ['hubspot.com'],
  };
  
  page.setRequestInterception(true).catch(() => {});
  
  page.on('request', (request) => {
    try {
      const url = request.url().toLowerCase();
      for (const [provider, domains] of Object.entries(providers)) {
        if (domains.some(d => url.includes(d))) {
          chatbotEndpoints.add(provider);
        }
      }
      request.continue();
    } catch (e) {
      // Request already handled
    }
  });
  
  return {
    getResults: () => ({
      chatbots: Array.from(chatbotEndpoints)
    })
  };
}

// ============================================
// PAGESPEED INSIGHTS
// ============================================

async function runPageSpeedInsights(url: string) {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('PageSpeed API error');
    
    const data = await response.json();
    const categories = data.lighthouseResult?.categories || {};
    
    return {
      seo: Math.round((categories.seo?.score || 0) * 100),
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      issues: [],
      opportunities: [],
    };
  } catch (error) {
    console.error('PageSpeed failed:', error);
    return {
      seo: 0,
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      issues: ['Could not run PageSpeed'],
      opportunities: [],
    };
  }
}

// ============================================
// GEMINI VISION
// ============================================

async function analyzeDesignWithGemini(screenshot: string, url: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Analyze this website screenshot. Provide scores (1-10) and respond ONLY with JSON:
{
  "layoutQuality": 8,
  "colorScheme": 7,
  "typography": 6,
  "visualHierarchy": 7,
  "modernityScore": 7,
  "rating": "Good",
  "feedback": ["Issue 1"],
  "strengths": ["Strength 1"],
  "recommendations": ["Rec 1"]
}`;
    
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: screenshot, mimeType: 'image/png' } }
    ]);
    
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis = JSON.parse(text);
    const overallScore = Math.round(
      (analysis.layoutQuality + analysis.colorScheme + 
       analysis.typography + analysis.visualHierarchy + 
       analysis.modernityScore) / 5
    );
    
    return { ...analysis, overallScore };
  } catch (error) {
    return getDefaultDesignAnalysis();
  }
}

function getDefaultDesignAnalysis() {
  return {
    layoutQuality: 6,
    colorScheme: 6,
    typography: 6,
    visualHierarchy: 6,
    modernityScore: 6,
    overallScore: 6,
    rating: 'Fair',
    feedback: ['Design analysis not available'],
    strengths: [],
    recommendations: ['Enable Gemini Vision for analysis'],
  };
}

// ============================================
// ANALYSIS
// ============================================

function analyzeResults(results: ComprehensiveAnalysis) {
  const problems = {
    critical: [] as string[],
    important: [] as string[],
    minor: [] as string[],
  };
  
  const opportunities = {
    webServices: [] as string[],
    aiServices: [] as string[],
    estimatedValue: 0,
  };
  
  if (results.pagespeed.seo < 50) {
    problems.critical.push(`Poor SEO (${results.pagespeed.seo}/100)`);
    opportunities.webServices.push('SEO Optimization Package');
  }
  
  if (results.pagespeed.performance < 50) {
    problems.critical.push(`Poor Performance (${results.pagespeed.performance}/100)`);
    opportunities.webServices.push('Performance Optimization');
  }
  
  if (!results.chatbots.detected) {
    problems.minor.push('No Chatbot');
    opportunities.aiServices.push('AI Chatbot Integration');
  }
  
  const pricing: Record<string, number> = {
    'SEO Optimization Package': 5000,
    'Performance Optimization': 4000,
    'AI Chatbot Integration': 10000,
  };
  
  opportunities.estimatedValue = [...opportunities.webServices, ...opportunities.aiServices]
    .reduce((sum, service) => sum + (pricing[service] || 0), 0);
  
  return { problems, opportunities };
}

function printSummary(results: ComprehensiveAnalysis) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 ANALYSIS COMPLETE');
  console.log('='.repeat(80));
  console.log(`SEO: ${results.pagespeed.seo}/100`);
  console.log(`Performance: ${results.pagespeed.performance}/100`);
  console.log(`Chatbot: ${results.chatbots.detected ? '✓ ' + results.chatbots.providers.join(', ') : '✗ None'}`);
  console.log(`Value: $${results.opportunities.estimatedValue.toLocaleString()}`);
  console.log('='.repeat(80) + '\n');
}

export { analyzeResults, printSummary };