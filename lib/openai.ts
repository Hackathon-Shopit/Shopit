import OpenAI from "openai"

// Create an OpenAI API client with better error handling
const apiKey = process.env.OPENAI_API_KEY || ""

// Validate API key format (basic check)
const isValidApiKey =
  apiKey && typeof apiKey === "string" && (apiKey.startsWith("sk-") || apiKey.startsWith("sk-proj-"))

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Only needed for client-side usage
})

// Check if OpenAI API key is configured
export const isOpenAIConfigured = isValidApiKey

export const defaultSystemPrompt = `You are a helpful grocery assistant that helps users find information about grocery stores, products, and recipes. 
You can search the web to find up-to-date information when needed.
Always be concise, helpful, and friendly in your responses.
If you don't know something, you can offer to search the web for more information.`
