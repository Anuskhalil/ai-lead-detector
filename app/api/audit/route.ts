// app/api/audit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import LeadAuditModel from '../../models/LeadAudit';
import { scrapeWebsite, scrapeGoogleMaps } from '../../lib/scraper';
import { createLeadAuditFromScrapedData } from '../../lib/analyzer';

/**
 * POST /api/audit
 * Create audit(s) - supports both single URL and location mode
 */
export async function POST(request: NextRequest) {
  try {
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
      const audit = await LeadAuditModel.create(auditData);
      
      return NextResponse.json({
        success: true,
        data: audit,
      });
      
    } else if (mode === 'location') {
      // Location mode - scrape Google Maps first
      console.log('🗺️ Location mode');
      const websites = await scrapeGoogleMaps(input);
      
      if (websites.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No websites found for this location' },
          { status: 404 }
        );
      }

      // Scrape each website and create audits
      const audits = [];
      
      for (const website of websites) {
        try {
          const scrapedData = await scrapeWebsite(website);
          const auditData = createLeadAuditFromScrapedData(scrapedData, input);
          const audit = await LeadAuditModel.create(auditData);
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
 * Retrieve all audits
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query = status ? { status } : {};
    
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