import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronsLeftRight, List } from 'lucide-react';
import { ArtifactsPanelHeaderProps } from './types';

export function ArtifactsPanelHeader({ 
  title, 
  onClose, 
  onMinimize, 
  onToggleSidebar 
}: ArtifactsPanelHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-slate-100 p-4 flex-shrink-0">
      {/* Left side: Custom Sidebar Trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Select artifact"
        onClick={onToggleSidebar}
      >
        <List className="h-4 w-4" />
      </Button>
     
      {/* Center: Current Artifact Title */}
      <h3 className="font-semibold text-lg truncate px-2">
        {title}
      </h3>

      {/* Right side: Minimize/Close Buttons */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" onClick={onMinimize} aria-label="Minimize artifacts panel">
          <ChevronsLeftRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close artifacts panel">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
