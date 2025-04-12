import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArtifactRenderer } from './ArtifactRenderer';
import { ArtifactDisplayProps } from './types';

export function ArtifactDisplay({ artifact }: ArtifactDisplayProps) {
  return (
    <ScrollArea className="h-full p-4">
      {artifact ? (
        <div key={`artifact-container-${artifact.toolCallId}`} className="w-full">
          <ArtifactRenderer
            key={artifact.toolCallId}
            toolName={artifact.toolName}
            toolResult={artifact.toolResult}
            toolCallId={artifact.toolCallId}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select an artifact from the list.
        </div>
      )}
    </ScrollArea>
  );
}
