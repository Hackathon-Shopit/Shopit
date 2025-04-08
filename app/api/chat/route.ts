import { NextResponse } from "next/server"
import { openai, defaultSystemPrompt, isOpenAIConfigured } from "@/lib/openai"

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

    const { messages } = requestData || {}

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Add system message if it doesn't exist
    const messagesWithSystem = [...messages]
    if (!messagesWithSystem.find((m: any) => m.role === "system")) {
      messagesWithSystem.unshift({
        role: "system",
        content: defaultSystemPrompt,
      })
    }

    // Use a non-streaming approach for simplicity and reliability
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messagesWithSystem,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ""
      return NextResponse.json({ content })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Extract useful error information
      const statusCode = openaiError.status || 500
      const errorMessage = openaiError.message || "Unknown OpenAI error"
      const errorType = openaiError.type || "api_error"

      return NextResponse.json(
        {
          error: "OpenAI API error",
          details: errorMessage,
          type: errorType,
        },
        { status: statusCode },
      )
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
