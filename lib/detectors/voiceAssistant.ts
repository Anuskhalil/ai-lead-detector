// lib/detectors/voiceAssistant.ts
// Detects if website has voice assistant features (Yes/No)

import * as cheerio from 'cheerio';
import { VoiceAssistantResult } from '../../types';

// Known voice assistant patterns
const VOICE_ASSISTANT_PATTERNS = {
  alexa: ['alexa-skills', 'amazon-alexa', 'alexa.amazon'],
  googleAssistant: ['actions.google', 'dialogflow-voice', 'assistant.google'],
  webSpeech: ['speechrecognition', 'webspeechapi', 'speech-recognition'],
  customVoice: ['voice-assistant', 'speech-to-text', 'voice-search'],
  siri: ['siri-shortcuts', 'apple-shortcuts'],
};

/**
 * Checks if website has voice assistant integration
 * @param html - HTML content of the website
 * @param $ - Cheerio instance
 * @returns VoiceAssistantResult object
 */
export function detectVoiceAssistant(
  html: string,
  $: cheerio.CheerioAPI
): VoiceAssistantResult {
  const detectedServices: string[] = [];
  const htmlLower = html.toLowerCase();

  // Check scripts and meta tags
  $('script, meta').each((_, elem) => {
    const src = $(elem).attr('src')?.toLowerCase() || '';
    const content = $(elem).attr('content')?.toLowerCase() || '';
    const scriptContent = $(elem).html()?.toLowerCase() || '';
    const combined = src + ' ' + content + ' ' + scriptContent;

    // Check each voice service
    for (const [service, patterns] of Object.entries(VOICE_ASSISTANT_PATTERNS)) {
      for (const pattern of patterns) {
        if (combined.includes(pattern)) {
          detectedServices.push(service);
          break;
        }
      }
    }
  });

  // Check for voice search buttons or inputs
  const voiceInputs = $('[aria-label*="voice"], [placeholder*="voice"], button[title*="voice"]');
  if (voiceInputs.length > 0 && detectedServices.length === 0) {
    detectedServices.push('voice_input_detected');
  }

  // Remove duplicates
  const uniqueServices = [...new Set(detectedServices)];

  return {
    hasVoiceAssistant: uniqueServices.length > 0,
    detectedServices: uniqueServices,
  };
}