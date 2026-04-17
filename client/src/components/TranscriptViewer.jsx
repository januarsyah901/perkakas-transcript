import React from 'react';
import ExportButtons from './ExportButtons';
import { segmentsToSrt } from '../utils/srtFormatter';

const TranscriptViewer = ({ result }) => {
  if (!result) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center text-center sm:text-left flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transcript for {result.videoId}</h2>
          <p className="text-gray-500 text-sm mt-1">Generated successfully</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">
            Source: {result.source === 'youtube' ? 'YouTube' : 'AssemblyAI'}
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
