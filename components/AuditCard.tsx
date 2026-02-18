// components/AuditCard.tsx - BULLETPROOF VERSION
'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, ExternalLink, Mail, Loader2, AlertCircle, 
  TrendingUp, Award, Bot, Code
} from 'lucide-react';

interface AuditCardProps {
  audit: any;
  onEmailSent: () => void;
}

export default function AuditCard({ audit, onEmailSent }: AuditCardProps) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(audit.status === 'Email Sent');

  // COMPREHENSIVE DEBUG - Log everything we receive
  useEffect(() => {
    console.log('========================================');
    console.log('AUDIT CARD - FULL DEBUG');
    console.log('========================================');
    console.log('Full audit object:', audit);
    console.log('');
    console.log('Direct fields:');
    console.log('  audit.seoScore:', audit.seoScore);
    console.log('  audit.designScore:', audit.designScore);
    console.log('  audit.performanceScore:', audit.performanceScore);
    console.log('');
    console.log('Nested pagespeed:');
    console.log('  audit.pagespeed:', audit.pagespeed);
    console.log('  audit.pagespeed?.seo:', audit.pagespeed?.seo);
    console.log('');
    console.log('Tech Stack:');
    console.log('  audit.techStack:', audit.techStack);
    console.log('  audit.techStack?.frameworks:', audit.techStack?.frameworks);
    console.log('');
    console.log('Chatbots:');
    console.log('  audit.chatbots:', audit.chatbots);
    console.log('  audit.chatbots?.detected:', audit.chatbots?.detected);
    console.log('  audit.chatbots?.providers:', audit.chatbots?.providers);
    console.log('');
    console.log('Opportunities:');
    console.log('  audit.opportunities:', audit.opportunities);
    console.log('  audit.opportunities?.estimatedValue:', audit.opportunities?.estimatedValue);
    console.log('========================================');
  }, [audit]);

  // SAFE EXTRACTION - Try ALL possible paths
  const getSeoScore = () => {
    return audit.seoScore ?? 
           audit.pagespeed?.seo ?? 
           audit.webServices?.seoScore ?? 
           0;
  };

  const getPerformanceScore = () => {
    return audit.performanceScore ?? 
           audit.pagespeed?.performance ?? 
           0;
  };

  const getAccessibilityScore = () => {
    return audit.accessibilityScore ?? 
           audit.pagespeed?.accessibility ?? 
           0;
  };

  const getDesignScore = () => {
    return audit.designScore ?? 
           audit.designAnalysis?.overallScore ?? 
           0;
  };

  const getTechStack = () => {
    const frameworks = audit.techStack?.frameworks ?? [];
    const cms = audit.techStack?.cms ?? [];
    const cssFrameworks = audit.techStack?.cssFrameworks ?? [];
    const allTech = [...frameworks, ...cms, ...cssFrameworks];
    return allTech.filter(Boolean);
  };

  const getChatbotInfo = () => {
    const detected = audit.chatbots?.detected ?? 
                    audit.automation?.hasChatbot ?? 
                    false;
    const providers = audit.chatbots?.providers ?? [];
    const isAIPowered = audit.chatbots?.isAIPowered ?? false;
    return { detected, providers, isAIPowered };
  };

  const getSocialBots = () => {
    const detected = audit.socialBots?.detected ?? 
                    audit.automation?.hasSocialBot ?? 
                    false;
    const platforms = audit.socialBots?.platforms ?? [];
    return { detected, platforms };
  };

  const getEstimatedValue = () => {
    return audit.opportunities?.estimatedValue ?? 
           audit.estimatedValue ?? 
           0;
  };

  const getProblems = () => {
    const critical = audit.problems?.critical ?? [];
    const important = audit.problems?.important ?? [];
    const minor = audit.problems?.minor ?? [];
    const legacy = audit.detectedProblems ?? [];
    return {
      critical,
      important,
      minor,
      all: [...critical, ...important, ...minor, ...legacy].filter(Boolean)
    };
  };

  // Extract all values
  const seoScore = getSeoScore();
  const performanceScore = getPerformanceScore();
  const accessibilityScore = getAccessibilityScore();
  const designScore = getDesignScore();
  const techStack = getTechStack();
  const chatbot = getChatbotInfo();
  const socialBots = getSocialBots();
  const estimatedValue = getEstimatedValue();
  const problems = getProblems();

  // Calculate overall score
  const overallScore = Math.round((seoScore + (designScore * 10)) / 2);

  // Log computed values
  console.log('COMPUTED VALUES:', {
    seoScore,
    performanceScore,
    accessibilityScore,
    designScore,
    overallScore,
    techStackCount: techStack.length,
    chatbotDetected: chatbot.detected,
    estimatedValue
  });

  const handleSendEmail = async () => {
    if (!audit.contactEmail) {
      alert('No contact email found');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: audit._id,
          recipientEmail: audit.contactEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEmailSent(true);
        onEmailSent();
        alert('✅ Email sent!');
      } else {
        alert('❌ ' + (data.error || 'Failed'));
      }
    } catch (error) {
      alert('❌ Error sending email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-2xl text-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {/* Score Badge */}
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-lg text-white font-black ${
                overallScore >= 70 ? 'bg-green-500' : 
                overallScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}>
                <div className="text-4xl">{overallScore}</div>
                <div className="text-xs">SCORE</div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {audit.businessName || 'Unknown'}
                </h3>
                <a
                  href={audit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white text-sm flex items-center gap-1"
                >
                  {audit.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            
            {audit.contactEmail && (
              <div className="bg-white/20 rounded-lg px-3 py-2 text-sm flex items-center gap-2 w-fit">
                <Mail className="w-4 h-4" />
                {audit.contactEmail}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              emailSent ? 'bg-green-500 text-white' : 'bg-white text-primary-700'
            }`}>
              {emailSent ? '✓ Sent' : 'Audited'}
            </div>
          </div>
        </div>

        {/* Value - Prominent */}
        {estimatedValue > 0 && (
          <div className="mt-4 bg-white/20 backdrop-blur rounded-xl p-4 border-2 border-white/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90">💰 POTENTIAL VALUE</div>
                <div className="text-4xl font-black">
                  ${estimatedValue.toLocaleString()}
                </div>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* SCORES */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            📊 SCORES
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* SEO */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-700 mb-1">SEO</div>
              <div className="text-4xl font-black text-blue-900">{seoScore}</div>
              <div className="text-xs text-blue-600">/100</div>
              <div className="mt-2 h-2 bg-blue-200 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${seoScore}%` }} />
              </div>
            </div>

            {/* Performance */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
              <div className="text-xs font-bold text-green-700 mb-1">PERFORMANCE</div>
              <div className="text-4xl font-black text-green-900">{performanceScore}</div>
              <div className="text-xs text-green-600">/100</div>
              <div className="mt-2 h-2 bg-green-200 rounded-full">
                <div className="h-full bg-green-600 rounded-full" style={{ width: `${performanceScore}%` }} />
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
              <div className="text-xs font-bold text-purple-700 mb-1">ACCESS</div>
              <div className="text-4xl font-black text-purple-900">{accessibilityScore}</div>
              <div className="text-xs text-purple-600">/100</div>
              <div className="mt-2 h-2 bg-purple-200 rounded-full">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${accessibilityScore}%` }} />
              </div>
            </div>

            {/* Design */}
            <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-4">
              <div className="text-xs font-bold text-pink-700 mb-1">DESIGN</div>
              <div className="text-4xl font-black text-pink-900">{designScore}</div>
              <div className="text-xs text-pink-600">/10</div>
              <div className="mt-2 h-2 bg-pink-200 rounded-full">
                <div className="h-full bg-pink-600 rounded-full" style={{ width: `${designScore * 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* TECH STACK */}
        {techStack.length > 0 && (
          <div className="mb-6 bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5" />
              ⚙️ TECH STACK ({techStack.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI DETECTION */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            🤖 AI DETECTION
          </h4>
          
          <div className="space-y-3">
            {/* Chatbot */}
            <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
              chatbot.detected 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-center gap-3">
                {chatbot.detected ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className="font-bold">Chatbot</div>
                  {chatbot.providers.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {chatbot.providers.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-3xl font-black ${
                chatbot.detected ? 'text-green-600' : 'text-red-600'
              }`}>
                {chatbot.detected ? '✓' : '✗'}
              </div>
            </div>

            {/* Social Bots */}
            <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
              socialBots.detected 
                ? 'bg-green-50 border-green-400' 
                : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex items-center gap-3">
                {socialBots.detected ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-3 border-gray-400" />
                )}
                <div>
                  <div className="font-bold">Social Bots</div>
                  {socialBots.platforms.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {socialBots.platforms.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-3xl font-black ${
                socialBots.detected ? 'text-green-600' : 'text-gray-400'
              }`}>
                {socialBots.detected ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </div>

        {/* PROBLEMS */}
        {problems.all.length > 0 && (
          <div className="mb-6 bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
            <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ⚠️ ISSUES ({problems.all.length})
            </h4>
            <ul className="space-y-2">
              {problems.all.slice(0, 5).map((problem, idx) => (
                <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{problem}</span>
                </li>
              ))}
              {problems.all.length > 5 && (
                <li className="text-sm text-amber-700 font-bold">
                  +{problems.all.length - 5} more issues
                </li>
              )}
            </ul>
          </div>
        )}

        {/* ACTION */}
        <button
          onClick={handleSendEmail}
          disabled={sendingEmail || !audit.contactEmail || emailSent}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            emailSent
              ? 'bg-green-600 text-white'
              : sendingEmail || !audit.contactEmail
              ? 'bg-gray-300 text-gray-500'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-xl transform hover:-translate-y-1'
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
              No Email
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Send Pitch {estimatedValue > 0 && `($${estimatedValue.toLocaleString()})`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}