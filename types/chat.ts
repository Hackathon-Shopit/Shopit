export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
  pending?: boolean
}

export interface SearchResult {
  title: string
  url: string
  description: string
}
