import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';

/**
 * Extracts the video ID from various YouTube URL formats.
 * @param {string} url 
 * @returns {string} videoId
 */
export function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|watch\?v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error('Invalid YouTube URL');
}

/**
 * Fetches captions for a given video ID.
 * @param {string} videoId 
 * @returns {Promise<{hasCaptions: boolean, segments: Array}>}
 */
export async function fetchCaptions(videoId) {
  try {
    let transcripts;
    
    try {
      transcripts = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    } catch (e) {
      try {
        transcripts = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'id' });
      } catch (e2) {
        transcripts = await YoutubeTranscript.fetchTranscript(videoId);
      }
    }

    if (!transcripts || transcripts.length === 0) {
      return { hasCaptions: false, segments: [] };
    }

    const segments = transcripts.map(t => ({
      start: Math.round(t.offset * 1000),
      end: Math.round((t.offset + t.duration) * 1000),
      text: t.text
    }));

    return { hasCaptions: true, segments };
  } catch (error) {
    console.error('Error fetching captions:', error.message);
    return { hasCaptions: false, segments: [] };
  }
}
