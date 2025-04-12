import React from 'react';
import { Message } from 'ai';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
  isLoading: boolean; // Is the specific message loading (passed from list)
  isLastMessage: boolean; // Is this the last message in the list?
}

export function ChatMessage({ message, isLoading, isLastMessage }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasRecipeIngredientsResult = message.role === 'assistant' && message.toolInvocations?.some(
    (tool) => tool.toolName === 'displayRecipeIngredients' && tool.state === 'result'
  );
  const hasPendingToolCalls = message.role === 'assistant' && message.toolInvocations?.some(
    (t) => t.state !== 'result'
  );

  return (
    <div
      key={message.id}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex max-w-[80%] items-start space-x-2 rounded-lg p-3 ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <div className="flex h-full w-full items-center justify-center bg-primary text-xs text-primary-foreground">
              AI
            </div>
          </Avatar>
        )}
        <div className="flex flex-col">
          {/* Display content - potentially truncated if artifact is present */}
          <div className="whitespace-pre-wrap">
            {hasRecipeIngredientsResult
              ? message.content.split('###')[0]?.trim() // Show only intro if recipe is displayed separately
              : message.content}
          </div>

          {/* Inline loading indicators for pending tool calls within this message */}
          {hasPendingToolCalls && (
            <div className="mt-2">
              {message.toolInvocations?.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;
                if (state !== 'result') {
                  return (
                    <div key={toolCallId}>
                      {toolName === 'displayRecipeIngredients' ? (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Finding ingredients...</span>
                        </div>
                      ) : null /* Add other tool loading states here */}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* General loading indicator for the last assistant message if overall chat is loading */}
          {/* Use isLastMessage prop instead of accessing messages array */}
          {isLoading && !isUser && isLastMessage && (
             <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground self-end" />
           )}
        </div>
      </div>
    </div>
  );
}

// Removed the placeholder declaration for 'messages'
