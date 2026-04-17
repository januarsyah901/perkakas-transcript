import React, { useState } from 'react';

const UrlInput = ({ onSubmit, isLoading }) => {
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
    <div className="w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
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
            placeholder="Paste YouTube Link (e.g., https://youtube.com/watch?v=...)"
            className={`w-full pl-14 pr-32 py-5 bg-white border-2 rounded-2xl text-lg font-medium shadow-lg transition-all outline-none 
              ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 focus:shadow-blue-100'}`}
          />
          <button
            type="submit"
            disabled={isLoading || !value}
            className="absolute right-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md active:scale-95"
          >
            {isLoading ? '...' : 'Transcribe'}
          </button>
        </div>
        {error && (
          <div className="absolute -bottom-8 left-4 flex items-center gap-1 text-red-500 text-sm font-semibold animate-slide-up">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default UrlInput;
