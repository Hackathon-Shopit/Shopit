import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArtifactsSidebarProps, ANIMATION_VARIANTS } from './types';

export function ArtifactsSidebar({ 
  artifacts, 
  selectedArtifactId, 
  onSelectArtifact, 
  isOpen 
}: ArtifactsSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="artifact-list-sidebar"
          initial="closed"
          animate="open"
          exit="closed"
          variants={ANIMATION_VARIANTS.sidebar}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-y-0 left-0 z-10 w-[200px] sm:w-[250px] bg-slate-200 border-r shadow-lg flex flex-col"
        >
          <div className="p-4 border-b">
            <h4 className="font-semibold text-md">Available Artifacts</h4>
          </div>
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {artifacts.map((artifact) => (
                <Button
                  key={artifact.toolCallId}
                  variant={selectedArtifactId === artifact.toolCallId ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => onSelectArtifact(artifact.toolCallId)}
                >
                  {artifact.displayName}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
