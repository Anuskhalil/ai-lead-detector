// app/api/audit/route.ts - FINAL CORRECTED VERSION

export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';
import { comprehensiveAIAnalysis } from '../../lib/analyzer';

/**
 * Transform production analyzer output to DB structure
 * SAVES ALL DATA FROM TERMINAL
 */
function createLeadAuditFromComprehensive(data: any, url: string) {
  console.log('\n📦 Transforming analyzer data for database...');
  console.log('Data received from analyzer:', {
    hasPagespeed: !!data.pagespeed,
    hasTechStack: !!data.techStack,
    hasChatbots: !!data.chatbots,
    hasOpportunities: !!data.opportunities,
    hasDesignAnalysis: !!data.designAnalysis,
  });
  
  // Extract scores - THE FIX IS HERE!
  const seoScore = data.pagespeed?.seo || 0;
  const performanceScore = data.pagespeed?.performance || 0;
  const accessibilityScore = data.pagespeed?.accessibility || 0;
  const bestPracticesScore = data.pagespeed?.bestPractices || 0;
  const designScore = data.designAnalysis?.overallScore || 0;
  
  console.log('📊 Extracted Scores:');
  console.log('   SEO:', seoScore);
  console.log('   Performance:', performanceScore);
  console.log('   Design:', designScore);
  
  // Build COMPLETE audit object
  const auditData = {
    url,
    businessName: data.businessName || 'Unknown Business',
    contactEmail: data.contactEmail || null,
    
    // ===== NEW STRUCTURE (with scores) =====
    seoScore,                    // ✅ SAVES THIS!
    performanceScore,            // ✅ SAVES THIS!
    accessibilityScore,          // ✅ SAVES THIS!
    bestPracticesScore,          // ✅ SAVES THIS!
    designScore,                 // ✅ SAVES THIS!
    
    // Full pagespeed data
    pagespeed: {
      seo: seoScore,
      performance: performanceScore,
      accessibility: accessibilityScore,
      bestPractices: bestPracticesScore,
      issues: data.pagespeed?.issues || [],
      opportunities: data.pagespeed?.opportunities || [],
    },
    
    // Tech Stack
    techStack: {
      frameworks: data.techStack?.frameworks || [],
      cms: data.techStack?.cms || [],
      cssFrameworks: data.techStack?.cssFrameworks || [],
      analytics: data.techStack?.analytics || [],
      cdn: data.techStack?.cdn || [],
      hosting: data.techStack?.hosting || [],
      programming: data.techStack?.programming || [],
      all: data.techStack?.all || [],
    },
    
    // Chatbots
    chatbots: {
      detected: data.chatbots?.detected || false,
      providers: data.chatbots?.providers || [],
      isAIPowered: data.chatbots?.isAIPowered || false,
      networkEndpoints: data.chatbots?.networkEndpoints || [],
    },
    
    // Social Bots
    socialBots: {
      detected: data.socialBots?.detected || false,
      platforms: data.socialBots?.platforms || [],
    },
    
    // Voice Assistant  
    voiceAssistant: {
      detected: data.voiceAssistant?.detected || false,
      implementation: data.voiceAssistant?.implementation || [],
    },
    
    // Design Analysis (full Gemini data)
    designAnalysis: {
      layoutQuality: data.designAnalysis?.layoutQuality || 0,
      colorScheme: data.designAnalysis?.colorScheme || 0,
      typography: data.designAnalysis?.typography || 0,
      visualHierarchy: data.designAnalysis?.visualHierarchy || 0,
      modernityScore: data.designAnalysis?.modernityScore || 0,
      overallScore: designScore,
      rating: data.designAnalysis?.rating || 'Unknown',
      feedback: data.designAnalysis?.feedback || [],
      strengths: data.designAnalysis?.strengths || [],
      recommendations: data.designAnalysis?.recommendations || [],
    },
    
    // Problems
    problems: {
      critical: data.problems?.critical || [],
      important: data.problems?.important || [],
      minor: data.problems?.minor || [],
    },
    
    // Opportunities
    opportunities: {
      webServices: data.opportunities?.webServices || [],
      aiServices: data.opportunities?.aiServices || [],
      estimatedValue: data.opportunities?.estimatedValue || 0,
    },
    
    // ===== OLD STRUCTURE (backward compatibility) =====
    webServices: {
      seoTagsPresent: seoScore > 50,
      isMobileResponsive: true,
      techStack: [
        ...(data.techStack?.frameworks || []),
        ...(data.techStack?.cms || []),
        ...(data.techStack?.cssFrameworks || []),
      ],
    },
    
    automation: {
      hasChatbot: data.chatbots?.detected || false,
      hasVoiceAssistant: data.voiceAssistant?.detected || false,
      hasSocialBot: data.socialBots?.detected || false,
    },
    
    detectedProblems: [
      ...(data.problems?.critical || []),
      ...(data.problems?.important || []),
      ...(data.problems?.minor || []),
    ],
    
    estimatedValue: data.opportunities?.estimatedValue || 0,
    
    status: 'Audited' as const,
  };
  
  console.log('✅ Transformation complete:');
  console.log('   Business:', auditData.businessName);
  console.log('   seoScore:', auditData.seoScore, '← WILL BE SAVED!');
  console.log('   designScore:', auditData.designScore, '← WILL BE SAVED!');
  console.log('   chatbots.detected:', auditData.chatbots.detected);
  console.log('   estimatedValue:', auditData.estimatedValue);
  console.log('');
  
  return auditData;
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
      console.log('🔍 Running AI Analysis...');

      // Run comprehensive analysis
      const analysis = await comprehensiveAIAnalysis(input);
      
      // Transform for database
      const auditData = createLeadAuditFromComprehensive(analysis, input);

      // Save to database
      console.log('💾 Saving to database...');
      const audit = await LeadAuditModel.create({
        ...auditData,
        userId,
      });

      console.log('✅ Saved successfully with ID:', audit._id);
      console.log('');

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