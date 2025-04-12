// components/artifacts/YouTubeVideoResults.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YouTubeVideoResultsData } from '@/schemas/youtube-video-schema'; // Assuming '@/...' maps to root or tsconfig paths are set

interface YouTubeVideoResultsProps extends YouTubeVideoResultsData {}

export function YouTubeVideoResults({ videos }: YouTubeVideoResultsProps) {
  if (!videos || videos.length === 0) {
    return (
        <Card className="shadow-sm my-2">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium">YouTube Recipe Videos</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">No relevant videos were found for this query.</p>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-sm my-2">
       <CardHeader className="py-3">
         <CardTitle className="text-base font-medium">YouTube Recipe Videos</CardTitle>
       </CardHeader>
       <CardContent className="space-y-3 pb-3">
         {videos.map((video) => (
           <div key={video.videoId} className="flex items-start space-x-3 border-t pt-3 first:border-t-0 first:pt-0">
             <a
               href={video.videoUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-shrink-0 block hover:opacity-80 transition-opacity"
               title={`Watch \"${video.title}\" on YouTube`}
             >
               <Image
                 src={video.thumbnailUrl}
                 alt={`Thumbnail for ${video.title}`}
                 width={120}
                 height={90}
                 className="rounded border object-cover" // object-cover ensures aspect ratio is maintained
                 unoptimized={true} // Recommended if images are from external domains not configured in next.config.js
               />
             </a>
             <div className="min-w-0 flex-1">
               <a
                 href={video.videoUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sm font-medium leading-tight line-clamp-3 hover:underline" // Allow up to 3 lines for title
                 title={video.title}
               >
                 {video.title}
               </a>
               <p className="text-xs text-muted-foreground mt-1 truncate" title={video.channelTitle}>
                 {video.channelTitle}
               </p>
             </div>
           </div>
         ))}
       </CardContent>
    </Card>
  );
}
