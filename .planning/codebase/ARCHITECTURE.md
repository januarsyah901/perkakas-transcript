# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Full-stack monorepo with **Client-Server separation** and **layered backend architecture**

**Key Characteristics:**
- **Two-tier application**: React frontend (Vite) + Node.js/Express backend
- **Service-oriented backend**: Modular services for YouTube, audio, and transcription
- **Waterfall transcription pipeline**: YouTube captions → fallback to audio download → AI transcription
- **Stateless request-response**: No persistent storage; operations are ephemeral
- **Single API endpoint**: `/api/transcript` orchestrates all transcription logic

## Layers

**Presentation Layer (Client):**
- Purpose: User interface for video transcription with real-time feedback
- Location: `client/src/`
- Contains: React components, utilities for formatting, styling
- Depends on: Axios (HTTP client), React DOM
- Used by: End users via browser

**Business Logic Layer (Backend - Routes):**
- Purpose: HTTP request handling and orchestration of transcription pipeline
- Location: `server/routes/transcript.js`
- Contains: Request validation, service orchestration, error handling
- Depends on: YouTube service, audio service, AssemblyAI service
- Used by: Express app as POST handler

**Service Layer (Backend - Services):**
- Purpose: Encapsulation of external integrations and core operations
- Location: `server/services/`
- Contains:
  - `youtubeService.js`: YouTube URL parsing and caption fetching
  - `audioService.js`: Audio download and file management
  - `assemblyService.js`: AI transcription orchestration
- Depends on: External APIs (YouTube Transcript, AssemblyAI), system utilities (yt-dlp, ffmpeg)
- Used by: Route handler

**Serving Layer (Server Root):**
- Purpose: Express app initialization, middleware setup, static file serving
- Location: `server/index.js`
- Contains: CORS setup, JSON parsing, client build serving, route mounting
- Depends on: Express, route handlers
- Used by: Container runtime / Node process

## Data Flow

**Successful Transcription (YouTube Captions Available):**

1. User submits YouTube URL via `UrlInput` component
2. `App.jsx` sends POST to `/api/transcript` with URL in body
3. Route handler (`routes/transcript.js`) receives request
4. `extractVideoId()` parses URL to get video ID
5. `fetchCaptions()` queries YouTube Transcript API for captions
6. If captions exist, segments are mapped to `{start, end, text}` format
7. Response returned with `source: 'youtube'` and segments
8. `TranscriptViewer` displays result; user can export via `ExportButtons`

**Fallback Transcription (No YouTube Captions):**

1. `fetchCaptions()` returns `hasCaptions: false`
2. `downloadAudio()` executes `yt-dlp` command-line tool to download video as MP3
3. File saved to `/tmp/{videoId}.mp3`
4. `transcribeAudio()` uploads MP3 to AssemblyAI, initiates transcription
5. AssemblyAI returns transcript with word-level timing
6. Segments created from 10-word chunks with `start`/`end` timing
7. Audio file cleaned up via `cleanupAudio()`
8. Response returned with `source: 'assemblyai'` and segments
9. Client displays result identical to YouTube path

**Error Handling:**

- Invalid YouTube URL: Returns 400 with error message before processing
- YouTube fetch fails: Logged, falls back to AssemblyAI
- Audio download fails: Returns 500, suggests installing dependencies
- Transcription fails: Returns 500 with AssemblyAI error message

**State Management:**

**Client:**
- `status`: idle | loading | done | error (tracks UI state)
- `result`: null | {source, videoId, fullText, segments} (transcription data)
- `errorMsg`: User-facing error messages
- Managed via React `useState` in `App.jsx`; lifted state for child components

**Server:**
- Stateless per request; no session storage
- Temporary audio files cleaned up after transcription
- No database; all computation is ephemeral

## Key Abstractions

**Segment Format:**
- Purpose: Represent time-bound transcript chunks for SRT export and UI display
- Examples: Both YouTube and AssemblyAI normalize to `{start: ms, end: ms, text: string}`
- Pattern: Consistent interface across transcription sources enables unified export logic

**Transcription Result Object:**
- Purpose: Unify response data across different transcription sources
- Structure: `{source, videoId, fullText, segments}`
- Pattern: Allows client to handle both YouTube and AssemblyAI responses with same render logic

**Service Functions:**
- `extractVideoId()`: Pure function for URL parsing (no side effects)
- `fetchCaptions()`, `downloadAudio()`, `transcribeAudio()`: Async operations with error recovery
- Pattern: Services expose focused, single-responsibility functions; route orchestrates them

## Entry Points

**Server:**
- Location: `server/index.js`
- Triggers: `npm run dev` (Node.js process start)
- Responsibilities:
  - Initialize Express app with middleware
  - Mount transcription route
  - Serve client build (production) or 404 (development)
  - Listen on PORT 3031

**Client:**
- Location: `client/src/main.jsx`
- Triggers: Vite dev server or browser load of built HTML
- Responsibilities:
  - Create React root and mount `App.jsx`
  - Enable StrictMode for development warnings

**API Endpoint:**
- Path: `POST /api/transcript`
- Handler: `server/routes/transcript.js`
- Input: `{url: string}`
- Output: `{source, videoId, fullText, segments}` or error response

## Error Handling

**Strategy:** Three-tier error recovery with user-friendly messages

**Patterns:**

1. **Validation-level errors (client + server):**
   - Client: `UrlInput` checks for 'youtube.com' or 'youtu.be' presence
   - Server: Route validates URL format before processing
   - Response: 400 Bad Request with descriptive message

2. **Service-level errors (graceful degradation):**
   - YouTube fetch fails silently; falls back to AssemblyAI
   - Console logs errors for debugging; no user-facing cascade
   - Maintains data flow continuity

3. **System-level errors (dependency failures):**
   - Missing yt-dlp: Error message suggests installation
   - AssemblyAI quota/network failure: 500 with specific error from API
   - No fallback; user sees actionable error

## Cross-Cutting Concerns

**Logging:**
- Server: `console.error()` for unexpected failures in route handler and services
- No structured logging; output goes to stdout/stderr
- Useful for debugging in local and containerized environments

**Validation:**
- Client: Client-side URL check (quick feedback)
- Server: `extractVideoId()` regex validation; required field check in route
- Approach: Fail-fast before external API calls to minimize latency

**Authentication:**
- Not implemented; service is public
- AssemblyAI auth handled via environment variable `ASSEMBLYAI_API_KEY`
- No user tracking or rate limiting

**File Management:**
- Temporary audio files stored in `/tmp`
- Cleanup triggered in `finally` block of `transcribeAudio()` to ensure deletion
- No persistent file storage

## Data Structures

**Segment (internal format):**
```javascript
{
  start: number,      // Milliseconds from video start
  end: number,        // Milliseconds from video start
  text: string        // Subtitle or transcript text
}
```

**Transcription Result (API response):**
```javascript
{
  source: 'youtube' | 'assemblyai',
  videoId: string,
  fullText: string,          // Full transcript as single string
  segments: Array<Segment>
}
```

---

*Architecture analysis: 2026-04-17*
