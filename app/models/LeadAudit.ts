// models/LeadAudit.ts

import mongoose, { Schema, Model } from 'mongoose';
import { LeadAudit } from '@/lib/types';

/**
 * Mongoose Schema for Lead Audit
 * Defines the structure of documents in MongoDB
 */
const LeadAuditSchema = new Schema<LeadAudit>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    webServices: {
      seoTagsPresent: {
        type: Boolean,
        default: false,
      },
      isMobileResponsive: {
        type: Boolean,
        default: false,
      },
      techStack: {
        type: [String],
        default: [],
      },
    },
    automation: {
      hasChatbot: {
        type: Boolean,
        default: false,
      },
      hasVoiceAssistant: {
        type: Boolean,
        default: false,
      },
      hasSocialBot: {
        type: Boolean,
        default: false,
      },
    },
    detectedProblems: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Audited', 'Email Sent', 'Saved'],
      default: 'Audited',
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create indexes for better query performance
LeadAuditSchema.index({ url: 1 });
LeadAuditSchema.index({ status: 1 });
LeadAuditSchema.index({ createdAt: -1 });

/**
 * Export the model
 * Check if model already exists to prevent recompilation errors in development
 */
const LeadAuditModel: Model<LeadAudit> =
  mongoose.models.LeadAudit || mongoose.model<LeadAudit>('LeadAudit', LeadAuditSchema);

export default LeadAuditModel;