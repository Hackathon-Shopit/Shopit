// schemas/youtube-video-schema.ts
import { z } from 'zod';

// Schema for parameters the LLM needs to provide to the tool
export const youtubeRecipeToolParamsSchema = z.object({
  query: z.string().describe("The search query for finding recipe videos on YouTube (e.g., 'how to make tomato soup', 'easy chicken recipes'). Should be descriptive."),
});

// Schema for a single video result item
export const youtubeVideoSchema = z.object({
  videoId: z.string().describe("The unique ID of the YouTube video."),
  title: z.string().describe("The title of the YouTube video."),
  thumbnailUrl: z.string().url().describe("URL of the video's medium quality thumbnail image."),
  channelTitle: z.string().describe("The name of the YouTube channel that uploaded the video."),
  videoUrl: z.string().url().describe("Direct URL to watch the video on YouTube.")
});

// Schema for the overall result returned by the tool
export const youtubeVideoResultsSchema = z.object({
  videos: z.array(youtubeVideoSchema)
             .max(6) // Limit to top 6 results
             .describe("A list of the top 6 relevant YouTube recipe videos found.")
});

// Optional: Export the TypeScript type for frontend usage
export type YouTubeVideoResultsData = z.infer<typeof youtubeVideoResultsSchema>;
