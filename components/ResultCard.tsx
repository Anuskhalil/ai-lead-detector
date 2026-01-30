// components/ResultCard.tsx
// Displays a single detection result in a card format

import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DetectionResult } from '../types';

interface ResultCardProps {
  result: DetectionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-1 break-all">
            {result.url}
          </h3>
          <p className="text-sm text-slate-400">
            Scanned: {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4 ${
            result.leadQuality === 'HIGH'
              ? 'bg-green-600'
              : result.leadQuality === 'MEDIUM'
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}
        >
          {result.leadQuality} QUALITY
        </span>
      </div>

      {/* Detection Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* AI Chatbots/Automation */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-purple-400">AI Chatbots/Automation</h4>
          <div className="space-y-2">
            <DetectionRow
              label="Chatbot"
              status={result.chatbot.hasChatbot}
              details={result.chatbot.detectedServices.join(', ')}
            />
            <DetectionRow
              label="Voice Assistant"
              status={result.voiceAssistant.hasVoiceAssistant}
              details={result.voiceAssistant.detectedServices.join(', ')}
            />
            <DetectionRow
              label="Social Media Bot"
              status={result.socialMediaBot.hasSocialBot}
              details={result.socialMediaBot.detectedPlatforms.join(', ')}
            />
          </div>
        </div>

        {/* Web Services */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-blue-400">Web Services</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Framework</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.framework.type === 'Modern'
                    ? 'bg-green-600'
                    : result.framework.type === 'Legacy'
                    ? 'bg-red-600'
                    : 'bg-gray-600'
                }`}
              >
                {result.framework.type}
              </span>
            </div>
            {result.framework.detected.length > 0 && (
              <p className="text-xs text-slate-400">
                Detected: {result.framework.detected.join(', ')}
              </p>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-300">SEO Score</span>
              <span
                className={`text-sm font-bold ${
                  result.seo.score >= 80
                    ? 'text-green-400'
                    : result.seo.score >= 60
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {result.seo.score}%
              </span>
            </div>
            <DetectionRow
              label="Mobile Responsive"
              status={result.design.isMobileResponsive}
            />
          </div>
        </div>
      </div>

      {/* Opportunities */}
      {result.opportunities.length > 0 && (
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-green-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Service Opportunities ({result.opportunities.length})
          </h4>
          <ul className="space-y-2">
            {result.opportunities.map((opp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues Summary */}
      {(result.seo.issues.length > 0 || result.design.issues.length > 0) && (
        <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-amber-400 text-sm">Detected Issues:</h4>
          <div className="space-y-1">
            {result.seo.issues.slice(0, 3).map((issue, i) => (
              <p key={i} className="text-xs text-slate-400">• SEO: {issue}</p>
            ))}
            {result.design.issues.slice(0, 3).map((issue, i) => (
              <p key={i} className="text-xs text-slate-400">• Design: {issue}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component
function DetectionRow({
  label,
  status,
  details,
}: {
  label: string;
  status: boolean;
  details?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          {status ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm font-medium">{status ? 'Yes' : 'No'}</span>
        </div>
      </div>
      {details && (
        <p className="text-xs text-slate-400 mt-1">({details})</p>
      )}
    </div>
  );
}