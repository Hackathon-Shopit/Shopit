import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Grocery Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about grocery stores, products, or recipes. The assistant can search the web to find up-to-date
          information when needed.
        </p>
      </div>

      <ChatInterface />
    </div>
  )
}
