// lib/emailGenerator.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * Generate a personalized cold email using Google Gemini
 * @param businessName - Name of the target business
 * @param url - Website URL
 * @param detectedProblems - Array of issues found
 * @returns Generated email content
 */
export async function generateColdEmail(
  businessName: string,
  url: string,
  detectedProblems: string[]
): Promise<string> {
  const problemsList = detectedProblems.join(', ');

  const prompt = `You are a professional digital agency representative. Write a personalized cold email to ${businessName} (website: ${url}).

Key points to address:
- Their website is missing these critical services: ${problemsList}
- Explain how these missing services are impacting their business
- Pitch our agency's expertise in providing these specific services
- Keep it concise, professional, and non-pushy
- Include a clear call-to-action
- Make it feel personalized, not template-like

The email should be around 150-200 words and feel genuine. Format it as:

Subject: [Your subject line]

[Email body]`;

  try {
    console.log('🤖 Generating email with Google Gemini...');
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emailContent = response.text();

    console.log('✅ Email generated successfully!');
    
    return emailContent;
    
  } catch (error) {
    console.error('❌ Error generating email with Google AI:', error);
    // Return fallback email if API fails
    return generateFallbackEmail(businessName, url, detectedProblems);
  }
}

/**
 * Fallback email template if Google AI fails
 */
function generateFallbackEmail(
  businessName: string,
  url: string,
  detectedProblems: string[]
): string {
  return `Subject: Quick Observation About ${businessName}'s Digital Presence

Hi there,

I recently visited ${url} and was impressed by your business. However, I noticed a few opportunities that could significantly boost your online performance:

${detectedProblems.map(problem => `• ${problem}`).join('\n')}

Our agency specializes in helping businesses like yours implement these solutions quickly and affordably. We've helped dozens of companies increase their conversion rates by 40-60% through targeted improvements.

Would you be open to a quick 15-minute call to discuss how we can help ${businessName} achieve similar results?

Looking forward to connecting,
[Your Agency Name]`;
}