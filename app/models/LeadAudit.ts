// models/LeadAudit.ts - Updated to store all production analyzer data

import mongoose, { Schema, models } from 'mongoose';

const LeadAuditSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      default: 'Unknown Business',
    },
    contactEmail: {
      type: String,
      default: null,
    },
    
    // === SCORES (for UI display) ===
    seoScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    performanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    accessibilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    bestPracticesScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    designScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    
    // === PAGESPEED DATA ===
    pagespeed: {
      type: {
        seo: { type: Number, default: 0 },
        performance: { type: Number, default: 0 },
        accessibility: { type: Number, default: 0 },
        bestPractices: { type: Number, default: 0 },
        issues: { type: [String], default: [] },
        opportunities: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === TECH STACK ===
    techStack: {
      type: {
        frameworks: { type: [String], default: [] },
        cms: { type: [String], default: [] },
        cssFrameworks: { type: [String], default: [] },
        analytics: { type: [String], default: [] },
        cdn: { type: [String], default: [] },
        hosting: { type: [String], default: [] },
        programming: { type: [String], default: [] },
        all: { type: [Schema.Types.Mixed], default: [] },
      },
      default: {},
    },
    
    // === CHATBOTS ===
    chatbots: {
      type: {
        detected: { type: Boolean, default: false },
        providers: { type: [String], default: [] },
        isAIPowered: { type: Boolean, default: false },
        networkEndpoints: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === SOCIAL BOTS ===
    socialBots: {
      type: {
        detected: { type: Boolean, default: false },
        platforms: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === VOICE ASSISTANT ===
    voiceAssistant: {
      type: {
        detected: { type: Boolean, default: false },
        implementation: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === DESIGN ANALYSIS (Gemini Vision) ===
    designAnalysis: {
      type: {
        layoutQuality: { type: Number, default: 0 },
        colorScheme: { type: Number, default: 0 },
        typography: { type: Number, default: 0 },
        visualHierarchy: { type: Number, default: 0 },
        modernityScore: { type: Number, default: 0 },
        overallScore: { type: Number, default: 0 },
        rating: { type: String, default: 'Unknown' },
        feedback: { type: [String], default: [] },
        strengths: { type: [String], default: [] },
        recommendations: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === PROBLEMS ===
    problems: {
      type: {
        critical: { type: [String], default: [] },
        important: { type: [String], default: [] },
        minor: { type: [String], default: [] },
      },
      default: {},
    },
    
    // === OPPORTUNITIES ===
    opportunities: {
      type: {
        webServices: { type: [String], default: [] },
        aiServices: { type: [String], default: [] },
        estimatedValue: { type: Number, default: 0 },
      },
      default: {},
    },
    
    // === BACKWARD COMPATIBILITY ===
    webServices: {
      type: {
        seoTagsPresent: { type: Boolean, default: false },
        isMobileResponsive: { type: Boolean, default: false },
        techStack: { type: [String], default: [] },
      },
      default: {},
    },
    
    automation: {
      type: {
        hasChatbot: { type: Boolean, default: false },
        hasVoiceAssistant: { type: Boolean, default: false },
        hasSocialBot: { type: Boolean, default: false },
      },
      default: {},
    },
    
    detectedProblems: {
      type: [String],
      default: [],
    },
    
    estimatedValue: {
      type: Number,
      default: 0,
    },
    
    // === STATUS ===
    status: {
      type: String,
      enum: ['Audited', 'Email Sent', 'Saved'],
      default: 'Audited',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
LeadAuditSchema.index({ userId: 1, createdAt: -1 });
LeadAuditSchema.index({ status: 1 });
LeadAuditSchema.index({ 'chatbots.detected': 1 });

const LeadAuditModel = models.LeadAudit || mongoose.model('LeadAudit', LeadAuditSchema);

export default LeadAuditModel;