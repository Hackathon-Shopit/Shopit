import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ollama, defaultOllamaModel, ollamaSystemPrompt, isOllamaEnabled } from '@/lib/ollama';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define default system prompt
const defaultSystemPrompt = "You are an AI shopping assistant that helps users with questions about products, shopping recommendations, price comparisons, and finding the best deals. Provide helpful, accurate information and suggestions based on the user's needs."

export async function POST(req: Request) {
  try {
    // Parse request data
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid messages format" },
        { status: 400 }
      )
    }

    // Check which provider to use
    if (isOllamaEnabled) {
      // Using Ollama provider
      // Use the streamText function from AI SDK with Ollama provider
      const result = streamText({
        model: ollama(defaultOllamaModel),
        system: ollamaSystemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 1000,
      });

      // Return the result as a stream
      return result.toDataStreamResponse();
    } else {
      // Using OpenAI provider
      // Verify API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return Response.json(
          { error: "OpenAI API key is not configured. Please set a valid OPENAI_API_KEY environment variable." },
          { status: 500 }
        )
      }

      // Use the streamText function from AI SDK to handle the chat with OpenAI
      const result = streamText({
        model: openai('gpt-4o'),
        system: defaultSystemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 1000,
      });

      // Return the result as a stream
      return result.toDataStreamResponse();
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
