// app/api/debug-audit/route.ts
// Temporary route to see what's actually in the database

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the most recent audit
    const audit = await LeadAuditModel.findOne().sort({ createdAt: -1 }).lean();
    
    if (!audit) {
      return NextResponse.json({ error: 'No audits found' });
    }
    
    // Return the EXACT structure
    return NextResponse.json({
      success: true,
      data: audit,
      // Show what fields exist
      hasFields: {
        seoScore: typeof audit.seoScore,
        designScore: typeof audit.designScore,
        pagespeed: typeof audit.pagespeed,
        'pagespeed.seo': audit.pagespeed?.seo,
        techStack: typeof audit.techStack,
        'techStack.frameworks': audit.techStack?.frameworks,
        chatbots: typeof audit.chatbots,
        'chatbots.detected': audit.chatbots?.detected,
        opportunities: typeof audit.opportunities,
        'opportunities.estimatedValue': audit.opportunities?.estimatedValue,
      }
    }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}