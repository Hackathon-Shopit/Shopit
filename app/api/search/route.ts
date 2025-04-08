import { NextResponse } from "next/server"
import { searchWeb } from "@/lib/web-search"
import { isOpenAIConfigured } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is configured
    if (!isOpenAIConfigured) {
      console.error("OPENAI_API_KEY is not configured or invalid")
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured or invalid. Please set a valid OPENAI_API_KEY environment variable.",
        },
        { status: 500 },
      )
    }

    let requestData
    try {
      requestData = await req.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { query } = requestData || {}

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    try {
      const results = await searchWeb(query)
      return NextResponse.json({ results })
    } catch (searchError: any) {
      console.error("Search error:", searchError)
      return NextResponse.json(
        { error: "Search error", details: searchError.message || "Unknown search error" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
