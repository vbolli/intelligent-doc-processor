import React from 'react';
import { SchemaTemplate, SchemaField } from '../../types';
import { LayersIcon } from '../icons/LayersIcon';

interface SchemaTemplatesProps {
  templates: SchemaTemplate[];
  onSelect: (schema: SchemaField[]) => void;
  disabled: boolean;
}

const SchemaTemplates: React.FC<SchemaTemplatesProps> = ({ templates, onSelect, disabled }) => {
  return (
    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
      <div className="flex items-center gap-2 text-slate-300 mb-3">
        <LayersIcon className="h-5 w-5" />
        <h4 className="font-medium">Load a Template</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.schema)}
            disabled={disabled}
            className="px-3 py-1.5 text-sm text-teal-300 bg-teal-900/50 border border-teal-700 rounded-full hover:bg-teal-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchemaTemplates;