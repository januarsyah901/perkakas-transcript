import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
const execPromise = util.promisify(exec);

/**
 * Downloads audio from YouTube and converts it to mp3.
 * @param {string} videoId 
 * @returns {Promise<string>} filePath
 */
export async function downloadAudio(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const outputPath = `/tmp/${videoId}.mp3`;
  
  const command = `export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH" && yt-dlp -x --audio-format mp3 --audio-quality 5 -o "/tmp/${videoId}.%(ext)s" "${url}"`;
  
  try {
    await execPromise(command);
    if (fs.existsSync(outputPath)) {
      return outputPath;
    } else {
      throw new Error(`Download failed: File not found at ${outputPath}`);
    }
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('127')) {
      throw new Error("yt-dlp is not installed. Run: brew install yt-dlp ffmpeg");
    }
    throw new Error(error.stderr || error.message);
  }
}

/**
 * Deletes the audio file.
 * @param {string} filePath 
 */
export function cleanupAudio(filePath) {
  if (filePath) {
    fs.unlink(filePath, () => {});
  }
}
