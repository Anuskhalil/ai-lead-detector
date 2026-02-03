// lib/emailSender.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param body - Email body (text)
 * @returns Success status
 */
export async function sendEmail(
  to: 'anuskhalil77@gmail.com' | string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`📧 Sending email to: ${to}`);
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@youragency.com',
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>'), // Convert newlines to HTML breaks
    });

    console.log('✅ Email sent successfully!');
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
}