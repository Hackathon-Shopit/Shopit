import { RecipeIngredients } from '@/components/artifacts/recipe-ingredients';
import { ShoppingCart } from '@/components/artifacts/ShoppingCart';
import { YouTubeVideoResults } from '@/components/artifacts/YouTubeVideoResults'; 
import { WebpageMarkdownArtifact } from '@/components/artifacts/WebpageMarkdownArtifact';

interface ArtifactRendererProps {
  toolName: string;
  toolResult: any; 
  toolCallId: string; 
}

export function ArtifactRenderer({ toolName, toolResult, toolCallId }: ArtifactRendererProps) {
  switch (toolName) {
    case 'displayRecipeIngredients':
      return <RecipeIngredients {...toolResult} />;
    
    case 'displayShoppingCart':
      return <ShoppingCart />;

    case 'video_recipe':
      return <YouTubeVideoResults {...toolResult as any} />;

    case 'webpage_scraper':
      return <WebpageMarkdownArtifact artifact={toolResult as any} />;

    default:
      console.warn(`No artifact renderer found for tool: ${toolName}`);
      return (
        <div className="p-2 text-xs text-muted-foreground border rounded bg-muted/50">
          Artifact for tool "{toolName}" cannot be displayed.
        </div>
      );
  }
}
