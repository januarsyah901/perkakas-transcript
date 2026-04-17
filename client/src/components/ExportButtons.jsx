import React, { useState } from 'react';

const ExportButtons = ({ fullText, segments, segmentsToSrt }) => {
  const [copied, setCopied] = useState(false);

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    downloadFile('transcript.txt', fullText, 'text/plain');
  };

  const handleDownloadSrt = () => {
    const srt = segmentsToSrt(segments);
    downloadFile('transcript.srt', srt, 'text/plain');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mt-6">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-900 hover:border-blue-700 hover:text-blue-800 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
      
      <button
        onClick={handleDownloadTxt}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-900 hover:border-blue-700 hover:text-blue-800 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download TXT
      </button>

      <button
        onClick={handleDownloadSrt}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-800 text-white hover:bg-blue-900 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Download SRT
      </button>
    </div>
  );
};

export default ExportButtons;
