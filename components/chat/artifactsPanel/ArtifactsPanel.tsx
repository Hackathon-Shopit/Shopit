import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import shared types and utilities
import { ArtifactsPanelProps, Artifact, ANIMATION_VARIANTS } from './types';
import { processArtifacts } from './utils';

// Import components
import { ArtifactsPanelHeader } from './ArtifactsPanelHeader';
import { ArtifactsSidebar } from './ArtifactsSidebar';
import { ArtifactDisplay } from './ArtifactDisplay';
import { MinimizedPanel } from './MinimizedPanel';

export function ArtifactsPanel({
  messages,
  onClose,
  isMinimized,
  onMinimize,
  onExpand
}: ArtifactsPanelProps) {
  // --- State for Artifact Selection ---
  const [selectedArtifactCallId, setSelectedArtifactCallId] = useState<string | null>(null);
  const [isListSidebarOpen, setIsListSidebarOpen] = useState(false);

  // --- Process Artifacts ---
  // Memoize the processed list of artifacts to avoid recalculating on every render
  const availableArtifacts = useMemo(() => processArtifacts(messages), [messages]);

  // --- Effect to Always Select Latest Artifact ---
  useEffect(() => {
    // Always select the latest artifact when the list changes
    if (availableArtifacts.length > 0) {
      const latestArtifactId = availableArtifacts[0].toolCallId;
      // Check if the latest artifact is already selected
      if (selectedArtifactCallId !== latestArtifactId) {
        setSelectedArtifactCallId(latestArtifactId);
      }
    } else {
      // If there are no artifacts, clear the selection
      setSelectedArtifactCallId(null);
    }
  }, [availableArtifacts]);

  // --- Find the artifact to render ---
  const artifactToRender = availableArtifacts.find(a => a.toolCallId === selectedArtifactCallId);

  // --- Return null if no artifacts exist ---
  if (availableArtifacts.length === 0) {
    return null;
  }

  // --- Handlers ---
  const handleToggleSidebar = () => setIsListSidebarOpen(!isListSidebarOpen);
  
  const handleSelectArtifact = (artifactId: string) => {
    setSelectedArtifactCallId(artifactId);
    setIsListSidebarOpen(false); // Close sidebar on selection
  };

  return (
    // Main container remains relative for positioning children
    <div className="border-l bg-slate-50 flex flex-col h-full overflow-hidden relative">
      <AnimatePresence initial={false}>
        {!isMinimized && (
          // Container for the expanded view (header + content area)
          <motion.div
            key="expanded-panel"
            initial="minimized"
            animate="expanded"
            exit="minimized"
            variants={ANIMATION_VARIANTS.panel}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col h-full w-full absolute inset-0"
          >
            {/* Header Component */}
            <ArtifactsPanelHeader
              title={artifactToRender?.displayName || 'Artifacts'}
              onClose={onClose}
              onMinimize={onMinimize}
              onToggleSidebar={handleToggleSidebar}
            />

            {/* Main Content Area with relative positioning for sidebar */}
            <div className="flex-1 relative overflow-hidden">
              {/* Sidebar Component */}
              <ArtifactsSidebar
                artifacts={availableArtifacts}
                selectedArtifactId={selectedArtifactCallId}
                onSelectArtifact={handleSelectArtifact}
                isOpen={isListSidebarOpen}
              />

              {/* Artifact Display Component */}
              <ArtifactDisplay artifact={artifactToRender} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && <MinimizedPanel onExpand={onExpand} />}
      </AnimatePresence>
    </div>
  );
}
