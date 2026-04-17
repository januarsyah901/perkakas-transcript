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
      const response = await axios.post('http://localhost:3001/api/transcript', { 
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
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4 selection:bg-blue-100">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {useV3 ? 'OFFICIAL API MODE' : 'AI-POWERED TRANSCRIPTION'}
          </div>
          <h1 className="text-6xl font-[800] text-slate-900 mb-6 tracking-tight">
            YouTube <span className="text-blue-600">Transcriber</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
          <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-100 text-red-800 rounded-2xl mb-8 flex items-start gap-4 animate-slide-up shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0116 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Error occurred</h3>
              <p className="text-red-600/80 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <TranscriptViewer result={result} />
        )}

        <footer className="mt-24 text-center text-slate-400 text-sm border-t border-slate-100 pt-8">
          <p>&copy; 2026 YouTube Transcriber AI. Pro version with V3 Integration.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
