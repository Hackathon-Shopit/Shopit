"use client"

import { useEffect, useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function ChatPage() {
  const [apiKeyStatus, setApiKeyStatus] = useState<"loading" | "valid" | "invalid">("loading")

  useEffect(() => {
    // Check API key status
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-openai")
        const data = await response.json()

        if (data.isConfigured) {
          setApiKeyStatus("valid")
        } else {
          setApiKeyStatus("invalid")
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setApiKeyStatus("valid") // Assume valid to avoid false negatives
      }
    }

    checkApiKey()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Grocery Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about grocery stores, products, or recipes. The assistant can search the web to find up-to-date
          information when needed.
        </p>
      </div>

      {apiKeyStatus === "loading" ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading chat interface...</span>
        </div>
      ) : apiKeyStatus === "invalid" ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            The OpenAI API key is not configured or is invalid. Please check your environment variables.
          </AlertDescription>
        </Alert>
      ) : (
        <ChatInterface />
      )}
    </div>
  )
}
