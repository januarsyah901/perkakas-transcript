Create /server/services/assemblyService.js

Use the official "assemblyai" npm SDK.

Export one function:
transcribeAudio(filePath: string): Promise<{ segments: Array<{start: number, end: number, text: string}>, fullText: string }>

Steps:
1. Init AssemblyAI client with process.env.ASSEMBLYAI_API_KEY
2. Upload the audio file at filePath using client.files.upload()
3. Create a transcription with these options:
   - audio_url: the uploaded file URL
   - language_detection: true  (auto-detects EN and ID)
   - punctuate: true
   - format_text: true
4. Poll using client.transcripts.waitUntilReady(transcript.id) 
5. If transcript.status === 'error', throw with transcript.error message
6. Map transcript.words (if available) into segments grouped by sentence (~10 words each), with start/end in ms
7. Return { segments, fullText: transcript.text }
8. Always call cleanupAudio(filePath) in a finally block (import from audioService.js)