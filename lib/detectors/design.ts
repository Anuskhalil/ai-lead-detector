// lib/detectors/design.ts
// Analyzes design quality and mobile responsiveness

import * as cheerio from 'cheerio';
import { DesignResult } from '../../types';

/**
 * Analyzes the design quality of a website
 * Checks for: Mobile responsiveness, Modern layout, Image optimization
 * @param html - HTML content of the website
 * @param $ - Cheerio instance
 * @returns DesignResult object
 */
export function analyzeDesign(html: string, $: cheerio.CheerioAPI): DesignResult {
  const issues: string[] = [];
  const htmlLower = html.toLowerCase();

  // 1. Check for Mobile Responsiveness (Viewport Meta Tag)
  const viewportTag = $('meta[name="viewport"]');
  const isMobileResponsive = viewportTag.length > 0;

  if (!isMobileResponsive) {
    issues.push('No viewport meta tag - Not mobile optimized');
  }

  // 2. Check for Modern CSS Frameworks
  const hasModernCSS =
    htmlLower.includes('tailwind') ||
    htmlLower.includes('bootstrap/5') ||
    htmlLower.includes('bootstrap/4') ||
    htmlLower.includes('material-ui') ||
    htmlLower.includes('chakra-ui');

  // 3. Check for Modern Layout Techniques (Flexbox/Grid)
  const hasFlexbox =
    htmlLower.includes('display: flex') ||
    htmlLower.includes('display:flex') ||
    htmlLower.includes('flex-') ||
    htmlLower.includes('d-flex');

  const hasGrid =
    htmlLower.includes('display: grid') ||
    htmlLower.includes('display:grid') ||
    htmlLower.includes('grid-') ||
    htmlLower.includes('css grid');

  const hasModernLayout = hasModernCSS || hasFlexbox || hasGrid;

  if (!hasModernLayout) {
    issues.push('Using outdated layout techniques (no Flexbox/Grid detected)');
  }

  // 4. Check Image Optimization
  let hasUnoptimizedImages = false;
  const images = $('img');

  images.each((_, elem) => {
    const src = $(elem).attr('src')?.toLowerCase() || '';
    
    // Check if using modern image formats
    const isModernFormat = src.includes('.webp') || src.includes('.avif');
    
    // Check if using srcset for responsive images
    const hasSrcset = $(elem).attr('srcset');
    
    // Check if using lazy loading
    const hasLazyLoad = $(elem).attr('loading') === 'lazy';

    if (!isModernFormat && !hasSrcset && !hasLazyLoad) {
      hasUnoptimizedImages = true;
    }
  });

  if (hasUnoptimizedImages && images.length > 0) {
    issues.push('Images not optimized (consider WebP format, srcset, and lazy loading)');
  }

  // 5. Check for Inline Styles (Bad Practice)
  const elementsWithInlineStyle = $('[style]');
  if (elementsWithInlineStyle.length > 10) {
    issues.push(`Excessive inline styles detected (${elementsWithInlineStyle.length} elements)`);
  }

  // 6. Check for Favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]');
  if (favicon.length === 0) {
    issues.push('Missing favicon');
  }

  // 7. Check for Table-based Layout (Very Old Practice)
  const layoutTables = $('table[width*="%"]');
  if (layoutTables.length > 0) {
    issues.push('Using table-based layout (very outdated)');
  }

  return {
    isMobileResponsive,
    hasModernLayout,
    issues,
  };
}