import React from 'react';

const ProgressBar = ({ mode }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <p className="text-gray-600 mb-2 text-center">
        {mode === 'audio' 
          ? 'Transcribing audio, this may take a minute...' 
          : 'Fetching transcript...'}
      </p>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-blue-600 w-1/3 animate-progress"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
