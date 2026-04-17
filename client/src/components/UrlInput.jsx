import React, { useState } from 'react';

const UrlInput = ({ onSubmit, isLoading, useV3, setUseV3 }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed.includes('youtube.com') && !trimmed.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 md:mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-700 group-focus-within:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            placeholder="Paste YouTube Link..."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'url-input-error' : undefined}
            className={`w-full pl-14 pr-[7.6rem] sm:pr-32 py-4 sm:py-5 bg-white border-2 rounded-2xl text-base md:text-lg font-medium shadow-lg transition-all outline-none text-slate-900 
              ${error ? 'border-red-700 focus:border-red-800' : 'border-slate-400 focus:border-blue-700 focus:shadow-blue-100'}`}
          />
          <button
            type="submit"
            disabled={isLoading || !value}
            className="absolute right-2 sm:right-3 px-3 sm:px-4 md:px-6 py-2.5 md:py-3 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 disabled:bg-slate-300 disabled:text-slate-700 transition-all shadow-md active:scale-95"
          >
            {isLoading ? '...' : 'Transcribe'}
          </button>
        </div>
        
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 px-1 sm:px-2">
          <div className="flex items-center gap-3 min-w-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={useV3}
                onChange={() => setUseV3(!useV3)}
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700"></div>
            </label>
            <span className="text-sm font-semibold text-slate-800">
              {useV3 ? 'Official YouTube API (v3)' : 'Scraping Mode (Default)'}
            </span>
          </div>
          {error && (
            <div id="url-input-error" className="flex items-center gap-1 text-red-800 text-sm font-semibold animate-slide-up" role="alert">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UrlInput;
