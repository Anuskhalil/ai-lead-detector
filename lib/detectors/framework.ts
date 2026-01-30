// lib/detectors/framework.ts
// Detects if website uses Modern or Legacy framework

import * as cheerio from 'cheerio';
import { FrameworkResult } from '../../types';

// Modern framework patterns
const MODERN_FRAMEWORKS = {
  react: ['react.js', '_next', '__next', 'react-dom', '_react'],
  vue: ['vue.js', 'vuejs', '__vue__', 'vue.min'],
  angular: ['angular.js', 'ng-app', 'ng-version', '@angular'],
  nextjs: ['_next', '__next', 'next.js', 'nextjs'],
  nuxt: ['__nuxt', 'nuxt.js'],
  svelte: ['svelte'],
  gatsby: ['gatsby', '__gatsby'],
};

// Legacy technology indicators
const LEGACY_INDICATORS = {
  jquery: ['jquery', 'jquery.min.js', 'jquery-'],
  php: ['.php', 'php-', 'phpinfo'],
  wordpress: ['wp-content', 'wp-includes', 'wordpress'],
  oldBootstrap: ['bootstrap/3', 'bootstrap.min.css'],
  asp: ['.aspx', 'asp.net'],
  joomla: ['joomla', '/components/com_'],
};

/**
 * Detects the framework/technology used by the website
 * @param html - HTML content of the website
 * @param $ - Cheerio instance
 * @returns FrameworkResult object
 */
export function detectFramework(html: string, $: cheerio.CheerioAPI): FrameworkResult {
  const htmlLower = html.toLowerCase();
  const detectedFrameworks: string[] = [];
  const detectedLegacy: string[] = [];

  // Check for modern frameworks
  $('script, meta, link').each((_, elem) => {
    const src = $(elem).attr('src')?.toLowerCase() || '';
    const href = $(elem).attr('href')?.toLowerCase() || '';
    const content = $(elem).html()?.toLowerCase() || '';
    const combined = src + ' ' + href + ' ' + content;

    // Check modern frameworks
    for (const [framework, patterns] of Object.entries(MODERN_FRAMEWORKS)) {
      for (const pattern of patterns) {
        if (combined.includes(pattern)) {
          detectedFrameworks.push(framework);
          break;
        }
      }
    }

    // Check legacy indicators
    for (const [tech, patterns] of Object.entries(LEGACY_INDICATORS)) {
      for (const pattern of patterns) {
        if (combined.includes(pattern)) {
          detectedLegacy.push(tech);
          break;
        }
      }
    }
  });

  // Check meta generator tag
  const generator = $('meta[name="generator"]').attr('content')?.toLowerCase();
  if (generator) {
    if (generator.includes('wordpress')) detectedLegacy.push('wordpress');
    if (generator.includes('joomla')) detectedLegacy.push('joomla');
    if (generator.includes('drupal')) detectedLegacy.push('drupal');
  }

  // Remove duplicates
  const uniqueFrameworks = [...new Set(detectedFrameworks)];
  const uniqueLegacy = [...new Set(detectedLegacy)];

  // Determine type
  let type: 'Modern' | 'Legacy' | 'Unknown' = 'Unknown';
  let detected: string[] = [];

  if (uniqueFrameworks.length > 0) {
    type = 'Modern';
    detected = uniqueFrameworks;
  } else if (uniqueLegacy.length > 0) {
    type = 'Legacy';
    detected = uniqueLegacy;
  }

  return {
    type,
    detected,
  };
}