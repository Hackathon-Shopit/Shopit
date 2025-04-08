"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Search, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/lib/hooks/use-user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
  pending?: boolean
}

export function ChatInterface() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your grocery assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "search">("chat")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    if (user) {
      const savedMessages = localStorage.getItem(`chat-history-${user.id}`)
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          // Only set if there are messages and it's an array
          if (parsedMessages && Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            // Convert string timestamps back to Date objects
            const messagesWithDates = parsedMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
            setMessages(messagesWithDates)
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      }
    }
  }, [user])

  // Save chat history to localStorage
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chat-history-${user.id}`, JSON.stringify(messages))
    }
  }, [messages, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Clear any previous errors
    setError(null)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Add temporary assistant message
    const tempAssistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      pending: true,
    }

    setMessages((prev) => [...prev, userMessage, tempAssistantMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare messages for API (excluding the temporary assistant message)
      const apiMessages = [
        ...messages.filter((m) => !m.pending).map(({ role, content }) => ({ role, content })),
        { role: userMessage.role, content: userMessage.content },
      ]

      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.details || `Server error: ${response.status}`
        throw new Error(errorMessage)
      }

      // Update the assistant message with the response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMessage.id
            ? { ...msg, content: data.content || "No response from assistant", pending: false }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")

      // Update the temporary message with an error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMessage.id
            ? {
                ...msg,
                content: "Sorry, there was an error processing your request. Please try again.",
                pending: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults(null)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.details || `Server error: ${response.status}`
        throw new Error(errorMessage)
      }

      setSearchResults(data.results)
    } catch (error) {
      console.error("Error searching:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setSearchResults("Error searching. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleUseSearchResults = () => {
    if (!searchResults) return

    // Add the search results to the chat
    const searchMessage: Message = {
      id: Date.now().toString(),
      content: `Search results for "${searchQuery}":\n\n${searchResults}`,
      role: "system",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, searchMessage])
    setActiveTab("chat")
    setSearchQuery("")
    setSearchResults(null)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your grocery assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    setError(null)
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg border">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chat" | "search")} className="w-full">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">AI Grocery Assistant</h2>
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="search">Web Search</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Chat
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-4 mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="chat" className="flex-1 flex flex-col data-[state=inactive]:hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : message.role === "system"
                        ? "justify-center"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] items-start space-x-2 rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-muted/50 text-foreground"
                          : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <div className="flex h-full w-full items-center justify-center bg-primary text-xs text-primary-foreground">
                          AI
                        </div>
                      </Avatar>
                    )}
                    <div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <p className="mt-1 text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                    {message.pending && <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 border-t p-4">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="search" className="flex-1 flex flex-col data-[state=inactive]:hidden">
          <div className="flex-1 p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search the web..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="sr-only">Search</span>
              </Button>
            </form>

            {isSearching && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {searchResults && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                  <div className="whitespace-pre-wrap">{searchResults}</div>
                </div>
                <Button onClick={handleUseSearchResults}>Use These Results in Chat</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
