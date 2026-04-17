import React from 'react';

const ProgressBar = ({ mode }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <p className="text-slate-700 mb-2 text-center font-medium">
        {mode === 'audio' 
          ? 'Transcribing audio, this may take a minute...' 
          : 'Fetching transcript...'}
      </p>
      <div className="w-full h-2.5 bg-slate-300 rounded-full overflow-hidden relative" role="progressbar" aria-label="Transcription progress" aria-valuetext="Loading">
        <div className="absolute top-0 left-0 h-full bg-blue-800 w-1/3 animate-progress"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
