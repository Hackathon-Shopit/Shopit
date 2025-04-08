import { openai, isOpenAIConfigured } from "./openai"

export async function searchWeb(query: string): Promise<string> {
  try {
    // Check if OpenAI API key is configured
    if (!isOpenAIConfigured) {
      throw new Error("OpenAI API key is not configured or invalid")
    }

    // In a production app, you would integrate with a real search API
    // For this demo, we'll simulate web search by asking the AI to generate search results
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a web search simulator. Given a query, provide realistic search results as if you searched the web.
          Format your response as a list of 3-5 search results with titles, URLs, and brief descriptions.
          Make the results realistic and relevant to the query.`,
        },
        {
          role: "user",
          content: `Search query: ${query}`,
        },
      ],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || "No search results found."
  } catch (error: any) {
    console.error("Error searching web:", error)
    throw new Error(error.message || "Error searching the web")
  }
}
