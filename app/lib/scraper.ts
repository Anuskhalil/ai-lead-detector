// lib/scraper.ts

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
 * Scrape a single website
 */
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  let browser: Browser | null = null;
  
  try {
    console.log(`🔍 Starting scrape of: ${url}`);
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📄 Loading page...');
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('🔬 Analyzing page...');
    
    const scrapedData = await page.evaluate(() => {
      // SEO Detection
      const hasTitleTag = !!document.querySelector('title')?.textContent;
      const hasMetaDescription = !!document.querySelector('meta[name="description"]');
      const seoTagsPresent = hasTitleTag && hasMetaDescription;

      // Mobile Responsiveness
      const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
      const isMobileResponsive = hasViewportMeta;

      // Tech Stack Detection
      const techStack: string[] = [];
      
      if (document.querySelector('[data-reactroot], [data-reactid]') || 
          (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        techStack.push('React');
      }
      if (document.querySelector('#__next') || (window as any).__NEXT_DATA__) {
        techStack.push('Next.js');
      }
      if (document.querySelector('meta[name="generator"][content*="WordPress"]') ||
          document.querySelector('link[href*="wp-content"]')) {
        techStack.push('WordPress');
      }
      if (document.querySelector('[data-v-]') || (window as any).__VUE__) {
        techStack.push('Vue.js');
      }
      if (document.querySelector('[ng-version]') || (window as any).ng) {
        techStack.push('Angular');
      }
      if ((window as any).jQuery) {
        techStack.push('jQuery');
      }
      if (techStack.length === 0) {
        techStack.push('HTML/CSS/JS');
      }

      // Chatbot Detection
      const chatbotKeywords = ['tidio', 'intercom', 'drift', 'crisp', 'tawk',
                               'livechat', 'zendesk', 'freshchat'];
      const bodyHTML = document.body.innerHTML.toLowerCase();
      const hasChatbot = chatbotKeywords.some(keyword => bodyHTML.includes(keyword));

      // Voice Assistant
      const hasVoiceAssistant = bodyHTML.includes('speechrecognition');

      // Social Bot
      const hasSocialBot = bodyHTML.includes('manychat') || bodyHTML.includes('chatfuel');

      // Business Name
      let businessName = document.querySelector('title')?.textContent?.split('|')[0]?.trim() ||
                        document.querySelector('h1')?.textContent?.trim() || '';

      // Contact Email
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = bodyHTML.match(emailRegex);
      const contactEmail = emails?.find(email => 
        email.includes('contact') || email.includes('info') || email.includes('hello')
      ) || emails?.[0];

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
    console.log('✅ Scraping complete!');

    return { url, ...scrapedData };
    
  } catch (error) {
    if (browser) await browser.close();
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
 * Scrape Google Maps for businesses in a location
 */
export async function scrapeGoogleMaps(location: string): Promise<string[]> {
  let browser: Browser | null = null;
  
  try {
    console.log(`🗺️ Searching Google Maps for: ${location}`);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const searchQuery = encodeURIComponent(location);
    await page.goto(`https://www.google.com/maps/search/${searchQuery}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for results to load
    await page.waitForSelector('a[href*="http"]', { timeout: 10000 });

    // Extract website URLs
    const websites = await page.evaluate(() => {
      const links: string[] = [];
      const elements = document.querySelectorAll('a[href*="http"]');
      
      elements.forEach((el) => {
        const href = el.getAttribute('href');
        if (href && 
            !href.includes('google.com') && 
            !href.includes('facebook.com') &&
            !href.includes('instagram.com') &&
            !href.includes('twitter.com')) {
          links.push(href);
        }
      });
      
      return Array.from(new Set(links)).slice(0, 10);
    });

    await browser.close();
    console.log(`✅ Found ${websites.length} websites`);
    
    return websites;
    
  } catch (error) {
    if (browser) await browser.close();
    console.error('❌ Error scraping Google Maps:', error);
    return [];
  }
}