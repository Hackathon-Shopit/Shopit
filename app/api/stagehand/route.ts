import { NextResponse } from "next/server";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

// Define the expected request body schema
const requestSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { query } = validation.data;

    // Initialize Stagehand client
    const stagehand = new Stagehand({
      env: "LOCAL", // Or "BROWSERBASE"
      localBrowserLaunchOptions: {
        headless: false, // Set to true for production/CI if needed
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    });
    await stagehand.init();

    console.log(`[Stagehand API] Starting commands for query: ${query}`);

    try {
      // Construct the search URL
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://www.walmart.com/search?q=${encodedQuery}`;
      console.log(`[Stagehand API] Navigating to search results: ${searchUrl}`);
      await stagehand.page.goto(searchUrl); // Navigate to the constructed URL

      // If goto completes without error, navigation was successful
      console.log("[Stagehand API] Navigation successful.");

      // Close the browser session (keep it open for testing)
      //await stagehand.close();

      // Return success message
      return NextResponse.json({
        message: `Successfully navigated to Walmart search for query: ${query}`,
      });
    } catch (error: any) {
      // Catch errors during navigation or other Stagehand operations
      console.error("[Stagehand API Error during execution]", error);
      await stagehand.close(); // Use stagehand.close()
      return NextResponse.json(
        { error: "Failed to execute Stagehand task", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // Catch errors during initial setup (body parsing, validation)
    console.error("[Stagehand API Setup Error]", error);
    return NextResponse.json(
      { error: "Failed to execute Stagehand task", details: error.message },
      { status: 500 }
    )
  }
}
