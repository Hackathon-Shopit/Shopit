import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "firecrawl";

// Make sure your .env.local contains FIRECRAWL_API_KEY
const apiKey = process.env.FIRECRAWL_API_KEY;

if (!apiKey) {
  throw new Error("FIRECRAWL_API_KEY is not set in environment variables.");
}

const firecrawl = new FirecrawlApp({ apiKey });

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Use Firecrawl to scrape the URL and get markdown
    const result = await firecrawl.scrapeUrl(url, { formats: ["markdown"] });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ markdown: result.markdown });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
