
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

const ProcessingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex flex-col items-center justify-center z-50 transition-opacity duration-300">
      <div className="flex items-center space-x-4 p-8 bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
        <SpinnerIcon className="h-10 w-10 text-teal-400" />
        <div>
            <h3 className="text-xl font-semibold text-white">Processing Document...</h3>
            <p className="text-slate-400 mt-1">Please wait while we extract the data.</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;