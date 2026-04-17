# Coding Conventions

**Analysis Date:** 2026-04-17

## Naming Patterns

**Files:**
- PascalCase for React components: `UrlInput.jsx`, `TranscriptViewer.jsx`, `ExportButtons.jsx`, `ProgressBar.jsx`
- camelCase for service modules: `youtubeService.js`, `audioService.js`, `assemblyService.js`
- camelCase for utility files: `srtFormatter.js`
- Lowercase for route files: `transcript.js` in `routes/` directory
- Entry points use lowercase: `index.js`, `main.jsx`, `App.jsx`

**Functions:**
- camelCase for all function names (both synchronous and async)
- Example: `extractVideoId()`, `fetchCaptions()`, `downloadAudio()`, `transcribeAudio()`, `handleSubmit()`, `handleTranscribe()`
- Arrow functions for callbacks and handlers: `const handleSubmit = (e) => { ... }`
- Named export functions in service modules: `export function extractVideoId(url) { ... }`
- Default export functions for route handlers: `export default async (req, res) => { ... }`

**Variables:**
- camelCase for all variable names
- Descriptive names: `videoId`, `errorMsg`, `filePath`, `segments`, `transcripts`
- Const for constants and module-level variables
- Let for loop variables and reassignable locals

**Types/Data Structures:**
- Objects use camelCase keys: `{ start, end, text }`, `{ hasCaptions, segments }`
- Arrays typically use plural names: `segments`, `transcripts`, `words`, `chunks`
- Boolean variables prefixed or clearly named: `isLoading`, `error`, `hasCaptions`

## Code Style

**Formatting:**
- No specific formatter detected (no Prettier config found)
- Code follows implicit conventions observed in files:
  - 2-space indentation
  - Trailing commas in multiline objects
  - Consistent spacing around operators

**Linting:**
- ESLint configured in `client/eslint.config.js`
- Uses flat config format (ESLint v9+)
- Configuration: `client/eslint.config.js`

**ESLint Rules (Client):**
- Extends: `@eslint/js` recommended
- Includes: `eslint-plugin-react-hooks/flat.recommended`
- Includes: `eslint-plugin-react-refresh/vite`
- Custom rule: `no-unused-vars` with pattern `^[A-Z_]` to allow capitalized unused variables (common in React)

**Server-side:**
- No linting configuration found; follows Node.js/Express conventions
- Type: `"module"` (ES modules)

## Import Organization

**Order:**
1. External dependencies (Express, Axios, third-party SDKs)
2. Relative imports from project modules (utilities, services, components)
3. CSS/style imports (in React files)

**Examples:**

Server route imports (`./server/routes/transcript.js`):
```javascript
import { extractVideoId, fetchCaptions } from '../services/youtubeService.js';
import { downloadAudio } from '../services/audioService.js';
import { transcribeAudio } from '../services/assemblyService.js';
```

React component imports (`./client/src/App.jsx`):
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import UrlInput from './components/UrlInput';
import ProgressBar from './components/ProgressBar';
import TranscriptViewer from './components/TranscriptViewer';
```

**Path Aliases:**
- Not used in this project
- Paths are relative (e.g., `../services/`, `./components/`)

## Error Handling

**Patterns:**
- Try-catch blocks for async operations
- Error logging with `console.error()`: `console.error('Error type:', error)` or `console.error('Error type:', error.message)`
- Error response format (server): `{ error: true, message: 'Human-readable error' }`
- Graceful fallback: When YouTube captions unavailable, falls back to AssemblyAI transcription
- Example from `./server/routes/transcript.js`:
  ```javascript
  try {
    // primary operation
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Invalid YouTube URL' });
  }
  ```

**Client error handling:**
- Errors from API caught and stored in state: `setErrorMsg(error.response?.data?.message || 'Default message')`
- Optional chaining for nested error properties: `error.response?.data?.message`
- User-friendly error display in UI

## Logging

**Framework:** `console` (native browser/Node.js console)

**Patterns:**
- `console.log()` for informational output (e.g., `Server running on port ${PORT}`)
- `console.error()` for error logging with context: `console.error('Error fetching captions:', error.message)`
- All console calls are descriptive with error context
- No structured logging framework (no Winston, Bunyan, Pino)

**Usage locations:**
- Server startup confirmation: `./server/index.js:35`
- Error handling in routes: `./server/routes/transcript.js:44, 52`
- Service-level errors: `./server/services/youtubeService.js:48`
- Client error handling: `./client/src/App.jsx:22`

## Comments

**When to Comment:**
- Function purpose: JSDoc-style comments for exported functions
- Complex regex patterns: Example from `./server/services/youtubeService.js` has regex for YouTube URL extraction

**JSDoc/TSDoc:**
- Used for exported functions in service modules
- Format: Brief description + param types + return type
- Example from `./server/services/youtubeService.js`:
  ```javascript
  /**
   * Extracts the video ID from various YouTube URL formats.
   * @param {string} url 
   * @returns {string} videoId
   */
  export function extractVideoId(url) { ... }
  ```

- Applied consistently in:
  - `./server/services/youtubeService.js` (2 functions)
  - `./server/services/audioService.js` (2 functions)
  - `./server/services/assemblyService.js` (1 function)
  - `./client/src/utils/srtFormatter.js` (2 functions)

## Function Design

**Size:** Functions are typically small and focused (10-50 lines)
- Service functions handle single responsibilities: extract IDs, fetch captions, download audio, transcribe
- Route handlers: 50-60 lines with clear control flow
- React components: 15-70 lines with clear render logic

**Parameters:**
- Functions accept minimal parameters
- Destructuring used in React component props: `const UrlInput = ({ onSubmit, isLoading }) => { ... }`
- Object parameters for complex operations

**Return Values:**
- Service functions return objects: `{ hasCaptions, segments }`, `{ fullText, segments }`
- Async functions return Promises: `export async function downloadAudio(videoId) { ... }`
- Finally blocks used for cleanup: `./server/services/assemblyService.js:45` - cleans up audio file after transcription

## Module Design

**Exports:**
- Named exports for reusable functions: `export function extractVideoId(url) { ... }`
- Default export for route handlers and React components
- Services export utility/business logic functions
- Routes export async request handlers

**Barrel Files:**
- Not used in this project
- Each component/service imported directly by path

**Module Organization:**

Server structure:
```
server/
├── index.js           # Entry point, Express app setup
├── routes/
│   └── transcript.js  # POST /api/transcript handler
└── services/
    ├── youtubeService.js    # YouTube API interactions
    ├── audioService.js      # Audio download/processing
    └── assemblyService.js   # AssemblyAI transcription
```

Client structure:
```
client/src/
├── main.jsx           # React entry point
├── App.jsx            # Root component with state management
├── components/        # Reusable React components
│   ├── UrlInput.jsx
│   ├── ProgressBar.jsx
│   ├── TranscriptViewer.jsx
│   └── ExportButtons.jsx
└── utils/
    └── srtFormatter.js    # Utility for SRT file generation
```

## State Management

**Client (React):**
- Uses `useState()` hook for local component state
- State shared via props passing through components
- Parent component (`App.jsx`) manages: `status`, `result`, `errorMsg`
- Child components receive props and call parent callback handlers

**Server:**
- Stateless request handlers
- Express middleware used for CORS and JSON parsing
- Environment variables for configuration

## Styling Conventions

**Framework:** Tailwind CSS (client only)

**Approach:**
- Utility-first CSS with Tailwind classes applied inline
- No CSS modules or separate stylesheets (except global index.css)
- Class strings use template literals for conditional styles:
  ```jsx
  className={`w-full pl-14 pr-32 py-5 ${error ? 'border-red-300' : 'border-gray-100'}`}
  ```

**Patterns observed:**
- Responsive utilities: `flex-col sm:flex-row`
- State-based styling: `disabled:bg-gray-200`, `hover:bg-blue-700`, `focus:border-blue-500`
- Animations: `animate-progress`, `animate-slide-up`, `animate-pulse`
- Consistent spacing/sizing with Tailwind scale

---

*Convention analysis: 2026-04-17*
