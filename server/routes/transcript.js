import { extractVideoId, fetchCaptions } from '../services/youtubeService.js';
import { downloadAudio } from '../services/audioService.js';
import { transcribeAudio } from '../services/assemblyService.js';

export default async (req, res) => {
  const { url } = req.body;

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
    // 2. Try fetching captions from YouTube
    const captionResult = await fetchCaptions(videoId);

    if (captionResult.hasCaptions) {
      return res.json({
        source: 'youtube',
        videoId,
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
