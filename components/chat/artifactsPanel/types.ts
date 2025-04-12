import { Message } from 'ai';

// Shared type for processed artifacts
export interface Artifact {
  toolName: string;
  toolResult: any;
  toolCallId: string;
  displayName: string;
}

// Common props shared between components
export interface ArtifactsPanelBaseProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
}

// Main panel props
export interface ArtifactsPanelProps extends ArtifactsPanelBaseProps {
  messages: Message[];
}

// Props for header component
export interface ArtifactsPanelHeaderProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onToggleSidebar: () => void;
}

// Props for sidebar component
export interface ArtifactsSidebarProps {
  artifacts: Artifact[];
  selectedArtifactId: string | null;
  onSelectArtifact: (id: string) => void;
  isOpen: boolean;
}

// Props for display component
export interface ArtifactDisplayProps {
  artifact: Artifact | undefined;
}

// Props for minimized panel
export interface MinimizedPanelProps {
  onExpand: () => void;
}

// Animation variants
export const ANIMATION_VARIANTS = {
  panel: {
    expanded: { opacity: 1, width: '100%' },
    minimized: { opacity: 0, width: '0%' }
  },
  minimizedBar: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  sidebar: {
    closed: { x: "-100%", opacity: 0 },
    open: { x: "0%", opacity: 1 }
  }
};
