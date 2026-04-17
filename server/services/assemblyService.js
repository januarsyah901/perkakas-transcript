import { AssemblyAI } from 'assemblyai';
import { cleanupAudio } from './audioService.js';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

/**
 * Transcribes an audio file using AssemblyAI.
 * @param {string} filePath 
 * @returns {Promise<{segments: Array, fullText: string}>}
 */
export async function transcribeAudio(filePath) {
  try {
    const uploadUrl = await client.files.upload(filePath);

    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      language_detection: true,
      punctuate: true,
      format_text: true,
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error || 'Unknown AssemblyAI error');
    }

    const segments = [];
    const words = transcript.words || [];
    const wordsPerSegment = 10;

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const chunk = words.slice(i, i + wordsPerSegment);
      segments.push({
        start: chunk[0].start,
        end: chunk[chunk.length - 1].end,
        text: chunk.map(w => w.text).join(' ')
      });
    }

    return {
      segments,
      fullText: transcript.text
    };
  } finally {
    cleanupAudio(filePath);
  }
}
