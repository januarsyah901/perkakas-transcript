# Codebase Concerns

**Analysis Date:** 2026-04-17

## Security Considerations

**API Key Exposure Risk:**
- Issue: `ASSEMBLYAI_API_KEY` read from `process.env` at module initialization in `./server/services/assemblyService.js:5`
- Files: `./server/services/assemblyService.js`
- Current mitigation: `.env` file exists but not committed (listed in `.gitignore`)
- Risk: If `.env` is accidentally committed, API key is exposed. No validation that env var is actually set before use.
- Recommendations: 
  - Add environment variable validation at startup (`process.env.ASSEMBLYAI_API_KEY` check in `./server/index.js` before mounting routes)
  - Consider throwing error if required env vars missing at server startup
  - Document required environment variables in README or startup validation

**Command Injection Vulnerability (Critical):**
- Issue: User input (`videoId`) interpolated directly into shell command in `./server/services/audioService.js:15`
- Files: `./server/services/audioService.js`
- Vulnerable code: `` const command = `yt-dlp -x --audio-format mp3 --audio-quality 5 -o "/tmp/${videoId}.%(ext)s" "${url}"` ``
- Risk: VideoID could be crafted to break out of the command and execute arbitrary commands (though regex validation helps)
- Trigger: If YouTube URL regex extraction is bypassed or weakened
- Recommendations:
  - Use `execFile()` or `spawn()` instead of `exec()` with array of arguments
  - Avoid template literals for command construction
  - Add strict validation/sanitization of videoId beyond regex

**Unvalidated Error Messages:**
- Issue: User-facing error messages in `./server/routes/transcript.js:47` include potentially sensitive internal error details
- Files: `./server/routes/transcript.js`
- Risk: Stack traces or internal error details could leak in HTTP response
- Recommendations: Sanitize error messages before sending to client; use generic messages in production

**No CORS Whitelist:**
- Issue: `cors()` middleware in `./server/index.js:15` configured with defaults (allows all origins)
- Files: `./server/index.js`
- Risk: Any website can make requests to this API, enabling CSRF attacks and potential abuse
- Recommendations: Whitelist allowed origins (e.g., production domain only)

## Performance Bottlenecks

**Sequential Processing Chain:**
- Issue: Three I/O operations forced to execute sequentially: YouTube caption fetch → yt-dlp download → AssemblyAI transcription
- Files: `./server/routes/transcript.js`
- Problem: 
  - Caption fetch (fast, ~1-2s) must complete before fallback to slow audio download (~30-60s+)
  - No ability to try both in parallel or timeout one to start another
  - User experiences long waits for videos without captions
- Impact: User-facing request can take 60+ seconds for large videos
- Improvement path:
  - Implement parallel promises: `Promise.race()` for caption fetch with timeout, if fails immediately start audio download
  - Add configurable timeout (e.g., 5s) for caption fetch before fallback
  - Consider queue system for long-running transcriptions

**Unbounded Temporary File Storage:**
- Issue: Audio files downloaded to `/tmp/` but cleanup is asynchronous and fire-and-forget
- Files: `./server/services/audioService.js:36-39`, `./server/services/assemblyService.js:45-46`
- Problem: `fs.unlink(filePath, () => {})` has no error handling; if deletion fails, file persists indefinitely
- Impact: `/tmp` directory fills up over time, potentially exhausting disk space
- Improvement path:
  - Add error handling to file deletion callback
  - Implement cleanup job (cron) to remove orphaned files older than N hours
  - Log failed deletions for monitoring
  - Consider using temp file library (e.g., `tmp` npm package) with guaranteed cleanup

**No Response Timeout:**
- Issue: Long-running operations (audio download + transcription) have no timeout
- Files: `./server/routes/transcript.js`
- Risk: Client connection holds open indefinitely; server memory exhausted if many requests pile up
- Recommendations:
  - Add explicit timeout on axios calls or use AbortController
  - Implement request timeout at Express middleware level (e.g., 5 minutes)

## Error Handling

**Swallowed Errors in File Cleanup:**
- Issue: `fs.unlink()` callback silently ignores errors
- Files: `./server/services/audioService.js:36-39`
- Problem: Failed deletions go unnoticed; no alert/log
- Recommendations: Add error logging to identify disk/permission issues

**Suppressed Language Fallback Chain:**
- Issue: YouTube caption fetch has nested try-catch blocks that suppress errors silently
- Files: `./server/services/youtubeService.js:26-34`
- Problem: Three sequential attempts (en → id → auto) with all errors caught but not logged; unclear which failed
- Impact: Debugging is difficult; no insight into why captions weren't available
- Recommendations:
  - Log each failed attempt with specific error reason
  - Return detailed error info (currently only returns `hasCaptions: false`)

**Generic Error Messages to User:**
- Issue: `./server/routes/transcript.js:47-48` error messages may not reflect actual problem
- Files: `./server/routes/transcript.js`
- Problem: User gets "Failed to transcribe audio via AI fallback" without knowing if issue is missing file, API limit, invalid audio format, etc.
- Recommendations: Add error categorization (network, format, quota, etc.)

**No Request Validation for URL Format:**
- Issue: URL validation only checks string contains "youtube.com" or "youtu.be"
- Files: `./client/src/components/UrlInput.jsx:10`
- Problem: Could accept invalid URLs like "http://notyoutube.com" if it contains the substring
- Recommendations:
  - Use strict URL parsing (try `new URL()`)
  - Validate hostname specifically, not substring matching

## Tech Debt

**Missing Input Validation at Server:**
- Issue: Server trusts client-side validation; no re-validation of URL format
- Files: `./server/routes/transcript.js:6-10`
- Problem: Malformed requests could reach service layer
- Recommendations: Add strict validation in `./server/routes/transcript.js` before calling services

**Hardcoded Dependencies on External Tools:**
- Issue: `yt-dlp` and `ffmpeg` required for audio download; error message in code (`./server/services/audioService.js:26`) tells macOS users to use `brew install`
- Files: `./server/services/audioService.js`, `./Dockerfile`
- Problem: 
  - Installation instructions baked into code and tied to macOS (`brew`)
  - Non-macOS users get unhelpful error message
  - Docker handles this but standalone deployment is fragile
- Recommendations:
  - Centralize dependency check at server startup
  - Provide OS-agnostic error message with links to docs
  - Document in README with OS-specific install steps

**No Request Rate Limiting:**
- Issue: No protection against abuse (unlimited requests per IP/user)
- Files: `./server/index.js`
- Risk: API can be hammered; expensive AssemblyAI calls burn API quota
- Recommendations: Add rate limiter middleware (e.g., `express-rate-limit`)

**Inconsistent Error Response Format:**
- Issue: Some endpoints return `{ error: true, message: "..." }` while others might not
- Files: `./server/routes/transcript.js`
- Problem: Client must handle multiple response shapes
- Recommendations: Standardize response envelope (always include error/success status)

## Logging & Monitoring Gaps

**No Structured Logging:**
- Issue: `console.error()` and `console.log()` used directly without context
- Files: `./server/index.js:35`, `./server/routes/transcript.js:44,52`, `./server/services/youtubeService.js:48`
- Problem: 
  - No timestamps, severity levels, or request tracing
  - Logs go to stdout only (not searchable or rotated in production)
  - No correlation ID to link related errors across requests
- Impact: Debugging production issues is difficult
- Recommendations:
  - Use structured logging library (e.g., `winston`, `pino`)
  - Add request ID/correlation ID to all logs
  - Include timestamps, severity, and context

**No Monitoring of External API Health:**
- Issue: No fallback or alert if AssemblyAI API becomes unavailable
- Files: `./server/services/assemblyService.js`
- Problem: If AssemblyAI is down, only way to know is via user reports or error spikes
- Recommendations:
  - Health check endpoint for AssemblyAI availability
  - Circuit breaker pattern to fail fast
  - Alert/notification system for outages

**No Request/Response Metrics:**
- Issue: No tracking of transcription success rate, latency, or source distribution
- Files: `./server/routes/transcript.js`
- Impact: Can't measure service quality or identify trends
- Recommendations: Add middleware to track request latency, success/failure rates by source

## Scalability Challenges

**Memory Unbounded During Audio Processing:**
- Issue: Large audio files loaded into memory by AssemblyAI SDK
- Files: `./server/services/assemblyService.js`
- Problem: Very large videos could cause OOM errors; no limits on audio file size
- Recommendations:
  - Add file size validation before processing
  - Consider streaming uploads to AssemblyAI or chunking
  - Set memory limits in Docker/process manager

**Single-Threaded Bottleneck:**
- Issue: Node.js process is single-threaded; concurrent transcription requests block each other
- Files: `./server/index.js`
- Problem: If two users request transcription simultaneously, second waits for first to complete audio download
- Impact: Latency increases linearly with concurrent users
- Recommendations:
  - Use worker threads for I/O-bound operations (less critical since mostly waiting on external APIs)
  - Consider implementing job queue (e.g., Bull, RabbitMQ) for long-running tasks
  - Horizontal scaling (multiple server instances) more practical for this workload

**Temporary File Storage on Local Disk:**
- Issue: All audio downloads stored in `/tmp/`; volume isn't shared across instances
- Files: `./server/services/audioService.js:13`
- Problem: Can't scale horizontally; each instance has its own temp storage
- Recommendations:
  - Use cloud storage (S3) or shared volume for audio files in multi-instance setup
  - Or pass file URL directly to AssemblyAI instead of downloading locally

**Database or Caching Layer Missing:**
- Issue: No caching of transcription results; same video requested twice processes twice
- Files: `./server/routes/transcript.js`
- Impact: Unnecessary API calls and disk downloads for duplicate requests
- Recommendations:
  - Add Redis or in-memory cache keyed by video ID
  - Cache both YouTube captions and AssemblyAI results
  - Add cache TTL (e.g., 7 days)

## Dependency Risks

**Outdated/Pinned Dependencies:**
- Issue: `package.json` versions are pinned (e.g., `express@^5.2.1`, `assemblyai@^4.30.0`)
- Files: `./server/package.json`
- Problem: 
  - Caret (^) allows patch updates but not minor updates (okay but could miss security fixes)
  - No lock file committed for reproducible builds (wait, package-lock.json exists but not in root package.json context)
- Recommendations:
  - Run `npm audit` periodically and patch security vulnerabilities
  - Consider using `npm ci` in production instead of `npm install`

**Unmaintained Dependency:**
- Issue: `youtube-transcript` library (NPM package) may not be actively maintained
- Files: `./server/services/youtubeService.js:1`
- Risk: YouTube could change API; library could break without fixes
- Recommendations:
  - Monitor package for updates and issues
  - Have contingency plan (e.g., use official YouTube Data API if transcript library breaks)

**Hardcoded SDK Import Path:**
- Issue: `youtube-transcript/dist/youtube-transcript.esm.js` imports specific build artifact
- Files: `./server/services/youtubeService.js:1`
- Problem: Fragile; library update could change or remove this path
- Recommendations: Import from package root/index (`youtube-transcript` instead)

## Testing & Quality Gaps

**No Tests:**
- Issue: `package.json` scripts define `test: echo \"Error: no test specified\"`
- Files: `./server/package.json`, `./client/package.json`
- Impact: No automated verification of functionality; refactoring risky; regressions undetected
- Critical untested paths:
  - `./server/services/youtubeService.js`: Video ID extraction (regex could fail)
  - `./server/services/assemblyService.js`: Segment chunking logic
  - `./client/src/components/UrlInput.jsx`: URL validation (substring matching is fragile)
- Recommendations: Add test suite with Jest/Vitest covering critical paths

**No Linting Rules Enforcement:**
- Issue: ESLint configured (`.eslintrc` exists) but not run in CI/pre-commit
- Files: `./client/eslint.config.js`
- Problem: Code quality issues won't be caught
- Recommendations: Add pre-commit hook (husky) to enforce linting before commits

## Fragile Areas

**YouTube Transcript Fallback Chain:**
- Files: `./server/services/youtubeService.js:22-34`
- Why fragile: YouTube could change API; library could break; nested try-catch obscures failures
- Safe modification: Add tests for each language variant (en, id, auto); log which attempt succeeds/fails
- Test coverage: Currently zero for this module

**Video ID Extraction Regex:**
- Files: `./server/services/youtubeService.js:9`
- Why fragile: Regex assumes fixed 11-character ID format; YouTube could change URL structure
- Pattern: `(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|watch\?v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})`
- Safe modification: 
  - Add unit tests for various URL formats (long URL, short URL, embed, shorts)
  - Add validation that extracted ID matches pattern (alphanumeric + hyphen/underscore)
- Risk: If regex fails to match, user gets "Invalid YouTube URL" even if URL is valid

**File Cleanup After AssemblyAI Transcription:**
- Files: `./server/services/assemblyService.js:45-46`
- Why fragile: Fire-and-forget cleanup; if deletion fails, file persists; no backpressure
- Safe modification: 
  - Wrap cleanup in try-catch with logging
  - Use Promise instead of callback for proper error handling
  - Consider cleanup job to remove stale files
- Current risk: `/tmp` fills up over time

**Audio Download Command Construction:**
- Files: `./server/services/audioService.js:15`
- Why fragile: String interpolation in shell command (command injection risk)
- Safe modification: Refactor to use `spawn()` with argument array
- Current risk: If videoId validation bypassed, arbitrary command execution possible

## Missing Critical Features

**No User Authentication/Authorization:**
- Issue: All endpoints publicly accessible with no rate limiting or API keys
- Files: `./server/index.js`, `./server/routes/transcript.js`
- Problem: Anyone can use the API; expensive AssemblyAI quota can be exhausted by external users
- Blocking: Self-hosting or multi-user scenarios
- Recommendations:
  - Add API key authentication
  - Implement rate limiting per key/IP
  - Track usage/quota per user

**No Async Job Queue:**
- Issue: Long-running transcriptions block HTTP connection
- Files: `./server/routes/transcript.js`
- Problem: Request times out or client disconnects during processing
- Recommendations: 
  - Return job ID immediately
  - Add polling endpoint to check status
  - Use job queue (Bull, RabbitMQ) for background processing

**No Caching Layer:**
- Issue: Duplicate requests for same video reprocess entirely
- Files: `./server/routes/transcript.js`
- Impact: Wasted API calls and bandwidth
- Recommendations: Cache results by video ID

---

*Concerns audit: 2026-04-17*
