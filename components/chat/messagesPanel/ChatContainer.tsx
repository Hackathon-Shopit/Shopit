"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { ChatMessagesList } from "./ChatMessagesList";
import { ArtifactsPanel } from "../artifactsPanel/ArtifactsPanel";
import { ChatInputForm } from "./ChatInputForm";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"; // Import Resizable components

export function ChatContainer() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit,
    isLoading,
    stop,
    setInput // Destructure setInput from useChat
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

  // State for panel visibility and minimized status
  const [showArtifactsPanel, setShowArtifactsPanel] = useState(false);
  const [isArtifactsMinimized, setIsArtifactsMinimized] = useState(false);

  // Function to completely hide the panel
  const handleCloseArtifactsPanel = () => {
    setShowArtifactsPanel(false);
    setIsArtifactsMinimized(false); // Reset minimized state when closing
  };

  // Function to minimize the panel
  const handleMinimizeArtifactsPanel = () => {
    setIsArtifactsMinimized(true);
  };

  // Function to expand the panel
  const handleExpandArtifactsPanel = () => {
    setIsArtifactsMinimized(false);
  };

  // Effect to show the panel when new artifacts are available
  useEffect(() => {
    const hasArtifacts = messages.some(
      (m) => m.role === 'assistant' && m.toolInvocations?.some((t) => t.state === 'result')
    );
    if (hasArtifacts) {
      setShowArtifactsPanel(true);
    }
    // We might want to reconsider if it should *always* reopen on new artifacts,
    // or only if it was previously closed. For now, it reopens.
  }, [messages]);


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border">
      {/* <ChatHeader title="AI Shopping Assistant" /> */}

      {/* Use ResizablePanelGroup for the main content area */}
      <ResizablePanelGroup 
        direction="horizontal"
        className="flex flex-1 overflow-hidden"
        // Optionally, store/restore layout if needed:
        // autoSaveId="chatLayout" 
      >
        {/* Panel for ChatMessagesList - Adjust size based on panel visibility/state */}
        <ResizablePanel 
          defaultSize={showArtifactsPanel ? (isArtifactsMinimized ? 95 : 60) : 100} 
          minSize={30}
          order={1} // Explicit ordering
        > 
          <div className="flex h-full flex-col">
            <ChatMessagesList messages={messages} isLoading={isLoading} />
          </div>
        </ResizablePanel>
        
        {/* Conditionally render the handle and the artifacts panel container */}
        {showArtifactsPanel && (
          <>
            {/* Hide handle when minimized? Or keep it? Let's keep it for now. */}
            <ResizableHandle withHandle /> 
            <ResizablePanel 
              defaultSize={isArtifactsMinimized ? 5 : 40} 
              minSize={isArtifactsMinimized ? 5 : 20} // Smaller min size when minimized
              maxSize={isArtifactsMinimized ? 5 : 70} // Smaller max size when minimized
              collapsible={true} // Allow collapsing
              collapsedSize={5} // Size when collapsed (matches minimized state)
              onCollapse={() => { // Sync state if collapsed via handle/API
                setIsArtifactsMinimized(true);
              }}
              onExpand={() => { // Sync state if expanded via handle/API
                setIsArtifactsMinimized(false);
              }}
              order={2} // Explicit ordering
              className={isArtifactsMinimized ? "min-w-[50px]" : ""} // Ensure minimum width for icons
            >
              {/* ArtifactsPanel now receives minimize/expand state and handlers */}
              <ArtifactsPanel 
                messages={messages} 
                onClose={handleCloseArtifactsPanel} // To hide completely
                isMinimized={isArtifactsMinimized}
                onMinimize={handleMinimizeArtifactsPanel}
                onExpand={handleExpandArtifactsPanel}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Input form remains at the bottom */}
      <ChatInputForm 
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        setInput={setInput} // Pass setInput down
      />
    </div>
  );
}
