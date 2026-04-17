Create /client/src/utils/srtFormatter.js

Export one function:
segmentsToSrt(segments: Array<{start: number, end: number, text: string}>): string

- Convert each segment to SRT block format
- start and end are in milliseconds
- Convert ms to SRT timestamp: HH:MM:SS,mmm
- Number each block starting from 1
- Separate blocks with a blank line
- Example output:
  1
  00:00:01,240 --> 00:00:03,800
  Hello, welcome to the video.

  2
  00:00:04,100 --> 00:00:07,500
  Today we will learn about transcription.

---

Then wire everything in App.jsx:

handleSubmit():
  1. Set status to "loading"
  2. POST to http://localhost:3001/api/transcript with { url }
  3. On success: set result, set status to "done"
  4. On error: set errorMsg from response.message, set status to "error"

Pass segmentsToSrt to ExportButtons via props so the SRT download button works.

Also: in ExportButtons, implement the download helper:
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }