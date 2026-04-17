Build the React frontend in /client/src/

App.jsx should have these states:
  - url (string)
  - status: "idle" | "loading" | "done" | "error"
  - result: null | { source, videoId, fullText, segments }
  - errorMsg: string

Components to create:

1. UrlInput.jsx
   - A text input for YouTube URL + a "Transcribe" button
   - Validate on submit: must contain "youtube.com" or "youtu.be"
   - Show inline error if invalid
   - Disable input + button while status === "loading"

2. ProgressBar.jsx
   - Show only when status === "loading"
   - Animated indeterminate progress bar (CSS animation, no library)
   - Label: "Fetching transcript..." or "Transcribing audio, this may take a minute..."
   - Pass a prop "mode" ("caption" | "audio") to switch label

3. TranscriptViewer.jsx
   - Show result.fullText in a scrollable textarea (read-only, height: 400px)
   - Show a small badge: "Source: YouTube captions" or "Source: AssemblyAI"
   - Import and render ExportButtons.jsx below the textarea

4. ExportButtons.jsx
   - "Copy to clipboard" button — copies fullText, shows "Copied!" for 2s
   - "Download TXT" button — triggers download of fullText as transcript.txt
   - "Download SRT" button — converts segments to SRT format and downloads as transcript.srt

SRT format:
  1
  00:00:01,000 --> 00:00:04,000
  Hello world

Use Tailwind for styling. Keep it clean and minimal.