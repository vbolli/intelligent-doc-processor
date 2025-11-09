import React from 'react';
import { Execution, Status } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';

interface ExecutionHistoryProps {
  history: Execution[];
  onSelect: (execution: Execution) => void;
  selectedId?: string;
}

const StatusIcon: React.FC<{ status: Status }> = ({ status }) => {
    switch (status) {
        case Status.Completed:
            return <CheckCircleIcon className="text-green-500" />;
        case Status.Failed:
            return <XCircleIcon className="text-red-500" />;
        case Status.Parsing:
        case Status.Generating:
            return <ClockIcon className="text-yellow-500" />;
        default:
            return null;
    }
};

const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ history, onSelect, selectedId }) => {
  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Previous Executions</h3>
      {history.length === 0 ? (
        <p className="text-sm text-slate-500">No executions yet.</p>
      ) : (
        <ul className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {history.map(exec => (
            <li key={exec.id}>
                <button 
                    onClick={() => onSelect(exec)}
                    className={`w-full flex items-center justify-between p-3 bg-slate-700 rounded-md text-left transition-all duration-200
                        ${selectedId === exec.id 
                            ? 'ring-2 ring-teal-500 bg-slate-600' 
                            : 'hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-teal-600'}`
                    }
                >
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <StatusIcon status={exec.status} />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-200 truncate" title={exec.fileName}>
                                {exec.fileName}
                            </p>
                            <p className="text-xs text-slate-400">
                                {new Date(exec.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                        exec.status === Status.Completed ? 'bg-green-900 text-green-300' :
                        exec.status === Status.Failed ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                    }`}>
                        {exec.status === Status.Generating || exec.status === Status.Parsing ? 'In Progress' : exec.status}
                    </span>
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExecutionHistory;