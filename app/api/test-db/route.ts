// app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';

/**
 * Test endpoint to verify database connection
 * Visit: http://localhost:3000/api/test-db
 */
export async function GET() {
  try {
    // Try to connect to MongoDB
    await connectDB();

    // Try to create a test audit
    const testAudit = await LeadAuditModel.create({
      url: 'https://test-example.com',
      businessName: 'Test Business',
      webServices: {
        seoTagsPresent: true,
        isMobileResponsive: true,
        techStack: ['Next.js', 'React'],
      },
      automation: {
        hasChatbot: false,
        hasVoiceAssistant: false,
        hasSocialBot: false,
      },
      detectedProblems: ['Missing AI Chatbot Integration'],
      status: 'Audited',
    });

    // Count total audits
    const count = await LeadAuditModel.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      testAudit: {
        id: testAudit._id,
        url: testAudit.url,
        businessName: testAudit.businessName,
      },
      totalAudits: count,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Database connection failed',
      },
      { status: 500 }
    );
  }
}