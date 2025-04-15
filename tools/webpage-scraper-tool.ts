// tools/webpage-scraper-tool.ts
import { z } from 'zod';
import { tool } from 'ai';

// Define the schema for the tool parameters
export const webpageScraperToolParamsSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to scrape and convert to Markdown.'),
});

// Define the schema for the tool output
export const webpageScraperToolOutputSchema = z.object({
  markdown: z.string().describe('The Markdown content scraped from the webpage.'),
});

export const webpageScraperTool = tool({
  description: 'Scrapes the given webpage URL using Firecrawl and returns Markdown content. Use this when a user asks to analyze, summarize, or extract content from a webpage or URL.',
  parameters: webpageScraperToolParamsSchema,
  execute: async ({ url }) => {
    console.log(`[Tool Execution] webpage_scraper called with url: "${url}"`);
    try {
      // Use absolute URL on server, relative on client
      let apiUrl = '/api/scrape';
      if (typeof window === 'undefined') {
        // Server-side: must use absolute URL
        const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        apiUrl = `${base}/api/scrape`;
      }
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      let debugInfo = `Request: POST ${apiUrl} with body { url: ${url} }\n`;
      debugInfo += `Response status: ${res.status}\n`;
      let data: any = {};
      try {
        data = await res.json();
        debugInfo += `Response body: ${JSON.stringify(data)}\n`;
      } catch (jsonErr) {
        debugInfo += `Failed to parse JSON response: ${jsonErr}\n`;
      }
      if (!res.ok) {
        return {
          markdown: `Failed to scrape URL: ${url}. Status: ${res.status}\n${debugInfo}`
        };
      }
      if (data.error) {
        return {
          markdown: `Error scraping URL: ${url}. ${data.error}\n${debugInfo}`
        };
      }
      if (!data.markdown) {
        return {
          markdown: `No markdown returned for URL: ${url}.\n${debugInfo}`
        };
      }
      return {
        markdown: data.markdown,
        debug: debugInfo
      };
    } catch (error: any) {
      return {
        markdown: `Exception thrown scraping URL: ${url}. ${error?.message || error}`,
        debug: `Stack: ${error?.stack || 'No stack.'}`
      };
    }
  },
});
