import { Message } from 'ai';
import { Artifact } from './types';

/**
 * Process messages to extract available artifacts
 */
export function processArtifacts(messages: Message[]): Artifact[] {
  return messages.flatMap(message => 
    message.toolInvocations
      ?.filter(tool => tool.state === 'result')
      .map(tool => ({
        toolName: tool.toolName,
        toolResult: tool.result,
        toolCallId: tool.toolCallId,
        // Generate a display name for the sidebar list
        displayName: tool.toolName === 'displayRecipeIngredients' 
          ? `Recipe: ${tool.result?.dish || 'Unknown'}` 
          : tool.toolName === 'displayShoppingCart'
          ? 'Shopping Cart'
          : tool.toolName // Fallback to tool name
      })) ?? []
  ).reverse(); // Reverse to show latest first in the list
}
