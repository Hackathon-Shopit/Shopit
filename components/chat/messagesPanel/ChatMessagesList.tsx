import React, { useEffect, useRef } from 'react';
import { Message } from 'ai';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';

interface ChatMessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessagesList({ messages, isLoading }: ChatMessagesListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for the outer ScrollArea component

  // Scroll to bottom when new messages are added or loading state changes
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            // Pass the overall isLoading state
            isLoading={isLoading} 
            // Determine if this is the last message
            isLastMessage={index === messages.length - 1} 
          />
        ))}
      </div>
    </ScrollArea>
  );
}
