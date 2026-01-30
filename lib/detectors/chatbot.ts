// lib/detectors/chatbot.ts
// Detects if website has AI chatbot (Yes/No)

import * as cheerio from 'cheerio';
import { ChatbotResult } from '../../types';

// Known chatbot service patterns
const CHATBOT_PATTERNS = {
  intercom: ['intercom.io', 'intercom.com', 'intercomcdn'],
  drift: ['drift.com', 'driftt.com', 'drift-widget'],
  tidio: ['tidio.co', 'tidio-chat'],
  livechat: ['livechatinc.com', 'livechat', 'lc.chat'],
  zendesk: ['zendesk.com', 'zopim.com', 'zendesk-chat'],
  tawk: ['tawk.to', 'tawkto'],
  crisp: ['crisp.chat', 'crisp.im'],
  freshchat: ['freshchat.com', 'freshworks.com'],
  chatbot_com: ['chatbot.com'],
  manychat: ['manychat.com', 'widget.manychat'],
  dialogflow: ['dialogflow.com', 'dialogflow'],
  customGPT: ['openai.com/chat', 'chatgpt-widget', 'gpt-3', 'gpt-4'],
  hubspot: ['hubspot.com/conversations', 'hubspot-messages'],
  olark: ['olark.com'],
  smartsupp: ['smartsupp.com'],
  userlike: ['userlike.com'],
  chatwoot: ['chatwoot.com'],
  botpress: ['botpress.io', 'botpress.cloud'],
};

/**
 * Checks if website has a chatbot installed
 * @param html - HTML content of the website
 * @param $ - Cheerio instance (jQuery-like)
 * @returns ChatbotResult object
 */
export function detectChatbot(html: string, $: cheerio.CheerioAPI): ChatbotResult {
  const detectedServices: string[] = [];
  const htmlLower = html.toLowerCase();

  // Check all <script> tags for chatbot patterns
  $('script').each((_, elem) => {
    const src = $(elem).attr('src')?.toLowerCase() || '';
    const content = $(elem).html()?.toLowerCase() || '';
    const combined = src + ' ' + content;

    // Check each chatbot service
    for (const [service, patterns] of Object.entries(CHATBOT_PATTERNS)) {
      for (const pattern of patterns) {
        if (combined.includes(pattern)) {
          detectedServices.push(service);
          break; // Don't add same service multiple times
        }
      }
    }
  });

  // Also check for common chatbot widget divs/iframes
  const chatWidgets = [
    '[id*="chat"]',
    '[class*="chat"]',
    '[id*="intercom"]',
    '[id*="drift"]',
    '[id*="tidio"]',
    'iframe[title*="chat"]',
  ];

  chatWidgets.forEach((selector) => {
    if ($(selector).length > 0 && detectedServices.length === 0) {
      detectedServices.push('generic_chat_widget');
    }
  });

  // Remove duplicates
  const uniqueServices = [...new Set(detectedServices)];

  return {
    hasChatbot: uniqueServices.length > 0,
    detectedServices: uniqueServices,
  };
}