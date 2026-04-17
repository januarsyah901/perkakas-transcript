# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
project-root/
├── server/                 # Node.js/Express backend
│   ├── index.js            # App initialization and routing
│   ├── package.json        # Server dependencies
│   ├── routes/             # HTTP request handlers
│   │   └── transcript.js   # POST /api/transcript orchestrator
│   └── services/           # External integrations
│       ├── youtubeService.js     # YouTube caption fetching & URL parsing
│       ├── audioService.js       # Audio download (yt-dlp)
│       └── assemblyService.js    # AI transcription (AssemblyAI)
│
├── client/                 # React frontend (Vite)
│   ├── src/                # Source code
│   │   ├── main.jsx        # React root entry point
│   │   ├── App.jsx         # Main application component & state
│   │   ├── App.css         # Global styles (Tailwind utilities)
│   │   ├── index.css       # Base CSS / Tailwind imports
│   │   ├── components/     # Reusable UI components
│   │   │   ├── UrlInput.jsx       # YouTube URL form input
│   │   │   ├── ProgressBar.jsx    # Loading indicator
│   │   │   ├── TranscriptViewer.jsx  # Results display
│   │   │   └── ExportButtons.jsx  # Copy, TXT, SRT export
│   │   ├── utils/          # Utility functions
│   │   │   └── srtFormatter.js    # Segment → SRT format conversion
│   │   ├── assets/         # Static images
│   │   └── ...
│   ├── public/             # Static public assets
│   ├── vite.config.js      # Vite bundler configuration
│   ├── package.json        # Client dependencies
│   └── ...
│
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
├── package.json          # Root monorepo config (concurrently)
├── .env                  # Environment configuration (secrets excluded)
└── .planning/           # Codebase analysis (generated)
    └── codebase/
        ├── ARCHITECTURE.md
        └── STRUCTURE.md
```

## Directory Purposes

**server/:**
- Purpose: Express.js backend for transcription orchestration
- Contains: API route handlers, external service integrations
- Key files: `index.js` (entry), `routes/transcript.js` (business logic), `services/*` (integrations)

**server/routes/:**
- Purpose: HTTP request handlers for API endpoints
- Contains: Single handler for transcript POST endpoint
- Key files: `transcript.js` - validates URL, orchestrates services, returns response

**server/services/:**
- Purpose: Encapsulated external API clients and system utilities
- Contains: YouTube Transcript API client, audio download via yt-dlp, AssemblyAI transcription
- Key files:
  - `youtubeService.js` - YouTube integration & regex URL parsing
  - `audioService.js` - System command execution for media download
  - `assemblyService.js` - AssemblyAI client for AI transcription

**client/:**
- Purpose: React frontend application bundled with Vite
- Contains: Components, utilities, styles, build configuration
- Key files: `src/main.jsx` (root), `src/App.jsx` (state), `vite.config.js` (build)

**client/src/:**
- Purpose: Application source code
- Contains: React components organized by feature, utilities, styles
- Key files: `App.jsx` (main state manager), components folder (UI)

**client/src/components/:**
- Purpose: Reusable React UI components
- Contains: Input form, progress indicator, results viewer, export buttons
- Key files:
  - `UrlInput.jsx` - Form for YouTube URL input with validation
  - `ProgressBar.jsx` - Loading indicator with mode-dependent messaging
  - `TranscriptViewer.jsx` - Results display with metadata
  - `ExportButtons.jsx` - Copy to clipboard, download TXT, download SRT

**client/src/utils/:**
- Purpose: Utility functions for business logic outside components
- Contains: Format converters, helpers
- Key files: `srtFormatter.js` - Convert segment array to SRT subtitle format

**client/public/:**
- Purpose: Static assets served without processing
- Contains: Favicon, icons SVG
- Key files: `favicon.svg`, `icons.svg`

## Key File Locations

**Entry Points:**

**Server:**
- `server/index.js`: Initializes Express app, mounts route, serves static files
  - Loads `.env` variables
  - Sets up CORS and JSON middleware
  - Serves `client/dist` in production
  - Listens on PORT 3031

**Client:**
- `client/src/main.jsx`: React root bootstrapping
  - Imports React 19 StrictMode
  - Creates root and renders `App.jsx`
- `client/index.html`: HTML template
  - Contains `<div id="root">` mount point
  - Loads Vite-compiled JavaScript

**Configuration:**

**Server:**
- `server/package.json`: Dependencies (express, assemblyai, axios, youtube-transcript, uuid, cors, dotenv)
- `server/index.js`: PORT and NODE_ENV configuration (hardcoded defaults)
- `.env`: Runtime secrets (ASSEMBLYAI_API_KEY, YouTube API keys if needed)

**Client:**
- `client/package.json`: Dependencies (react, react-dom, axios) and dev tools (vite, eslint, tailwindcss)
- `client/vite.config.js`: Vite plugin configuration (React plugin enabled)
- `client/tailwind.config.js`: Tailwind CSS configuration
- `client/postcss.config.js`: PostCSS with Tailwind

**Root:**
- `package.json`: Uses `concurrently` to run both `npm run dev --prefix server` and `npm run dev --prefix client`
- `Dockerfile`: Multi-stage build (client build stage → server runtime stage)
- `docker-compose.yml`: Service definition with env_file reference

**Core Logic:**

**Transcription Orchestration:**
- `server/routes/transcript.js` - Waterfall logic:
  1. Extract video ID from URL
  2. Try YouTube captions
  3. If none, download audio + transcribe with AssemblyAI

**External Service Integrations:**
- `server/services/youtubeService.js` - YouTube Transcript API wrapper
- `server/services/audioService.js` - System yt-dlp command executor
- `server/services/assemblyService.js` - AssemblyAI SDK wrapper

**Client State:**
- `client/src/App.jsx` - React state: `status` (idle/loading/done/error), `result` (transcription), `errorMsg`

**Testing:**

**Test Config:**
- Not detected (no test framework configured; `package.json` scripts say "no test specified")

## Naming Conventions

**Files:**

**Backend:**
- Pattern: `{feature}Service.js` for service modules
  - Example: `youtubeService.js`, `audioService.js`, `assemblyService.js`
- Pattern: `{resource}.js` for routes
  - Example: `transcript.js`
- Pattern: `index.js` for entry points

**Frontend:**
- Pattern: PascalCase `.jsx` for React components
  - Example: `App.jsx`, `UrlInput.jsx`, `TranscriptViewer.jsx`
- Pattern: camelCase `.js` for utility functions
  - Example: `srtFormatter.js`
- Pattern: PascalCase or camelCase `.css` for styles
  - Example: `App.css`, `index.css`

**Directories:**

- Pattern: lowercase for feature directories
  - Example: `components/`, `services/`, `routes/`, `utils/`, `assets/`, `public/`
- Pattern: `src/` standard for source code

**Exports:**

- Pattern: Named exports for services (functions like `extractVideoId`, `fetchCaptions`)
  - Example: `export function extractVideoId(url) {...}`
  - Example: `export async function fetchCaptions(videoId) {...}`
- Pattern: Default export for components
  - Example: `export default App;`
- Pattern: Named export for utilities
  - Example: `export const segmentsToSrt = (segments) => {...}`

## Where to Add New Code

**New Feature (e.g., transcript search):**
- Primary code: Create new route file `server/routes/{feature}.js` and wire in `server/index.js`
  - Or extend `transcript.js` if related to transcript processing
- New services: Add `server/services/{service}Service.js` following existing service pattern
- Client components: Add to `client/src/components/{Feature}.jsx`
- Tests: Create `server/{feature}.test.js` or `client/src/{feature}.test.js` (requires test setup)

**New Component:**
- Implementation: `client/src/components/{ComponentName}.jsx`
  - Follow pattern: `import React from 'react'`, use hooks, default export
  - Import into parent component (e.g., `App.jsx` or other component)
- Styling: Use Tailwind classes directly in JSX; no separate CSS unless complex
- Example pattern matches `UrlInput.jsx`, `ProgressBar.jsx`

**New Utility:**
- Shared helpers: `client/src/utils/{utilName}.js`
  - Named exports for functions
  - Example: `export const formatTime = (ms) => {...}`
  - Import via `import { formatTime } from '../utils/utilName'`
- Backend utilities: `server/utils/{utilName}.js` if needed
  - Currently no utilities layer; consider adding if helper functions exceed services

**External Service Integration:**
- New API: Add `server/services/{nameService}.js`
  - Follow pattern: Initialize client with API key from `process.env`
  - Export async functions for operations
  - Import and use in `server/routes/transcript.js`
  - Example: `server/services/youtubeService.js`

**Environment Configuration:**
- Add to `.env` file (never commit secrets)
- Reference in code via `process.env.{VAR_NAME}`
- Examples: `ASSEMBLYAI_API_KEY`, `PORT`

## Special Directories

**client/dist/:**
- Purpose: Built client assets (generated by Vite)
- Generated: Yes (`npm run build` in client)
- Committed: No (in .gitignore)
- Served by: Express static middleware at `server/index.js` line 20
- Used in: Docker production build (copied from build stage)

**server/node_modules/ & client/node_modules/:**
- Purpose: Installed npm dependencies
- Generated: Yes (`npm install`)
- Committed: No (in .gitignore)

**/tmp/:**
- Purpose: Temporary audio files during transcription
- Generated: Yes (by `audioService.downloadAudio()`)
- Committed: No (outside repo)
- Cleanup: Automatic in `assemblyService.transcribeAudio()` finally block

**.env:**
- Purpose: Runtime configuration and secrets
- Generated: No (user-created)
- Committed: No (in .gitignore)
- Contains: `ASSEMBLYAI_API_KEY`, `PORT` (optional)

**.planning/:**
- Purpose: Codebase analysis documents generated by GSD tools
- Generated: Yes
- Committed: Yes (supports code generation)

## Build & Runtime Flow

**Development:**
1. Root: `npm run dev` → starts `concurrently`
2. Server: `node --watch server/index.js` → auto-restart on file changes
3. Client: `vite` → dev server on default port with HMR
4. Server proxies static files to `/` (would serve Vite via separate process in dev)

**Production (Docker):**
1. **Stage 1 (client-build):** 
   - Build client with `npm run build` → generates `client/dist`
2. **Stage 2 (server):**
   - Install server dependencies
   - Copy server code
   - Copy `client/dist` from stage 1
   - Start: `node server/index.js` on PORT 3031
   - Serves built client at `/`, API at `/api/transcript`

---

*Structure analysis: 2026-04-17*
