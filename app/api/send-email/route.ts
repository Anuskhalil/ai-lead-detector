// app/api/send-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import LeadAuditModel from '@/models/LeadAudit';
import { generateColdEmail } from '@/lib/emailGenerator';
import { sendEmail } from '@/lib/emailSender';

/**
 * POST /api/send-email
 * Generate and send a cold email for an audit
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditId, recipientEmail } = body;

    // Validate input
    if (!auditId || !recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'Audit ID and recipient email are required' },
        { status: 400 }
      );
    }

    console.log('📨 Processing email request for audit:', auditId);

    // Connect to database
    await connectDB();

    // Fetch the audit
    const audit = await LeadAuditModel.findById(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Generate email content using Google Gemini
    const businessName = audit.businessName || 'your business';
    const emailBody = await generateColdEmail(
      businessName,
      audit.url,
      audit.detectedProblems
    );

    // Extract subject from email body or create default
    const emailLines = emailBody.split('\n');
    let subject = `Quick Observation About ${businessName}'s Digital Presence`;
    let body = emailBody;

    if (emailLines[0].toLowerCase().startsWith('subject:')) {
      subject = emailLines[0].replace(/^subject:\s*/i, '').trim();
      body = emailLines.slice(1).join('\n').trim();
    }

    // Send the email
    const result = await sendEmail(recipientEmail, subject, body);

    if (result.success) {
      // Update audit status
      audit.status = 'Email Sent';
      await audit.save();

      console.log('✅ Email sent and status updated');

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Send email API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}