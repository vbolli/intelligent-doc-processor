import React from 'react';
import { Status } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';

interface StatusIndicatorProps {
  status: Status;
  error?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, error }) => {
  const getStatusContent = () => {
    switch (status) {
      case Status.Parsing:
      case Status.Generating:
        return {
          icon: <ClockIcon className="animate-spin" />,
          text: status,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/50',
          borderColor: 'border-yellow-700'
        };
      case Status.Completed:
        return {
          icon: <CheckCircleIcon />,
          text: 'Extraction Complete',
          color: 'text-green-400',
          bgColor: 'bg-green-900/50',
          borderColor: 'border-green-700'
        };
      case Status.Failed:
        return {
          icon: <XCircleIcon />,
          text: 'Extraction Failed',
          color: 'text-red-400',
          bgColor: 'bg-red-900/50',
          borderColor: 'border-red-700'
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();
  if (!content) return null;

  return (
    <div className={`p-4 rounded-lg border ${content.bgColor} ${content.borderColor}`}>
      <div className={`flex items-center space-x-3 font-medium ${content.color}`}>
        {content.icon}
        <span>{content.text}</span>
      </div>
      {status === Status.Failed && error && (
        <p className="mt-2 text-sm text-gray-400">{error}</p>
      )}
    </div>
  );
};

export default StatusIndicator;