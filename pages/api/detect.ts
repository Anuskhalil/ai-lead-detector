// pages/api/detect.ts
// Main API endpoint for single website detection

import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';
import { DetectionResult } from '../../types';
import { fetchWebsiteHTML } from '../../lib/fetcher';
import { detectChatbot } from '../../lib/detectors/chatbot';
import { detectVoiceAssistant } from '../../lib/detectors/voiceAssistant';
import { detectSocialMediaBot } from '../../lib/detectors/socialBot';
import { detectFramework } from '../../lib/detectors/framework';
import { analyzeSEO } from '../../lib/detectors/seo';
import { analyzeDesign } from '../../lib/detectors/design';
import { generateOpportunities, calculateLeadQuality } from '../../lib/opportunities';

/**
 * Main detection function that coordinates all detectors
 * @param url - Website URL to analyze
 * @returns Complete detection result
 */
async function detectWebsite(url: string): Promise<DetectionResult> {
  try {
    console.log(`[Detection Engine] Starting analysis for: ${url}`);

    // STEP 1: Fetch the website HTML
    const html = await fetchWebsiteHTML(url);
    console.log(`[Detection Engine] HTML fetched successfully (${html.length} characters)`);

    // STEP 2: Load HTML into Cheerio (jQuery-like parser)
    const $ = cheerio.load(html);

    // STEP 3: Run all detectors
    console.log('[Detection Engine] Running detectors...');

    // Branch A: AI Automation Detection
    const chatbot = detectChatbot(html, $);
    console.log(`[Chatbot] ${chatbot.hasChatbot ? 'Detected' : 'Not found'}`);

    const voiceAssistant = detectVoiceAssistant(html, $);
    console.log(`[Voice Assistant] ${voiceAssistant.hasVoiceAssistant ? 'Detected' : 'Not found'}`);

    const socialMediaBot = detectSocialMediaBot(html, $);
    console.log(`[Social Bot] ${socialMediaBot.hasSocialBot ? 'Detected' : 'Not found'}`);

    // Branch B: Web Services Analysis
    const framework = detectFramework(html, $);
    console.log(`[Framework] Type: ${framework.type}`);

    const seo = analyzeSEO($);
    console.log(`[SEO] Score: ${seo.score}%`);

    const design = analyzeDesign(html, $);
    console.log(`[Design] Mobile Responsive: ${design.isMobileResponsive}`);

    // STEP 4: Generate opportunities based on findings
    const opportunities = generateOpportunities(
      chatbot,
      voiceAssistant,
      socialMediaBot,
      framework,
      seo,
      design
    );
    console.log(`[Opportunities] Found ${opportunities.length} opportunities`);

    // STEP 5: Calculate lead quality
    const leadQuality = calculateLeadQuality(opportunities.length);
    console.log(`[Lead Quality] ${leadQuality}`);

    // STEP 6: Return complete result
    const result: DetectionResult = {
      url,
      timestamp: new Date().toISOString(),
      chatbot,
      voiceAssistant,
      socialMediaBot,
      framework,
      seo,
      design,
      opportunities,
      leadQuality,
    };

    console.log('[Detection Engine] Analysis complete!');
    return result;
  } catch (error: any) {
    console.error('[Detection Engine] Error:', error.message);
    throw error;
  }
}

/**
 * API Route Handler
 * Handles POST requests to /api/detect
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Please use POST method',
    });
  }

  // Get URL from request body
  const { url } = req.body;

  // Validate URL
  if (!url) {
    return res.status(400).json({
      error: 'URL is required',
      message: 'Please provide a URL in the request body',
    });
  }

  try {
    // Run the detection
    const result = await detectWebsite(url);

    // Return success response
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);

    // Return error response
    return res.status(500).json({
      error: 'Detection failed',
      message: error.message,
      url: url,
    });
  }
}

// Export for use in other files
export { detectWebsite };