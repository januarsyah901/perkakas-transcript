import { extractVideoId, fetchCaptions } from '../services/youtubeService.js';
import { downloadAudio } from '../services/audioService.js';
import { transcribeAudio } from '../services/assemblyService.js';
import { getVideoMetadata } from '../services/youtubeV3Service.js';

export default async (req, res) => {
  const { url, useV3 = false } = req.body;

  if (!url) {
    return res.status(400).json({ error: true, message: 'YouTube URL is required' });
  }

  let videoId;
  try {
    videoId = extractVideoId(url);
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Invalid YouTube URL' });
  }

  try {
    let metadata = null;
    if (useV3) {
      metadata = await getVideoMetadata(videoId);
      console.log(`Fetched metadata via V3 for ${videoId}:`, metadata?.title);
    }

    // 2. Try fetching captions from YouTube (Scraping method)
    // We still use this because V3 API for caption content is restricted
    const captionResult = await fetchCaptions(videoId);

    if (captionResult.hasCaptions) {
      return res.json({
        source: useV3 ? 'youtube-v3' : 'youtube',
        videoId,
        title: metadata?.title || 'Unknown Video',
        channel: metadata?.channelTitle || 'Unknown Channel',
        fullText: captionResult.segments.map(s => s.text).join(' '),
        segments: captionResult.segments
      });
    }

    // 4. Fallback to AssemblyAI
    try {
      const filePath = await downloadAudio(videoId);
      const transcription = await transcribeAudio(filePath);

      return res.json({
        source: 'assemblyai',
        videoId,
        title: metadata?.title || 'Unknown Video',
        channel: metadata?.channelTitle || 'Unknown Channel',
        fullText: transcription.fullText,
        segments: transcription.segments
      });
    } catch (fallbackError) {
      console.error('Fallback transcription failed:', fallbackError);
      return res.status(500).json({ 
        error: true, 
        message: fallbackError.message || 'Failed to transcribe audio via AI fallback' 
      });
    }

  } catch (error) {
    console.error('Transcript route error:', error);
    return res.status(500).json({ 
      error: true, 
      message: error.message || 'An error occurred during processing' 
    });
  }
};
