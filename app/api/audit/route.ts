// app/api/audit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';
import { scrapeWebsite, scrapeGoogleMaps } from '../../lib/scraper';
import { createLeadAuditFromScrapedData } from '../../lib/analyzer';

/**
 * POST /api/audit
 * Create audit(s) - requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
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
      // Single URL mode
      console.log('🔍 Single URL mode');
      const scrapedData = await scrapeWebsite(input);
      const auditData = createLeadAuditFromScrapedData(scrapedData);
      
      // Add userId
      const audit = await LeadAuditModel.create({
        ...auditData,
        userId,
      });
      
      return NextResponse.json({
        success: true,
        data: audit,
      });
      
    } else if (mode === 'location') {
      // Location mode
      console.log('🗺️ Location mode');
      const websites = await scrapeGoogleMaps(input);
      
      if (websites.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No websites found for this location' },
          { status: 404 }
        );
      }

      const audits = [];
      
      for (const website of websites) {
        try {
          const scrapedData = await scrapeWebsite(website);
          const auditData = createLeadAuditFromScrapedData(scrapedData, input);
          
          // Add userId
          const audit = await LeadAuditModel.create({
            ...auditData,
            userId,
          });
          audits.push(audit);
        } catch (error) {
          console.error(`Failed to audit ${website}:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        data: audits,
        message: `Created ${audits.length} audits`,
      });
      
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid mode' },
        { status: 400 }
      );
    }
    
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
 * Retrieve user's audits - requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Only get audits for this user
    const query: any = { userId };
    if (status) {
      query.status = status;
    }
    
    const audits = await LeadAuditModel
      .find(query)
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