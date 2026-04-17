# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Status:** No testing framework configured

**Not Found:**
- No Jest configuration (`jest.config.js`)
- No Vitest configuration (`vitest.config.js`)
- No Cypress/Playwright configuration
- No test files (`.test.js`, `.spec.js`)
- No test directories (`__tests__`, `tests/`, `test/`)

**Root package.json:**
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

Both `server/package.json` and `client/package.json` have identical test scripts that output an error message when run.

**NPM/Yarn available dependencies:**
- Server: No testing libraries
- Client: No testing libraries (only dev tools like ESLint and Vite)

## Test Organization

**Current State:**
- No test infrastructure exists
- No fixtures or test data factories
- No mock setup

**Recommended Location Pattern (if implemented):**
- Unit tests co-located with source files: `ComponentName.jsx` → `ComponentName.test.jsx`
- Or separate test directory: `client/src/__tests__/`, `server/__tests__/`

## Manual Testing Observations

Based on code structure, the application requires manual testing:

**What would need testing (if framework installed):**

### Server Components (`./server/`)

**`services/youtubeService.js`:**
- `extractVideoId()` - Should handle multiple YouTube URL formats
  - Valid formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
  - Invalid format detection
- `fetchCaptions()` - Should handle language fallback (en → id → any)
  - Returns `{ hasCaptions: boolean, segments: [] }`

**`services/audioService.js`:**
- `downloadAudio()` - Requires yt-dlp and ffmpeg installed
  - File system operations
  - Command execution and error handling
- `cleanupAudio()` - Async file deletion

**`services/assemblyService.js`:**
- `transcribeAudio()` - Integrates with AssemblyAI API
  - File upload to AssemblyAI
  - Transcription with language detection
  - Segment generation (10 words per segment)
  - Cleanup in finally block

**`routes/transcript.js`:**
- URL validation
- Fallback logic (YouTube → AssemblyAI)
- Error response formatting

### Client Components (`./client/src/`)

**`components/UrlInput.jsx`:**
- URL validation (contains 'youtube.com' or 'youtu.be')
- Form submission
- Error state display
- Disabled state during loading

**`components/TranscriptViewer.jsx`:**
- Renders transcript data when available
- Displays source badge (YouTube or AssemblyAI)
- Passes data to ExportButtons

**`components/ExportButtons.jsx`:**
- Copy to clipboard functionality
- Download as TXT
- Download as SRT (via `segmentsToSrt()`)

**`components/ProgressBar.jsx`:**
- Displays different messages for caption vs audio mode
- Indeterminate progress animation

**`utils/srtFormatter.js`:**
- Milliseconds to SRT timestamp format conversion
- Segment aggregation into SRT string format

**`App.jsx`:**
- State management (status, result, errorMsg)
- API request handling
- Error state display and recovery

## Coverage Strategy

**Current:** Not defined - no test framework configured

**Gap Analysis:**
- Critical paths untested:
  - YouTube URL extraction regex
  - Caption fetching and fallback logic
  - Audio transcription pipeline
  - API error handling
  - Client-side form validation
  - Export file generation

**Recommended approach (if implemented):**
- Unit tests for utility functions (regex, formatters)
- Integration tests for service chains (download → transcribe)
- Component tests for React elements (user interactions)
- E2E tests for full workflow (URL input → transcript display)

## How to Run Tests (If Framework Were Added)

**Would likely follow these patterns:**

```bash
# Run all tests
npm test

# Watch mode (during development)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- UrlInput.test.jsx
```

## Test Types (Conceptual)

**Unit Tests (if implemented):**
```javascript
// Example: youtube service extraction
describe('extractVideoId', () => {
  it('should extract ID from youtube.com/watch?v=ID', () => {
    const url = 'https://youtube.com/watch?v=dQw4w9WgXcQ';
    const id = extractVideoId(url);
    expect(id).toBe('dQw4w9WgXcQ');
  });

  it('should extract ID from youtu.be/ID', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    const id = extractVideoId(url);
    expect(id).toBe('dQw4w9WgXcQ');
  });

  it('should throw on invalid URL', () => {
    expect(() => extractVideoId('not-a-url')).toThrow();
  });
});
```

**Integration Tests (if implemented):**
```javascript
// Example: full transcription flow
describe('Transcription Pipeline', () => {
  it('should use YouTube captions when available', async () => {
    // Mock fetchCaptions to return captions
    // Call transcript endpoint
    // Verify response includes YouTube source
  });

  it('should fallback to AssemblyAI when no captions', async () => {
    // Mock fetchCaptions to return empty
    // Mock downloadAudio and transcribeAudio
    // Call transcript endpoint
    // Verify response includes AssemblyAI source
  });
});
```

**Component Tests (if implemented):**
```javascript
// Example: URL input validation
describe('UrlInput Component', () => {
  it('should display error for non-YouTube URL', () => {
    const { getByText } = render(<UrlInput onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Paste YouTube Link/);
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByText('Transcribe'));
    expect(getByText(/Please enter a valid YouTube URL/)).toBeInTheDocument();
  });
});
```

## Key Testing Gaps

**Unexecuted Code Paths:**
- Error scenarios in services
- Network failures
- Invalid API responses
- File system errors (audio download)
- Malformed transcript data

**Coverage Needs:**
- `./server/services/youtubeService.js` - Language fallback logic untested
- `./server/services/audioService.js` - Requires external tool (yt-dlp), not testable without mocking
- `./server/services/assemblyService.js` - Requires API key, needs mocking
- `./server/routes/transcript.js` - Error handling paths, fallback logic
- `./client/src/App.jsx` - API error scenarios, state transitions
- `./client/src/utils/srtFormatter.js` - Edge cases (zero timestamps, long text)

## Current Quality Indicators

**Positive:**
- Clear separation of concerns (services, routes, components)
- Error handling with try-catch
- Proper async/await usage
- Graceful fallback from YouTube → AssemblyAI

**Risks (without tests):**
- Regex pattern for URL extraction could fail on edge cases
- Segment generation logic (10 words per segment) untested
- SRT timestamp formatting not validated for all time ranges
- API error responses not fully validated

---

*Testing analysis: 2026-04-17*
