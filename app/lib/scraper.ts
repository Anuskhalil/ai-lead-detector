// lib/scraper.ts - ENHANCED VERSION with better detection

import puppeteer, { Browser } from 'puppeteer';

export interface ScrapedData {
  url: string;
  businessName?: string;
  contactEmail?: string;
  seoTagsPresent: boolean;
  isMobileResponsive: boolean;
  techStack: string[];
  hasChatbot: boolean;
  hasVoiceAssistant: boolean;
  hasSocialBot: boolean;
}

/**
 * Enhanced website scraper with better detection accuracy
 */
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  let browser: Browser | null = null;
  
  try {
    console.log(`🔍 Starting enhanced scrape of: ${url}`);
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
      ],
    });

    const page = await browser.newPage();
    
    // Set realistic user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📄 Loading page...');
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 45000  // Increased timeout
    });

    // Wait a bit for dynamic content and chatbots to load
    await new Promise(res => setTimeout(res, 3000));

    console.log('🔬 Analyzing page with enhanced detection...');
    
    const scrapedData = await page.evaluate(() => {
      // ============================================
      // 1. SEO TAGS DETECTION
      // ============================================
      const hasTitleTag = !!document.querySelector('title')?.textContent;
      const hasMetaDescription = !!document.querySelector('meta[name="description"]');
      const hasOgTitle = !!document.querySelector('meta[property="og:title"]');
      const hasOgDescription = !!document.querySelector('meta[property="og:description"]');
      
      const seoTagsPresent = hasTitleTag && (hasMetaDescription || hasOgTitle);

      // ============================================
      // 2. MOBILE RESPONSIVENESS
      // ============================================
      const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
      const isMobileResponsive = hasViewportMeta;

      // ============================================
      // 3. ENHANCED TECH STACK DETECTION
      // ============================================
      const techStack: string[] = [];
      
      // React
      if (document.querySelector('[data-reactroot], [data-reactid]') || 
          (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
          (window as any).React) {
        techStack.push('React');
      }
      
      // Next.js
      if (document.querySelector('#__next') || 
          (window as any).__NEXT_DATA__ ||
          document.querySelector('[data-nextjs-scroll-focus-boundary]')) {
        techStack.push('Next.js');
      }
      
      // WordPress
      if (document.querySelector('meta[name="generator"][content*="WordPress"]') ||
          document.querySelector('link[href*="wp-content"]') ||
          document.querySelector('script[src*="wp-includes"]') ||
          document.body.className.includes('wp-')) {
        techStack.push('WordPress');
      }
      
      // Vue.js
      if (document.querySelector('[data-v-]') || 
          (window as any).__VUE__ ||
          (window as any).Vue) {
        techStack.push('Vue.js');
      }
      
      // Angular
      if (document.querySelector('[ng-version]') || 
          (window as any).ng ||
          (window as any).angular) {
        techStack.push('Angular');
      }

      // jQuery
      if ((window as any).jQuery || (window as any).$) {
        techStack.push('jQuery');
      }

      // Shopify
      if ((window as any).Shopify || 
          document.querySelector('meta[name="shopify-checkout-api-token"]')) {
        techStack.push('Shopify');
      }

      // Wix
      if (document.querySelector('meta[name="generator"][content*="Wix"]') ||
          (window as any).wixBiSession) {
        techStack.push('Wix');
      }

      if (techStack.length === 0) {
        techStack.push('HTML/CSS/JS');
      }

      // ============================================
      // 4. ENHANCED CHATBOT DETECTION
      // ============================================
      const bodyHTML = document.body.innerHTML.toLowerCase();
      const bodyText = document.body.innerText.toLowerCase();
      
      // Comprehensive list of chatbot services and indicators
      const chatbotIndicators = [
        // Popular chatbot services
        'tidio', 'tidiochat', 'intercom', 'drift', 'crisp', 'tawk.to', 'tawk',
        'livechat', 'zendesk', 'freshchat', 'olark', 'userlike', 'purechat',
        'smartsupp', 'chatra', 'helpcrunch', 'kayako', 'liveperson',
        
        // AI chatbot platforms
        'dialogflow', 'botpress', 'landbot', 'chatfuel', 'manychat',
        'mobilemonkey', 'chatbot', 'bot-framework', 'rasa',
        
        // Generic chatbot elements
        'chat-widget', 'chat-bubble', 'chat-icon', 'chat-launcher',
        'live-chat', 'livechat', 'support-chat', 'chat-container',
        
        // Widget-specific classes and IDs
        'webchat', 'messenger-plugin', 'fb-customerchat', 'gorgias-chat',
        'helpscout-beacon', 'reamaze', 'acquire', 'livehelpnow'
      ];

      // Check HTML for chatbot indicators
      let hasChatbot = chatbotIndicators.some(indicator => 
        bodyHTML.includes(indicator)
      );

      // Additional checks for chatbot iframes and widgets
      if (!hasChatbot) {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        hasChatbot = iframes.some(iframe => {
          const src = iframe.src?.toLowerCase() || '';
          return chatbotIndicators.some(indicator => src.includes(indicator));
        });
      }

      // Check for chatbot scripts
      if (!hasChatbot) {
        const scripts = Array.from(document.querySelectorAll('script'));
        hasChatbot = scripts.some(script => {
          const src = script.src?.toLowerCase() || '';
          const content = script.textContent?.toLowerCase() || '';
          return chatbotIndicators.some(indicator => 
            src.includes(indicator) || content.includes(indicator)
          );
        });
      }

      // Check for chatbot divs and containers
      if (!hasChatbot) {
        const divs = Array.from(document.querySelectorAll('div, aside, section'));
        hasChatbot = divs.some(div => {
          const className = div.className?.toLowerCase() || '';
          const id = div.id?.toLowerCase() || '';
          return chatbotIndicators.some(indicator => 
            className.includes(indicator) || id.includes(indicator)
          );
        });
      }

      // Check window objects
      if (!hasChatbot) {
        const windowKeys = Object.keys(window).join(' ').toLowerCase();
        hasChatbot = chatbotIndicators.some(indicator => 
          windowKeys.includes(indicator)
        );
      }

      // ============================================
      // 5. ENHANCED SOCIAL MEDIA BOT DETECTION
      // ============================================
      const socialBotIndicators = [
        // Social media bot platforms
        'manychat', 'chatfuel', 'mobilemonkey', 'botsify', 'chattypeople',
        
        // Facebook Messenger
        'fb-customerchat', 'fb-messengermessageus', 'fb_customer_chat_code',
        'messenger-plugin', 'facebook-messenger', 'fb-messenger',
        
        // Instagram
        'instagram-chat', 'ig-messaging',
        
        // WhatsApp
        'whatsapp-chat', 'whatsapp-widget', 'wa.me', 'whatsapp-button',
        
        // Telegram
        'telegram-bot', 't.me',
        
        // Twitter/X
        'twitter-dm', 'x-messaging'
      ];

      let hasSocialBot = socialBotIndicators.some(indicator => 
        bodyHTML.includes(indicator)
      );

      // Check for messenger data attributes
      if (!hasSocialBot) {
        hasSocialBot = !!document.querySelector('[data-messenger-id]') ||
                       !!document.querySelector('[data-facebook-messenger]') ||
                       !!document.querySelector('.fb-customerchat') ||
                       !!document.querySelector('.whatsapp-widget');
      }

      // Check for social media links with messaging
      if (!hasSocialBot) {
        const links = Array.from(document.querySelectorAll('a'));
        hasSocialBot = links.some(link => {
          const href = link.href?.toLowerCase() || '';
          return href.includes('m.me/') || 
                 href.includes('wa.me/') || 
                 href.includes('t.me/') ||
                 href.includes('facebook.com/messages/');
        });
      }

      // ============================================
      // 6. ENHANCED VOICE ASSISTANT DETECTION
      // ============================================
      const voiceIndicators = [
        'speechrecognition', 'webkitspeechrecognition', 'speech-recognition',
        'voice-assistant', 'voice-search', 'voice-command', 'voice-control',
        'voice-input', 'speech-input', 'siri', 'alexa-skill', 'google-assistant',
        'voice-bot', 'speech-to-text', 'voice-enabled'
      ];

      let hasVoiceAssistant = voiceIndicators.some(indicator => 
        bodyHTML.includes(indicator)
      );

      // Check for voice API usage
      if (!hasVoiceAssistant) {
        hasVoiceAssistant = !!(window as any).SpeechRecognition || 
                           !!(window as any).webkitSpeechRecognition;
      }

      // ============================================
      // 7. ENHANCED BUSINESS NAME EXTRACTION
      // ============================================
      let businessName = '';
      
      // Try multiple sources for business name
      const titleTag = document.querySelector('title')?.textContent || '';
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const h1 = document.querySelector('h1')?.textContent || '';
      const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
      
      businessName = siteName || 
                     ogTitle.split('|')[0]?.trim() || 
                     titleTag.split('|')[0]?.trim() || 
                     titleTag.split('-')[0]?.trim() ||
                     h1.trim() ||
                     '';

      // Clean up business name
      businessName = businessName.replace(/home|homepage|welcome/gi, '').trim();

      // ============================================
      // 8. ENHANCED EMAIL EXTRACTION
      // ============================================
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      
      // Search in HTML
      const htmlEmails = bodyHTML.match(emailRegex) || [];
      
      // Search in visible text
      const textEmails = bodyText.match(emailRegex) || [];
      
      // Combine and deduplicate
      const allEmails = [...new Set([...htmlEmails, ...textEmails])];
      
      // Filter out common false positives
      const filteredEmails = allEmails.filter(email => 
        !email.includes('example.com') &&
        !email.includes('test.com') &&
        !email.includes('yoursite.com') &&
        !email.includes('yourdomain.com') &&
        !email.includes('sentry.io') &&
        !email.includes('wixpress.com')
      );
      
      // Prioritize contact-related emails
      const contactEmail = filteredEmails.find(email => 
        email.toLowerCase().includes('contact') ||
        email.toLowerCase().includes('info') ||
        email.toLowerCase().includes('hello') ||
        email.toLowerCase().includes('support') ||
        email.toLowerCase().includes('sales')
      ) || filteredEmails[0];

      return {
        seoTagsPresent,
        isMobileResponsive,
        techStack,
        hasChatbot,
        hasVoiceAssistant,
        hasSocialBot,
        businessName,
        contactEmail,
      };
    });

    await browser.close();
    console.log('✅ Enhanced scraping complete!');
    console.log('📊 Results:', {
      chatbot: scrapedData.hasChatbot ? '✓' : '✗',
      socialBot: scrapedData.hasSocialBot ? '✓' : '✗',
      voiceAssistant: scrapedData.hasVoiceAssistant ? '✓' : '✗',
    });

    return {
      url,
      ...scrapedData,
    };
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error(`❌ Error scraping ${url}:`, error);
    
    return {
      url,
      seoTagsPresent: false,
      isMobileResponsive: false,
      techStack: ['Unknown'],
      hasChatbot: false,
      hasVoiceAssistant: false,
      hasSocialBot: false,
    };
  }
}

/**
 * Enhanced Google Maps scraper
 */
export async function scrapeGoogleMaps(location: string): Promise<string[]> {
  let browser: Browser | null = null;
  
  try {
    console.log(`🗺️ Searching Google Maps for: ${location}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    await page.setViewport({ width: 1920, height: 1080 });
    
    const searchQuery = encodeURIComponent(location);
    await page.goto(`https://www.google.com/maps/search/${searchQuery}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for results
    await new Promise(res => setTimeout(res, 3000));

    // Scroll to load more results
    await page.evaluate(() => {
      const scrollContainer = document.querySelector('[role="feed"]');
      if (scrollContainer) {
        scrollContainer.scrollBy(0, 1000);
      }
    });

    await new Promise(res => setTimeout(res, 2000));

    // Extract websites
    const websites = await page.evaluate(() => {
      const links: string[] = [];
      
      // Find all business website links
      const linkElements = document.querySelectorAll('a[href*="http"]');
      
      linkElements.forEach((el) => {
        const href = el.getAttribute('href');
        if (href && 
            !href.includes('google.com') && 
            !href.includes('facebook.com') &&
            !href.includes('instagram.com') &&
            !href.includes('twitter.com') &&
            !href.includes('linkedin.com') &&
            !href.includes('youtube.com') &&
            !href.includes('yelp.com')) {
          
          // Clean up the URL (remove Google redirect)
          const cleanUrl = href.split('?')[0];
          links.push(cleanUrl);
        }
      });
      
      return Array.from(new Set(links)).slice(0, 10);
    });

    await browser.close();
    console.log(`✅ Found ${websites.length} unique business websites`);
    
    return websites;
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('❌ Error scraping Google Maps:', error);
    return [];
  }
}