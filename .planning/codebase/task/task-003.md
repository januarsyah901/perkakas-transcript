Create /server/services/audioService.js

This module must export:

downloadAudio(videoId: string): Promise<string>
  - Build the YouTube URL from the videoId: https://www.youtube.com/watch?v={videoId}
  - Use Node's child_process.exec (promisified) to run yt-dlp with these flags:
      yt-dlp -x --audio-format mp3 --audio-quality 5 -o "/tmp/{videoId}.%(ext)s" {url}
  - Wait for the process to finish
  - Return the output file path: /tmp/{videoId}.mp3
  - If yt-dlp is not found, throw a clear error: "yt-dlp is not installed. Run: pip install yt-dlp"
  - If download fails for any reason, throw with the stderr message

Also export:
cleanupAudio(filePath: string): void
  - Delete the file at filePath using fs.unlink (ignore errors silently)