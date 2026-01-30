// lib/detectors/seo.ts
// Analyzes SEO health of the website

import * as cheerio from 'cheerio';
import { SEOResult } from '../../types';

/**
 * Analyzes the SEO health of a website
 * Checks for: Title, Meta Description, H1 tags, Alt text
 * @param $ - Cheerio instance
 * @returns SEOResult object with score and issues
 */
export function analyzeSEO($: cheerio.CheerioAPI): SEOResult {
  const issues: string[] = [];
  let score = 100; // Start with perfect score

  // 1. Check Title Tag
  const titleTag = $('title');
  const hasTitle = titleTag.length > 0 && titleTag.text().trim().length > 0;
  
  if (!hasTitle) {
    issues.push('Missing or empty title tag');
    score -= 30;
  } else {
    const titleLength = titleTag.text().trim().length;
    if (titleLength < 30) {
      issues.push('Title tag too short (should be 30-60 characters)');
      score -= 10;
    } else if (titleLength > 60) {
      issues.push('Title tag too long (should be 30-60 characters)');
      score -= 5;
    }
  }

  // 2. Check Meta Description - FIXED
  const metaDescription = $('meta[name="description"]');
  const metaContent = metaDescription.attr('content');
  const hasMetaDescription = metaDescription.length > 0 && !!metaContent; // Convert to boolean
  
  if (!hasMetaDescription) {
    issues.push('Missing meta description');
    score -= 25;
  } else {
    const descLength = metaContent?.length || 0;
    if (descLength < 120) {
      issues.push('Meta description too short (should be 120-160 characters)');
      score -= 10;
    } else if (descLength > 160) {
      issues.push('Meta description too long (should be 120-160 characters)');
      score -= 5;
    }
  }

  // 3. Check H1 Tag
  const h1Tags = $('h1');
  const hasH1 = h1Tags.length > 0;
  
  if (!hasH1) {
    issues.push('Missing H1 heading tag');
    score -= 20;
  } else if (h1Tags.length > 1) {
    issues.push(`Multiple H1 tags found (${h1Tags.length}). Should have only one.`);
    score -= 10;
  }

  // 4. Check Alt Attributes on Images
  const allImages = $('img');
  const imagesWithoutAlt = $('img:not([alt])');
  
  if (allImages.length > 0 && imagesWithoutAlt.length > 0) {
    const percentage = Math.round((imagesWithoutAlt.length / allImages.length) * 100);
    issues.push(`${imagesWithoutAlt.length} of ${allImages.length} images (${percentage}%) missing alt text`);
    score -= Math.min(15, Math.floor(percentage / 10));
  }

  // 5. Check for Canonical Tag
  const canonicalTag = $('link[rel="canonical"]');
  if (canonicalTag.length === 0) {
    issues.push('Missing canonical tag');
    score -= 5;
  }

  // 6. Check for Open Graph Tags (for social sharing)
  const ogTags = $('meta[property^="og:"]');
  if (ogTags.length === 0) {
    issues.push('Missing Open Graph tags for social media sharing');
    score -= 5;
  }

  // Make sure score doesn't go below 0
  score = Math.max(score, 0);

  return {
    score,
    hasTitle,
    hasMetaDescription,
    hasH1,
    issues,
  };
}