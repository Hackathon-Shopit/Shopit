// tools/webpage-scraper-tool.ts
import { z } from 'zod';
import { tool } from 'ai';
import { streamText } from 'ai';
import FirecrawlApp from 'firecrawl';

// Define the schema for the tool parameters
export const webpageScraperToolParamsSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to scrape and convert to Markdown.'),
});

// Define the schema for the tool output
export const webpageScraperToolOutputSchema = z.object({
  markdown: z.string().describe('The Markdown content scraped from the webpage.'),
});

// Initialize Firecrawl client outside the function
const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('[Tool Error] Firecrawl API key is missing.');
}
const firecrawl = apiKey ? new FirecrawlApp({ apiKey }) : null;

export const webpageScraperTool = tool({
  description: 'Scrapes the given webpage URL using Firecrawl and returns Markdown content. Use this when a user asks to analyze, summarize, or extract content from a webpage or URL.',
  parameters: webpageScraperToolParamsSchema,
  execute: async ({ url }) => {
    console.log(`[Tool Execution] webpage_scraper called with url: "${url}"`);
    if (!firecrawl) {
      return { markdown: 'Firecrawl API key is missing or Firecrawl client not initialized.' };
    }
    try {
      // Scrape the webpage for markdown
      const result = await firecrawl.scrapeUrl(url, { formats: ['markdown'] });
      if (result && typeof result === 'object' && 'error' in result) {
        console.error('[Tool Error] Firecrawl error:', result.error);
        return { markdown: `Error scraping URL: ${url}. ${result.error}` };
      }
      if (!result.markdown) {
        return { markdown: `No markdown returned for URL: ${url}.` };
      }
      // Optionally, process the markdown with OpenAI (like video_recipe uses openai)
      // const processed = await streamText({
      //   model: openai('gpt-4o'),
      //   system: 'You are a markdown processor.',
      //   messages: [
      //     { role: 'user', content: result.markdown }
      //   ],
      //   maxTokens: 1000,
      // });
      // return { markdown: processed.text };
      return { markdown: result.markdown };
    } catch (error: any) {
      console.error('[Tool Error] Exception thrown scraping URL:', error);
      return { markdown: `Exception thrown scraping URL: ${url}. ${error?.message || error}` };
    }
  },
});
