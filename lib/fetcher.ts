// lib/fetcher.ts
// Responsible for fetching website HTML

import axios from 'axios';

/**
 * Fetches the HTML content of a website
 * @param url - The website URL to fetch
 * @returns HTML content as string
 */
export async function fetchWebsiteHTML(url: string): Promise<string> {
  try {
    // Make sure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5, // Follow up to 5 redirects
    });

    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - website took too long to respond');
    }
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    }
    throw new Error(`Failed to fetch website: ${error.message}`);
  }
}