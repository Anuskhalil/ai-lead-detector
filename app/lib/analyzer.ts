// lib/analyzer.ts - PRODUCTION-GRADE ACCURATE ANALYZER
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
// MAIN ANALYZER - PRODUCTION GRADE
// ============================================

export async function comprehensiveAIAnalysis(url: string): Promise<ComprehensiveAnalysis> {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 PRODUCTION-GRADE WEBSITE ANALYSIS');
  console.log('='.repeat(80));
  console.log(`🌐 URL: ${url}\n`);
  
  let browser: Browser | null = null;
  
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('📌 Step 1/6: Launching Browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
    });

    const page = await browser.newPage();
    
    // Set realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1920, height: 1080 });
    
    // ============================================
    // NETWORK MONITORING - Start BEFORE page load
    // ============================================
    console.log('📌 Step 2/6: Setting up Network Monitoring...');
    const networkMonitor = new NetworkMonitor();
    await networkMonitor.setup(page);
    
    // ============================================
    // LOAD PAGE
    // ============================================
    console.log('📌 Step 3/6: Loading page (max 60s)...');
    
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
    } catch (error) {
      console.log('⚠️ Page load timeout, continuing with partial load...');
    }
    
    // Wait for dynamic content to load
    console.log('⏳ Waiting for dynamic content (8 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // ============================================
    // COMPREHENSIVE PAGE ANALYSIS
    // ============================================
    console.log('📌 Step 4/6: Analyzing page content...');
    
    const pageData = await page.evaluate(() => {
      // Helper function - CRITICAL for accuracy
      function isVisible(el: Element | null): boolean {
        if (!el || !(el instanceof HTMLElement)) return false;
        
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          rect.width > 0 &&
          rect.height > 0 &&
          el.offsetParent !== null
        );
      }

      const html = document.documentElement.outerHTML;
      const htmlLower = html.toLowerCase();
      const bodyText = document.body.innerText;
      const bodyTextLower = bodyText.toLowerCase();
      
      console.log('🔍 Starting comprehensive detection...');
      
      // ==========================================
      // 1. TECH STACK DETECTION (Multi-Method)
      // ==========================================
      const frameworks: string[] = [];
      const cms: string[] = [];
      const cssFrameworks: string[] = [];
      
      // React Detection (5 methods)
      if (
        (window as any).React ||
        (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        document.querySelector('[data-reactroot]') ||
        document.querySelector('[data-reactid]') ||
        htmlLower.includes('react') ||
        htmlLower.includes('_jsx')
      ) {
        frameworks.push('React');
        console.log('✓ React detected');
      }
      
      // Next.js Detection (4 methods)
      if (
        (window as any).__NEXT_DATA__ ||
        document.querySelector('#__next') ||
        htmlLower.includes('_next/static') ||
        htmlLower.includes('__next_data__')
      ) {
        frameworks.push('Next.js');
        console.log('✓ Next.js detected');
      }
      
      // Vue.js Detection
      if (
        (window as any).Vue ||
        (window as any).__VUE__ ||
        document.querySelector('[data-v-]') ||
        htmlLower.includes('vue.js') ||
        htmlLower.includes('vue.min.js')
      ) {
        frameworks.push('Vue.js');
        console.log('✓ Vue.js detected');
      }
      
      // Angular Detection
      if (
        (window as any).ng ||
        (window as any).angular ||
        document.querySelector('[ng-version]') ||
        document.querySelector('[ng-app]') ||
        htmlLower.includes('angular.js') ||
        htmlLower.includes('angular.min.js')
      ) {
        frameworks.push('Angular');
        console.log('✓ Angular detected');
      }
      
      // WordPress Detection (6 methods)
      if (
        htmlLower.includes('wp-content') ||
        htmlLower.includes('wp-includes') ||
        htmlLower.includes('wordpress') ||
        document.querySelector('meta[name="generator"][content*="WordPress"]') ||
        document.querySelector('link[href*="/wp-content/"]') ||
        document.querySelector('script[src*="/wp-content/"]')
      ) {
        cms.push('WordPress');
        console.log('✓ WordPress detected');
      }
      
      // Shopify Detection
      if (
        (window as any).Shopify ||
        htmlLower.includes('cdn.shopify.com') ||
        htmlLower.includes('shopify.com/s/files') ||
        document.querySelector('script[src*="shopify"]')
      ) {
        cms.push('Shopify');
        console.log('✓ Shopify detected');
      }
      
      // Wix Detection
      if (
        htmlLower.includes('wixstatic.com') ||
        htmlLower.includes('parastorage.com') ||
        (window as any).wixBiSession ||
        document.querySelector('[data-wix-context]')
      ) {
        cms.push('Wix');
        console.log('✓ Wix detected');
      }
      
      // Webflow Detection
      if (
        htmlLower.includes('webflow') ||
        document.querySelector('[data-wf-page]') ||
        document.querySelector('[data-wf-site]')
      ) {
        cms.push('Webflow');
        console.log('✓ Webflow detected');
      }
      
      // Squarespace Detection
      if (
        htmlLower.includes('squarespace') ||
        document.querySelector('meta[name="generator"][content*="Squarespace"]')
      ) {
        cms.push('Squarespace');
        console.log('✓ Squarespace detected');
      }
      
      // Bootstrap Detection
      if (
        htmlLower.includes('bootstrap') ||
        (document.querySelector('.container') && document.querySelector('.row')) ||
        document.querySelector('[class*="col-"]')
      ) {
        cssFrameworks.push('Bootstrap');
        console.log('✓ Bootstrap detected');
      }
      
      // Tailwind CSS Detection (improved)
      const tailwindClasses = ['flex', 'grid', 'bg-', 'text-', 'p-', 'm-', 'w-', 'h-'];
      const hasTailwind = Array.from(document.querySelectorAll('*')).some(el => {
        const classes = el.className;
        if (typeof classes !== 'string') return false;
        return tailwindClasses.some(tw => classes.includes(tw));
      });
      
      if (hasTailwind && !htmlLower.includes('bootstrap')) {
        cssFrameworks.push('Tailwind CSS');
        console.log('✓ Tailwind CSS detected');
      }
      
      // ==========================================
      // 2. SEO DETECTION
      // ==========================================
      const title = document.querySelector('title');
      const metaDesc = document.querySelector('meta[name="description"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const viewport = document.querySelector('meta[name="viewport"]');
      const canonical = document.querySelector('link[rel="canonical"]');
      
      let seoScore = 0;
      if (title?.textContent?.trim()) seoScore += 20;
      if (metaDesc?.getAttribute('content')?.trim()) seoScore += 20;
      if (ogTitle && ogDesc) seoScore += 20;
      if (viewport) seoScore += 20;
      if (canonical) seoScore += 20;
      
      console.log(`📊 SEO Score: ${seoScore}/100`);
      
      // ==========================================
      // 3. CHATBOT DETECTION - COMPREHENSIVE!
      // ==========================================
      console.log('🤖 Starting chatbot detection...');
      
      const chatbotSelectors = [
        // Tidio
        '#tidio-chat', '.tidio-chat', '#tidio-chat-iframe', '.tidio-iframe',
        // Intercom
        '#intercom-container', '.intercom-messenger', '#intercom-frame',
        '.intercom-launcher', '.intercom-launcher-frame',
        // Drift
        '#drift-widget', '.drift-frame', '#drift-frame-chat',
        '.drift-widget-container', '#drift-widget-container',
        // Crisp
        '.crisp-client', '#crisp-chatbox', '.crisp-1nqmh41',
        // Tawk.to
        '#tawkchat-container', '.tawk-min-container', '.tawk-button',
        // LiveChat
        '#chat-widget-container', '#chat-widget', '.chat-widget',
        // Zendesk
        '#launcher', '.zEWidget-launcher', 'iframe[title*="Messaging"]',
        // HubSpot
        '#hubspot-messages-iframe-container', '#hubspot-messages-iframe',
        // Freshchat
        '#fc_frame', '#fc_widget', '.fc-widget',
        // Olark
        '#olark-box', '#olark',
        // Generic
        '[class*="chatbot"]', '[id*="chatbot"]',
        '[class*="chat-widget"]', '[id*="chat-widget"]',
        '[class*="live-chat"]', '[id*="livechat"]',
        '.chat-bubble', '.chat-button', '#chat-button'
      ];
      
      let visualChatbotDetected = false;
      const detectedChatbotElements: string[] = [];
      
      for (const selector of chatbotSelectors) {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (isVisible(el)) {
              visualChatbotDetected = true;
              detectedChatbotElements.push(selector);
              console.log(`✓ Chatbot element found: ${selector}`);
            }
          });
        } catch (e) {
          // Continue checking
        }
      }
      
      // Check for chatbot iframes
      const iframes = Array.from(document.querySelectorAll('iframe'));
      const chatbotIframes = iframes.filter(iframe => {
        const src = iframe.src?.toLowerCase() || '';
        const title = iframe.title?.toLowerCase() || '';
        return (
          src.includes('tidio') ||
          src.includes('intercom') ||
          src.includes('drift') ||
          src.includes('crisp') ||
          src.includes('tawk') ||
          src.includes('livechat') ||
          src.includes('zendesk') ||
          src.includes('hubspot') ||
          src.includes('freshchat') ||
          src.includes('olark') ||
          title.includes('chat') ||
          title.includes('messaging')
        );
      });
      
      if (chatbotIframes.length > 0) {
        visualChatbotDetected = true;
        console.log(`✓ Found ${chatbotIframes.length} chatbot iframe(s)`);
      }
      
      // Check window objects
      const chatbotWindowObjects = [
        'tidioChatApi', 'Intercom', 'drift', 'Crisp',
        'Tawk_API', 'LiveChatWidget', 'zE', 'fcWidget',
        'olark', '$zopim', 'HubSpotConversations'
      ];
      
      const foundWindowObjects = chatbotWindowObjects.filter(obj => 
        (window as any)[obj] !== undefined
      );
      
      if (foundWindowObjects.length > 0) {
        visualChatbotDetected = true;
        console.log(`✓ Found chatbot window objects: ${foundWindowObjects.join(', ')}`);
      }
      
      console.log(`🤖 Visual Chatbot Detection: ${visualChatbotDetected ? 'YES' : 'NO'}`);
      
      // ==========================================
      // 4. SOCIAL BOTS DETECTION
      // ==========================================
      const socialBots = {
        whatsapp: false,
        messenger: false,
        telegram: false
      };
      
      // WhatsApp
      const whatsappLinks = Array.from(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp.com"]'));
      if (whatsappLinks.some(el => isVisible(el))) {
        socialBots.whatsapp = true;
        console.log('✓ WhatsApp detected');
      }
      
      // Facebook Messenger
      const messengerWidget = document.querySelector('.fb-customerchat');
      if (messengerWidget && isVisible(messengerWidget)) {
        socialBots.messenger = true;
        console.log('✓ Facebook Messenger detected');
      }
      
      // Telegram
      const telegramLinks = Array.from(document.querySelectorAll('a[href*="t.me"], a[href*="telegram.me"]'));
      if (telegramLinks.some(el => isVisible(el))) {
        socialBots.telegram = true;
        console.log('✓ Telegram detected');
      }
      
      // ==========================================
      // 5. RESPONSIVE DESIGN CHECK
      // ==========================================
      const hasViewportMeta = !!viewport;
      const hasMediaQueries = htmlLower.includes('@media') || htmlLower.includes('media query');
      const hasResponsiveFramework = cssFrameworks.length > 0;
      
      const isResponsive = hasViewportMeta || hasMediaQueries || hasResponsiveFramework;
      console.log(`📱 Responsive Design: ${isResponsive ? 'YES' : 'NO'}`);
      
      // ==========================================
      // 6. BUSINESS INFO
      // ==========================================
      const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
      const ogTitleContent = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const titleText = document.querySelector('title')?.textContent;
      
      const businessName = siteName || 
                          ogTitleContent?.split('|')[0]?.trim() ||
                          ogTitleContent?.split('-')[0]?.trim() ||
                          titleText?.split('|')[0]?.trim() ||
                          titleText?.split('-')[0]?.trim() ||
                          '';
      
      // Email extraction
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const allEmails = bodyText.match(emailRegex) || [];
      const validEmails = allEmails.filter(e => 
        !e.includes('example.com') && 
        !e.includes('test.com') &&
        !e.includes('sentry.io') &&
        !e.includes('wixpress.com') &&
        e.length < 50
      );
      
      const contactEmail = validEmails.find(e => 
        e.includes('contact') || 
        e.includes('info') || 
        e.includes('hello') ||
        e.includes('support') ||
        e.includes('sales')
      ) || validEmails[0];
      
      console.log('✅ Page analysis complete');
      
      return {
        businessName: businessName.substring(0, 100),
        contactEmail,
        seoScore,
        isResponsive,
        techStack: { frameworks, cms, cssFrameworks },
        visualChatbot: {
          detected: visualChatbotDetected,
          elements: detectedChatbotElements,
          iframes: chatbotIframes.length,
          windowObjects: foundWindowObjects
        },
        socialBots
      };
    });
    
    // ============================================
    // GET NETWORK DETECTION RESULTS
    // ============================================
    console.log('📌 Step 5/6: Processing network detection...');
    const networkResults = networkMonitor.getResults();
    
    // Combine visual + network chatbot detection
    const allChatbotDetected = pageData.visualChatbot.detected || (networkResults.chatbots && networkResults.chatbots.length > 0);
    const allChatbotProviders = Array.from(
      (Array.isArray(networkResults.chatbots) ? networkResults.chatbots : [])
        .concat(Array.isArray(pageData.visualChatbot.windowObjects) ? pageData.visualChatbot.windowObjects : [])
        .filter((v, i, arr) => arr.indexOf(v) === i)
    );

    console.log(`\n🤖 FINAL CHATBOT DETECTION:`);
    console.log(`   Visual Detection: ${pageData.visualChatbot.detected ? 'YES' : 'NO'}`);
    console.log(
      `   Network Detection: ${
        networkResults.chatbots && networkResults.chatbots.length > 0
          ? 'YES (' + networkResults.chatbots.join(', ') + ')'
          : 'NO'
      }`
    );
    console.log(`   FINAL RESULT: ${allChatbotDetected ? 'CHATBOT DETECTED ✓' : 'NO CHATBOT ✗'}`);
    
    // ============================================
    // PAGESPEED INSIGHTS (Optional - can fail)
    // ============================================
    console.log('📌 Step 6/6: Running PageSpeed Insights...');
    const pagespeedResults = await runPageSpeedInsights(url);
    
    // ============================================
    // GEMINI VISION (Optional)
    // ============================================
    let designResults = getDefaultDesignAnalysis();
    if (process.env.GOOGLE_AI_API_KEY) {
      try {
        console.log('🎨 Analyzing design with Gemini Vision...');
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
    
    // ============================================
    // COMBINE ALL RESULTS
    // ============================================
    const comprehensiveResults: ComprehensiveAnalysis = {
      url,
      businessName: pageData.businessName,
      contactEmail: pageData.contactEmail,
      
      pagespeed: {
        ...pagespeedResults,
        seo: pageData.seoScore, // Use our own SEO score which is more accurate
      },
      
      techStack: {
        ...pageData.techStack,
        analytics: [],
        cdn: [],
        hosting: [],
        programming: [],
        all: []
      },
      
      chatbots: {
        detected: allChatbotDetected,
        providers: allChatbotProviders,
        isAIPowered: allChatbotProviders.some(p => 
          ['Intercom', 'Drift', 'HubSpot', 'Freshchat', 'Zendesk'].includes(p)
        ),
        networkEndpoints: networkResults.chatbots,
      },
      
      socialBots: {
        detected: pageData.socialBots.whatsapp || pageData.socialBots.messenger || pageData.socialBots.telegram,
        platforms: [
          ...(pageData.socialBots.whatsapp ? ['WhatsApp'] : []),
          ...(pageData.socialBots.messenger ? ['Facebook Messenger'] : []),
          ...(pageData.socialBots.telegram ? ['Telegram'] : [])
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
    
    // Analyze problems and opportunities
    const analysis = analyzeResults(comprehensiveResults, pageData.isResponsive);
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
// NETWORK MONITOR CLASS
// ============================================

class NetworkMonitor {
  private chatbotEndpoints: Set<string> = new Set();
  
  private chatbotProviders: Record<string, string[]> = {
    'Intercom': ['intercom.io', 'intercom.com'],
    'Tidio': ['tidio.com', 'tidiochat.com'],
    'Drift': ['drift.com', 'driftt.com'],
    'Crisp': ['crisp.chat', 'crisp.help'],
    'Tawk.to': ['tawk.to', 'tawkto.com'],
    'LiveChat': ['livechatinc.com', 'livechat.com'],
    'Zendesk': ['zendesk.com', 'zdassets.com'],
    'Freshchat': ['freshchat.com', 'freshworks.com'],
    'HubSpot': ['hubspot.com', 'hubspotusercontent'],
    'Olark': ['olark.com'],
  };
  
  async setup(page: Page) {
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      try {
        const url = request.url().toLowerCase();
        
        for (const [provider, domains] of Object.entries(this.chatbotProviders)) {
          if (domains.some(d => url.includes(d))) {
            this.chatbotEndpoints.add(provider);
            console.log(`🌐 Network: ${provider} API call detected`);
          }
        }
        
        request.continue();
      } catch (e) {
        // Request already handled
      }
    });
  }
  
  getResults() {
    return {
      chatbots: Array.from(this.chatbotEndpoints)
    };
  }
}

// ============================================
// PAGESPEED INSIGHTS
// ============================================

async function runPageSpeedInsights(url: string) {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('PageSpeed API error');
    
    const data = await response.json();
    const categories = data.lighthouseResult?.categories || {};
    
    console.log('✓ PageSpeed Insights completed');
    
    return {
      seo: 0, // We use our own SEO detection
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      issues: [],
      opportunities: [],
    };
  } catch (error) {
    console.log('⚠️ PageSpeed Insights skipped (timeout or unavailable)');
    return {
      seo: 0,
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      issues: [],
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
    
    console.log('✓ Gemini Vision analysis completed');
    
    return { ...analysis, overallScore };
  } catch (error) {
    return getDefaultDesignAnalysis();
  }
}

function getDefaultDesignAnalysis() {
  return {
    layoutQuality: 7,
    colorScheme: 7,
    typography: 7,
    visualHierarchy: 7,
    modernityScore: 7,
    overallScore: 7,
    rating: 'Good',
    feedback: [],
    strengths: [],
    recommendations: [],
  };
}

// ============================================
// ANALYSIS
// ============================================

function analyzeResults(results: ComprehensiveAnalysis, isResponsive: boolean) {
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
  
  // SEO Issues
  if (results.pagespeed.seo < 40) {
    problems.critical.push(`Critical SEO Issues (${results.pagespeed.seo}/100)`);
    opportunities.webServices.push('SEO Optimization Package');
  } else if (results.pagespeed.seo < 70) {
    problems.important.push(`SEO Needs Improvement (${results.pagespeed.seo}/100)`);
    opportunities.webServices.push('SEO Enhancement');
  }
  
  // Performance Issues
  if (results.pagespeed.performance < 50 && results.pagespeed.performance > 0) {
    problems.critical.push(`Poor Performance (${results.pagespeed.performance}/100)`);
    opportunities.webServices.push('Performance Optimization');
  }
  
  // Responsive Design
  if (!isResponsive) {
    problems.critical.push('Not Mobile Responsive');
    opportunities.webServices.push('Responsive Design Implementation');
  }
  
  // Chatbot
  if (!results.chatbots.detected) {
    problems.minor.push('No Chatbot - Missing 24/7 Support');
    opportunities.aiServices.push('AI Chatbot Integration');
  } else if (!results.chatbots.isAIPowered) {
    opportunities.aiServices.push('Upgrade to AI-Powered Chatbot');
  }
  
  // Social Bots
  if (!results.socialBots.detected) {
    opportunities.aiServices.push('Social Media Bot Integration');
  }
  
  const pricing: Record<string, number> = {
    'SEO Optimization Package': 5000,
    'SEO Enhancement': 3000,
    'Performance Optimization': 4000,
    'Responsive Design Implementation': 6000,
    'AI Chatbot Integration': 10000,
    'Upgrade to AI-Powered Chatbot': 5000,
    'Social Media Bot Integration': 5000,
  };
  
  opportunities.estimatedValue = [...opportunities.webServices, ...opportunities.aiServices]
    .reduce((sum, service) => sum + (pricing[service] || 0), 0);
  
  return { problems, opportunities };
}

function printSummary(results: ComprehensiveAnalysis) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 ANALYSIS COMPLETE');
  console.log('='.repeat(80));
  console.log(`\n✅ Business: ${results.businessName || 'Unknown'}`);
  console.log(`📧 Email: ${results.contactEmail || 'Not found'}`);
  console.log(`\n📊 SCORES:`);
  console.log(`   SEO: ${results.pagespeed.seo}/100`);
  console.log(`   Performance: ${results.pagespeed.performance}/100`);
  console.log(`   Design: ${results.designAnalysis.overallScore}/10`);
  console.log(`\n⚙️ TECH STACK:`);
  if (results.techStack.frameworks.length > 0) {
    console.log(`   Frameworks: ${results.techStack.frameworks.join(', ')}`);
  }
  if (results.techStack.cms.length > 0) {
    console.log(`   CMS: ${results.techStack.cms.join(', ')}`);
  }
  if (results.techStack.cssFrameworks.length > 0) {
    console.log(`   CSS: ${results.techStack.cssFrameworks.join(', ')}`);
  }
  console.log(`\n🤖 AI DETECTION:`);
  console.log(`   Chatbot: ${results.chatbots.detected ? '✓ YES (' + results.chatbots.providers.join(', ') + ')' : '✗ NO'}`);
  console.log(`   Social Bots: ${results.socialBots.detected ? '✓ YES (' + results.socialBots.platforms.join(', ') + ')' : '✗ NO'}`);
  console.log(`\n💰 OPPORTUNITIES:`);
  console.log(`   Estimated Value: $${results.opportunities.estimatedValue.toLocaleString()}`);
  console.log('='.repeat(80) + '\n');
}

export { analyzeResults, printSummary };