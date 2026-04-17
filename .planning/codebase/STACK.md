# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- JavaScript (ES modules) - Server-side Node.js application
- JavaScript (JSX) - React frontend components
- HTML/CSS - Web UI structure and styling

## Runtime

**Environment:**
- Node.js 20-slim (Docker image)
- Browser runtime for React client

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present in root, server, and client directories

## Frameworks

**Core:**
- Express.js 5.2.1 - HTTP server and REST API
- React 19.2.4 - Frontend UI library
- React DOM 19.2.4 - React rendering to browser

**Build/Dev:**
- Vite 8.0.4 - Frontend build tool and dev server
- Vite React Plugin 6.0.1 - React transformation for Vite
- Concurrently 9.2.1 - Run server and client dev servers simultaneously

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- PostCSS 8.5.10 - CSS transformation
- Autoprefixer 10.5.0 - Add vendor prefixes to CSS

**Linting:**
- ESLint 9.39.4 - JavaScript linter
- ESLint/js 9.39.4 - ESLint JavaScript plugin
- ESLint React Hooks Plugin 7.0.1 - Lint React hooks
- ESLint React Refresh Plugin 0.5.2 - Enforce react-refresh rules
- Globals 17.4.0 - ESLint global variables

## Key Dependencies

**Critical:**
- axios 1.15.0 - HTTP client (used in both server and client)
- express 5.2.1 - Web framework
- cors 2.8.6 - Cross-Origin Resource Sharing middleware
- dotenv 17.4.2 - Environment variable loader

**Infrastructure & Integration:**
- assemblyai 4.30.0 - AssemblyAI speech-to-text API client
- youtube-transcript 1.3.0 - Extract transcripts from YouTube videos
- uuid 13.0.0 - Generate unique identifiers

**Type Definitions:**
- @types/react 19.2.14 - React TypeScript types
- @types/react-dom 19.2.3 - React DOM TypeScript types

## Configuration

**Environment:**
- Configuration via `.env` file
- Key environment variables: `ASSEMBLYAI_API_KEY`, `PORT`
- Environment: `.env` file present but not committed (contains secrets)

**Build:**
- Vite configuration: `client/vite.config.js`
- Tailwind configuration: `client/tailwind.config.js`
- PostCSS configuration: `client/postcss.config.js`
- ESLint configuration: `client/eslint.config.js`

**Client Entry Point:**
- Main: `client/src/main.jsx`
- App: `client/src/App.jsx`

**Server Entry Point:**
- Main: `server/index.js`
- Routes: `server/routes/transcript.js`

## Platform Requirements

**Development:**
- Node.js 20+
- npm or similar package manager
- yt-dlp (for audio download) - installed via Dockerfile
- ffmpeg (for audio conversion) - installed via Dockerfile
- python3 (required by yt-dlp)

**Production:**
- Docker container with Node.js 20-slim
- System packages: python3, ffmpeg, wget
- Port 3031 exposed

**System Commands:**
- yt-dlp - Downloads video audio from YouTube
- ffmpeg - Converts audio formats

---

*Stack analysis: 2026-04-17*
