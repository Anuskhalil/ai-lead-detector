// components/AuditCard.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Mail, Loader2 } from 'lucide-react';
import { LeadAudit } from '../app/lib/types';

interface AuditCardProps {
  audit: LeadAudit;
  onEmailSent: () => void;
}

export default function AuditCard({ audit, onEmailSent }: AuditCardProps) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(audit.status === 'Email Sent');

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
        onEmailSent(); // Refresh the list
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
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      {value ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
    </div>
  );

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {audit.businessName || 'Unknown Business'}
          </h3>
          <a
            href={audit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
          >
            {audit.url.length > 40 ? audit.url.substring(0, 40) + '...' : audit.url}
            <ExternalLink className="w-4 h-4" />
          </a>
          {audit.contactEmail && (
            <p className="text-sm text-gray-600 mt-1">📧 {audit.contactEmail}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            emailSent
              ? 'bg-green-100 text-green-700'
              : 'bg-primary-100 text-primary-700'
          }`}
        >
          {emailSent ? 'Email Sent' : audit.status}
        </span>
      </div>

      {/* Tech Stack */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-medium mb-2">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {audit.webServices.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Status Checks */}
      <div className="border-t-2 border-gray-100 pt-4 mb-4 space-y-1">
        <StatusBadge label="SEO Tags" value={audit.webServices.seoTagsPresent} />
        <StatusBadge label="Mobile Responsive" value={audit.webServices.isMobileResponsive} />
        <StatusBadge label="Chatbot" value={audit.automation.hasChatbot} />
        <StatusBadge label="Voice Assistant" value={audit.automation.hasVoiceAssistant} />
        <StatusBadge label="Social Bot" value={audit.automation.hasSocialBot} />
      </div>

      {/* Detected Problems */}
      {audit.detectedProblems.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-red-900 mb-2">
            ⚠️ Issues Found ({audit.detectedProblems.length})
          </p>
          <ul className="space-y-1">
            {audit.detectedProblems.map((problem, idx) => (
              <li key={idx} className="text-xs text-red-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{problem}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleSendEmail}
        disabled={sendingEmail || !audit.contactEmail || emailSent}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Send Pitch Email
          </>
        )}
      </button>

      {!audit.contactEmail && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          ⚠️ No email found - manual outreach required
        </p>
      )}
    </div>
  );
}