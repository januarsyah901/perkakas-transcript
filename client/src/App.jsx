import React, { useState } from 'react';
import axios from 'axios';
import UrlInput from './components/UrlInput';
import ProgressBar from './components/ProgressBar';
import TranscriptViewer from './components/TranscriptViewer';

function App() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [useV3, setUseV3] = useState(false);

  const handleTranscribe = async (url) => {
    setStatus('loading');
    setErrorMsg('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3031/api/transcript', { 
        url,
        useV3 
      });
      setResult(response.data);
      setStatus('done');
    } catch (error) {
      console.error('Transcription error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to transcribe video. Please verify the URL or try again later.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 lg:py-20 px-4 sm:px-6 selection:bg-blue-200 selection:text-slate-950">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 md:mb-14 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-bold mb-5 md:mb-6 border border-blue-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-700"></span>
            </span>
            {useV3 ? 'OFFICIAL API MODE' : 'AI-POWERED TRANSCRIPTION'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-[800] text-slate-950 mb-4 md:mb-6 tracking-tight leading-tight">
            YouTube <span className="text-blue-700">Transcriber</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-800 max-w-2xl mx-auto leading-relaxed px-1">
            Convert any YouTube video to text in seconds. High accuracy, 
            automatic language detection, and multiple export formats.
          </p>
        </header>

        <UrlInput 
          onSubmit={handleTranscribe} 
          isLoading={status === 'loading'} 
          useV3={useV3}
          setUseV3={setUseV3}
        />

        {status === 'loading' && (
          <div className="animate-slide-up">
            <ProgressBar mode={result ? 'caption' : 'audio'} />
          </div>
        )}

        {status === 'error' && (
          <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-red-50 border border-red-200 text-red-900 rounded-2xl mb-8 flex items-start gap-3 sm:gap-4 animate-slide-up shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0116 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Error occurred</h3>
              <p className="text-red-800 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <TranscriptViewer result={result} />
        )}

        <footer className="mt-14 md:mt-20 text-center text-slate-700 text-sm border-t border-slate-300 pt-6 md:pt-8">
          <p>&copy; 2026 YouTube Transcriber AI. Pro version with V3 Integration.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
