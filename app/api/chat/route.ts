import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ollama, defaultOllamaModel, ollamaSystemPrompt, isOllamaEnabled, } from '@/lib/ollama';
import { tools } from '@/ai/tools';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Define default system prompt
const defaultSystemPrompt = `You are an AI shopping assistant that helps users with questions about products, shopping recommendations, price comparisons, finding the best deals, and recipe ingredients. You can also find recipe videos.

When a user asks about ingredients for a recipe or dish:
1. Use the displayRecipeIngredients tool to provide a structured list of ingredients.
2. Keep your text response brief and don't list all ingredients in your text response since they will be displayed by the tool.
3. Focus on providing a brief introduction and possibly cooking instructions if requested.

When a user asks for recipe videos (e.g., on YouTube):
1. Use the video_recipe tool to search for relevant videos based on their query.
2. DO NOT make up video information; rely solely on the tool's output.
3. Keep your text response brief and DO NOT list all videos in your text response since they will be displayed by the tool.
4. DO NOT show the video results or links in your text response and keep your answers brief.
5. your text response should be something like : here are the videos I found for you

When a user asks for shopping cart items:
1. Use the displayShoppingCart tool to show the current contents of the shopping cart.
2. Keep your text response brief and DO NOT list all items in your text response since they will be displayed by the tool.

For all other queries, provide helpful, accurate information and suggestions based on the user's needs.`

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
      // Note: Ollama provider does not support tools and maxSteps
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
        tools,
        maxSteps: 5,
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
