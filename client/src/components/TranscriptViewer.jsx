import React from 'react';
import ExportButtons from './ExportButtons';
import { segmentsToSrt } from '../utils/srtFormatter';

const TranscriptViewer = ({ result }) => {
  if (!result) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-gray-100">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center text-center sm:text-left flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {result.title !== 'Unknown Video' ? result.title : `Video: ${result.videoId}`}
          </h2>
          {result.channel && result.channel !== 'Unknown Channel' && (
            <p className="text-blue-600 font-semibold text-sm mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-2.692.802 4.135 4.135 0 01-3.34 0z" />
              </svg>
              {result.channel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full h-fit">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">
            {result.source === 'youtube-v3' ? 'V3 API' : result.source === 'youtube' ? 'Scraping' : 'AI AI'}
          </span>
        </div>
      </div>
      <div className="p-8">
        <textarea
          readOnly
          className="w-full h-[500px] p-6 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none resize-none font-sans leading-relaxed text-gray-700 text-lg shadow-inner"
          value={result.fullText}
        />
        <ExportButtons 
          fullText={result.fullText} 
          segments={result.segments} 
          segmentsToSrt={segmentsToSrt} 
        />
      </div>
    </div>
  );
};

export default TranscriptViewer;
