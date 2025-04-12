// tools/youtube-recipe-tool.ts
import { google, youtube_v3 } from 'googleapis'; // Import specific type if needed
import { z } from 'zod';
import { tool } from 'ai';
import {
  youtubeRecipeToolParamsSchema,
  youtubeVideoResultsSchema,
  youtubeVideoSchema
} from '@/schemas/youtube-video-schema'; // Assuming '@/...' maps to root or tsconfig paths are set

// Initialize YouTube API client outside the function
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // Loaded from .env.local
});

export const videoRecipeTool = tool({
  description: 'Searches YouTube for recipe videos based on a user query and returns the top 6 results. Use this when a user asks for recipe videos.',
  parameters: youtubeRecipeToolParamsSchema,
  execute: async ({ query }) => {
    console.log(`[Tool Execution] video_recipe called with query: "${query}"`);

    if (!process.env.YOUTUBE_API_KEY) {
      console.error("[Tool Error] YouTube API key is missing.");
      // Return empty list on configuration error
      return { videos: [] };
    }

    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        q: query + " recipe", // Focus search on recipes
        type: ['video'],
        maxResults: 6,
        videoEmbeddable: 'true',
      });

      // Use the specific type from googleapis for items
      const items: youtube_v3.Schema$SearchResult[] = response.data.items || [];

      // Map API results to our defined schema structure
      const videosData = items.map((item: youtube_v3.Schema$SearchResult) => ({
        videoId: item.id?.videoId || '',
        title: item.snippet?.title || 'No Title',
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
        videoUrl: `https://www.youtube.com/watch?v=${item.id?.videoId || ''}`
      })).filter((video: { videoId: string; thumbnailUrl: string; /* ... other props */ }) => video.videoId && video.thumbnailUrl); // Ensure essential info exists

      console.log(`[Tool Result] Found ${videosData.length} YouTube videos.`);

      // Validate the final output against our schema
      const validationResult = youtubeVideoResultsSchema.safeParse({ videos: videosData });
      if (!validationResult.success) {
           console.error("[Tool Validation Error] Tool output failed schema validation:", validationResult.error);
           // Return empty list if validation fails
           return { videos: [] };
      }

      return validationResult.data; // Return the validated, structured data

    } catch (error: any) {
      console.error('[Tool Error] Error calling YouTube API:', error.message || error);
      // Return empty list on API error
      return { videos: [] };
    }
  }
});
