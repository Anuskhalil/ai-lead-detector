// utils/export.ts
// Utility functions for exporting detection results

import { DetectionResult } from '../types';

/**
 * Exports detection results to CSV format
 * @param results - Array of detection results
 * @param filename - Optional filename (default: leads-[date].csv)
 */
export function exportToCSV(results: DetectionResult[], filename?: string): void {
  // Create CSV header
  const headers = [
    'URL',
    'Timestamp',
    'Lead Quality',
    'Has Chatbot',
    'Chatbot Services',
    'Has Voice Assistant',
    'Has Social Bot',
    'Framework Type',
    'Framework Details',
    'SEO Score',
    'Mobile Responsive',
    'Total Opportunities',
    'Opportunities List',
  ].join(',');

  // Create CSV rows
  const rows = results.map((result) => {
    const row = [
      `"${result.url}"`,
      `"${new Date(result.timestamp).toLocaleString()}"`,
      result.leadQuality,
      result.chatbot.hasChatbot ? 'Yes' : 'No',
      `"${result.chatbot.detectedServices.join(', ')}"`,
      result.voiceAssistant.hasVoiceAssistant ? 'Yes' : 'No',
      result.socialMediaBot.hasSocialBot ? 'Yes' : 'No',
      result.framework.type,
      `"${result.framework.detected.join(', ')}"`,
      `${result.seo.score}%`,
      result.design.isMobileResponsive ? 'Yes' : 'No',
      result.opportunities.length,
      `"${result.opportunities.join(' | ')}"`,
    ];
    return row.join(',');
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || `leads-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Exports detection results to JSON format
 * @param results - Array of detection results
 * @param filename - Optional filename (default: leads-[date].json)
 */
export function exportToJSON(results: DetectionResult[], filename?: string): void {
  const jsonContent = JSON.stringify(results, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || `leads-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}