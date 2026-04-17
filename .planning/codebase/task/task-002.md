Create /server/services/youtubeService.js

This module must export two functions:

1. extractVideoId(url: string): string
   - Accept any YouTube URL format: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
   - Return the video ID string or throw an error if invalid

2. fetchCaptions(videoId: string): Promise<{ hasCaptions: boolean, segments: Array<{start: number, end: number, text: string}> }>
   - Use the "youtube-transcript" npm package to attempt fetching captions
   - If successful, map the result to { start (ms), end (ms), text } format
   - If it throws (no captions available), return { hasCaptions: false, segments: [] }
   - Do not call the YouTube Data API v3 for this — use youtube-transcript only
   - Language priority: try 'en' first, then 'id', then auto-detect