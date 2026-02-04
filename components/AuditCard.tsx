// components/AuditCard.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Mail, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { LeadAudit } from '../app/lib/types';

interface AuditCardProps {
  audit: LeadAudit;
  onEmailSent: () => void;
}

export default function AuditCard({ audit, onEmailSent }: AuditCardProps) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(audit.status === 'Email Sent');
  const [expanded, setExpanded] = useState(false);

  const handleSendEmail = async () => {
    if (!audit.contactEmail) {
      alert('No contact email found for this business');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditId: audit._id,
          recipientEmail: audit.contactEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEmailSent(true);
        onEmailSent();
        alert('✅ Email sent successfully!');
      } else {
        alert('❌ ' + (data.error || 'Failed to send email'));
      }
    } catch (error) {
      alert('❌ Error sending email');
    } finally {
      setSendingEmail(false);
    }
  };

  const StatusBadge = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      {value ? (
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Pass</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600 font-medium">Fail</span>
        </div>
      )}
    </div>
  );

  const calculateScore = () => {
    const checks = [
      audit.webServices.seoTagsPresent,
      audit.webServices.isMobileResponsive,
      audit.automation.hasChatbot,
      audit.automation.hasVoiceAssistant,
      audit.automation.hasSocialBot
    ];
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };

  const score = calculateScore();

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-glass hover:shadow-card-hover transition-all duration-300 hover:border-primary-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              score >= 70 ? 'bg-green-100' : score >= 40 ? 'bg-amber-100' : 'bg-red-100'
            }`}>
              <span className={`text-lg font-bold ${
                score >= 70 ? 'text-green-700' : score >= 40 ? 'text-amber-700' : 'text-red-700'
              }`}>
                {score}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                {audit.businessName || 'Unknown Business'}
              </h3>
              <a
                href={audit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm group/url"
              >
                <span className="truncate max-w-[200px]">{audit.url}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
          
          {audit.contactEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{audit.contactEmail}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            emailSent
              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
              : 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200'
          }`}>
            {emailSent ? 'Email Sent' : audit.status}
          </span>
          <span className="text-xs text-gray-500">
            {audit.createdAt ? new Date(audit.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tech Stack
          </p>
          <span className="text-xs text-gray-500">{audit.webServices.techStack.length} detected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {audit.webServices.techStack.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {audit.webServices.techStack.length > 3 && (
            <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs">
              +{audit.webServices.techStack.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Status Checks - Collapsible */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="text-sm font-semibold text-gray-700">Technical Audit</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {expanded ? 'Hide details' : 'Show details'}
            </span>
            <div className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>
        </button>
        
        {expanded && (
          <div className="space-y-1 animate-slide-up">
            <StatusBadge label="SEO Tags" value={audit.webServices.seoTagsPresent} />
            <StatusBadge label="Mobile Responsive" value={audit.webServices.isMobileResponsive} />
            <StatusBadge label="Chatbot" value={audit.automation.hasChatbot} />
            <StatusBadge label="Voice Assistant" value={audit.automation.hasVoiceAssistant} />
            <StatusBadge label="Social Bot" value={audit.automation.hasSocialBot} />
          </div>
        )}
      </div>

      {/* Detected Problems */}
      {audit.detectedProblems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-semibold text-amber-700">
              Issues Found ({audit.detectedProblems.length})
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-25 border border-amber-200 rounded-xl p-4">
            <ul className="space-y-2">
              {audit.detectedProblems.slice(0, 2).map((problem, idx) => (
                <li key={idx} className="text-sm text-amber-800 flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-amber-600 text-xs">!</span>
                  </div>
                  <span>{problem}</span>
                </li>
              ))}
              {audit.detectedProblems.length > 2 && (
                <li className="text-sm text-amber-600">
                  +{audit.detectedProblems.length - 2} more issues...
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleSendEmail}
        disabled={sendingEmail || !audit.contactEmail || emailSent}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          emailSent
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : sendingEmail || !audit.contactEmail
            ? 'bg-gray-100 text-gray-400'
            : 'bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-gray-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {sendingEmail ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : emailSent ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Email Sent
          </>
        ) : !audit.contactEmail ? (
          <>
            <AlertCircle className="w-5 h-5" />
            Manual Outreach Required
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Send Pitch Email
          </>
        )}
      </button>
    </div>
  );
}