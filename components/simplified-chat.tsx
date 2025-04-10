"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SimplifiedChat() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit,
    isLoading,
    stop 
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        content: "Hello! I'm your shopping assistant. How can I help you today?",
        role: "assistant",
      },
    ],
  });

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">AI Shopping Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start space-x-2 rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
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
                <div className="whitespace-pre-wrap">{message.content}</div>
                {isLoading && message.role === "assistant" && message === messages[messages.length - 1] && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        {isLoading && (
          <div className="mb-2 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => stop()}
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="6" width="12" height="12" />
              </svg>
              Stop Generating
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
} 