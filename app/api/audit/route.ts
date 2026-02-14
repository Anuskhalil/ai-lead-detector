// app/api/audit/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';
import { comprehensiveAIAnalysis } from '../../lib/analyzer';

/**
 * Transform full AI analysis into DB-friendly structure
 */
function createLeadAuditFromComprehensive(data: any, url: string) {
  return {
    url,
    businessName: data.businessName,
    contactEmail: data.contactEmail,

    seoScore: data.pagespeed.seo,
    performanceScore: data.pagespeed.performance,
    accessibilityScore: data.pagespeed.accessibility,
    bestPracticesScore: data.pagespeed.bestPractices,

    designScore: data.designAnalysis.overallScore,

    techStack: data.techStack,
    chatbots: data.chatbots,
    socialBots: data.socialBots,

    problems: data.problems,
    opportunities: data.opportunities,

    estimatedValue: data.opportunities.estimatedValue,

    status: 'completed',
  };
}

/**
 * POST /api/audit
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { mode, input } = body;

    if (!mode || !input) {
      return NextResponse.json(
        { success: false, error: 'Mode and input are required' },
        { status: 400 }
      );
    }

    await connectDB();

    if (mode === 'single') {
      console.log('🔍 Running AI 5-Layer Audit...');

      const analysis = await comprehensiveAIAnalysis(input);
      const auditData = createLeadAuditFromComprehensive(analysis, input);

      const audit = await LeadAuditModel.create({
        ...auditData,
        userId,
      });

      return NextResponse.json({
        success: true,
        data: audit,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid mode' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('❌ Audit API error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/audit
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    const audits = await LeadAuditModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: audits,
    });

  } catch (error: any) {
    console.error('❌ Audit GET error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
