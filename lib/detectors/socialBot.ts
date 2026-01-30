// lib/detectors/socialBot.ts
// Detects if website has social media bot integration (Yes/No)

import * as cheerio from 'cheerio';
import { SocialBotResult } from '../../types';

// Known social media bot patterns
const SOCIAL_BOT_PATTERNS = {
  facebookMessenger: [
    'facebook.com/plugins/customerchat',
    'fb-customerchat',
    'fb-messenger',
    'facebook-messenger-plugin',
  ],
  whatsapp: ['wa.me', 'whatsapp-widget', 'whatsapp.com/send', 'api.whatsapp'],
  telegram: ['telegram.me', 't.me/', 'telegram-widget'],
  instagram: ['instagram-feed-bot', 'instagram-dm'],
  twitter: ['twitter-dm-card', 'twitter-messages'],
  slack: ['slack-bot', 'slack.com/oauth'],
};

/**
 * Checks if website has social media bot integration
 * @param html - HTML content of the website
 * @param $ - Cheerio instance
 * @returns SocialBotResult object
 */
export function detectSocialMediaBot(
  html: string,
  $: cheerio.CheerioAPI
): SocialBotResult {
  const detectedPlatforms: string[] = [];
  const htmlLower = html.toLowerCase();

  // Check scripts, links, and iframes
  $('script, a, iframe').each((_, elem) => {
    const src = $(elem).attr('src')?.toLowerCase() || '';
    const href = $(elem).attr('href')?.toLowerCase() || '';
    const content = $(elem).html()?.toLowerCase() || '';
    const combined = src + ' ' + href + ' ' + content;

    // Check each social platform
    for (const [platform, patterns] of Object.entries(SOCIAL_BOT_PATTERNS)) {
      for (const pattern of patterns) {
        if (combined.includes(pattern)) {
          detectedPlatforms.push(platform);
          break;
        }
      }
    }
  });

  // Check for social media widgets in divs
  const socialWidgets = $(
    '[class*="whatsapp"], [id*="whatsapp"], [class*="messenger"], [id*="fb-"]'
  );
  if (socialWidgets.length > 0 && detectedPlatforms.length === 0) {
    detectedPlatforms.push('social_widget_detected');
  }

  // Remove duplicates
  const uniquePlatforms = [...new Set(detectedPlatforms)];

  return {
    hasSocialBot: uniquePlatforms.length > 0,
    detectedPlatforms: uniquePlatforms,
  };
}