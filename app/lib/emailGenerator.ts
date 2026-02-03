// lib/emailGenerator.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a personalized cold email using GPT-4
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

The email should be around 150-200 words and feel genuine.`;

  try {
    console.log('🤖 Generating email with GPT-4...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert copywriter specializing in B2B cold email outreach for digital agencies.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const emailContent = completion.choices[0]?.message?.content || '';
    console.log('✅ Email generated successfully!');
    
    return emailContent;
    
  } catch (error) {
    console.error('❌ Error generating email with OpenAI:', error);
    // Return fallback email if API fails
    return generateFallbackEmail(businessName, url, detectedProblems);
  }
}

/**
 * Fallback email template if OpenAI fails
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