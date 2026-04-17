# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**YouTube Integration:**
- YouTube Video Captions - Fetch existing transcripts from YouTube videos
  - SDK/Client: `youtube-transcript` (v1.3.0)
  - Method: HTTP requests to YouTube caption servers
  - Implementation: `server/services/youtubeService.js`
  - Functions: `extractVideoId()`, `fetchCaptions()`
  - Language Support: Tries English first, falls back to Indonesian, then any available language

**Speech-to-Text (Fallback):**
- AssemblyAI - AI-powered speech-to-text transcription service
  - SDK/Client: `assemblyai` (v4.30.0)
  - Auth: Environment variable `ASSEMBLYAI_API_KEY`
  - Endpoint: AssemblyAI API (https://www.assemblyai.com)
  - Implementation: `server/services/assemblyService.js`
  - Features: Language detection, automatic punctuation, text formatting
  - Function: `transcribeAudio()`

**Video Audio Extraction:**
- yt-dlp - Command-line tool for downloading video content
  - Purpose: Extract audio stream from YouTube videos
  - Format: MP3 audio quality level 5
  - Output: `/tmp/{videoId}.mp3`
  - Installation: Part of Docker build process
  - Implementation: `server/services/audioService.js`
  - Function: `downloadAudio()`

## HTTP Communication

**Client-Server Communication:**
- Method: Axios HTTP client (v1.15.0)
- Endpoints:
  - `POST /api/transcript` - Submit YouTube URL for transcription
  - Request body: `{ url: string }`
  - Response: `{ source: 'youtube' | 'assemblyai', videoId: string, fullText: string, segments: Array }`

**CORS Configuration:**
- Middleware: `cors` (v2.8.6)
- Status: Enabled (allows cross-origin requests)
- Implementation: `server/index.js` line 15

## Data Storage

**Local Temporary Storage:**
- Audio files temporarily stored in `/tmp/` directory during processing
- Naming: `/tmp/{videoId}.mp3`
- Cleanup: Automatic deletion after transcription via `cleanupAudio()`
- Implementation: `server/services/audioService.js`

**Databases:**
- None - Stateless application

**File Storage:**
- Local filesystem only - No persistent file storage
- Client-built static files served from `client/dist` directory

**Caching:**
- None detected

## Authentication & Identity

**External API Authentication:**
- AssemblyAI API Key
  - Env var: `ASSEMBLYAI_API_KEY`
  - Type: API key authentication
  - Required for fallback transcription via AssemblyAI
  - Used in: `server/services/assemblyService.js` line 4-6

**YouTube:**
- No authentication required - Public YouTube API through `youtube-transcript` package
- Transcript fetching uses unauthenticated HTTP requests

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging only (standard Node.js console)
- Error logging in catch blocks:
  - `server/routes/transcript.js` - Route errors
  - `server/services/youtubeService.js` - Caption fetch errors
  - `server/services/audioService.js` - Download errors

## CI/CD & Deployment

**Hosting:**
- Docker container deployment
- Local development and Docker Compose support

**Docker Configuration:**
- Base Image: `node:20-slim`
- Multi-stage build:
  - Stage 1: Build React client with Vite
  - Stage 2: Run Express server with built client
- Port: 3031
- Environment: Production (NODE_ENV=production)
- Docker Compose: `docker-compose.yml` (development/local deployment)

**System Dependencies (Docker):**
- python3 - Required by yt-dlp
- ffmpeg - Audio format conversion
- wget - Download yt-dlp binary
- yt-dlp - YouTube audio extraction tool

## Environment Configuration

**Required Environment Variables:**
- `ASSEMBLYAI_API_KEY` - AssemblyAI API authentication key
- `PORT` - Server port (default: 3031)
- `NODE_ENV` - Environment (production in Docker)

**Environment File:**
- Location: `.env` in root directory
- Used by: `dotenv` (v17.4.2) - loads on server startup
- Loading: `import 'dotenv/config'` in `server/index.js` line 1

**Secrets Location:**
- `.env` file (not committed to version control)
- Set via docker-compose.yml `env_file` directive

## Webhooks & Callbacks

**Incoming:**
- `POST /api/transcript` - Main transcription endpoint
  - Accepts YouTube URL
  - Returns transcript data

**Outgoing:**
- None detected

## API Response Schema

**Successful Transcription Response:**
```json
{
  "source": "youtube" | "assemblyai",
  "videoId": "string",
  "fullText": "complete transcript text",
  "segments": [
    {
      "start": number,
      "end": number,
      "text": "segment text"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": true,
  "message": "error description"
}
```

## Integration Flow

1. **User submits YouTube URL** → Client sends to `/api/transcript`
2. **Extract Video ID** → Validate and parse URL (`youtubeService.js`)
3. **Attempt Caption Extraction** → Try YouTube transcript API
   - If successful: Return YouTube captions (fast path)
   - If failed: Continue to step 4
4. **Download Audio** → Use yt-dlp to extract MP3 from video (`audioService.js`)
5. **Transcribe Audio** → Send to AssemblyAI API (`assemblyService.js`)
6. **Cleanup** → Delete temporary audio file
7. **Return Result** → Send response to client with transcript and segments

---

*Integration audit: 2026-04-17*
