Create /server/routes/transcript.js

Mount a single route: POST /api/transcript

Request body: { url: string }

Logic:
1. Validate that url is present and is a valid YouTube URL (use extractVideoId from youtubeService)
2. Call fetchCaptions(videoId)
3. If hasCaptions is true:
   - Return { source: "youtube", segments, fullText: segments.map(s => s.text).join(" ") }
4. If hasCaptions is false:
   - Call downloadAudio(videoId) to get filePath
   - Call transcribeAudio(filePath) to get { segments, fullText }
   - Return { source: "assemblyai", segments, fullText }
5. All errors must be caught and returned as:
   { error: true, message: "human-readable string" } with status 400 or 500

The response shape must always be:
{
  source: "youtube" | "assemblyai",
  videoId: string,
  fullText: string,
  segments: Array<{ start: number, end: number, text: string }>
}