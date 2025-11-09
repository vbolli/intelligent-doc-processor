
import React from 'react';
import { SchemaField, SchemaType, SchemaItemType } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import SchemaBuilderSkeleton from './SchemaBuilderSkeleton';

interface SchemaBuilderProps {
  schema: SchemaField[];
  setSchema: (schema: SchemaField[]) => void;
  disabled: boolean;
  isLoading: boolean;
}

const schemaTypes: SchemaType[] = ['String', 'Number', 'Float', 'Array'];
const schemaItemTypes: SchemaItemType[] = ['String', 'Number', 'Float'];

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ schema, setSchema, disabled, isLoading }) => {
  const addField = () => {
    setSchema([...schema, { id: Date.now().toString(), name: '', description: '', type: 'String', itemType: 'String' }]);
  };

  const removeField = (id: string) => {
    setSchema(schema.filter(field => field.id !== id));
  };

  const updateField = (id: string, newField: Partial<SchemaField>) => {
    setSchema(schema.map(field => (field.id === id ? { ...field, ...newField } : field)));
  };
  
  if (isLoading) {
    return <SchemaBuilderSkeleton />;
  }

  return (
    <div className="space-y-4">
      {schema.map((field) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="md:col-span-3">
            <label htmlFor={`field-name-${field.id}`} className="block text-sm font-medium text-slate-300 mb-1">
              Field Name
            </label>
            <input
              type="text"
              id={`field-name-${field.id}`}
              value={field.name}
              onChange={(e) => updateField(field.id, { name: e.target.value })}
              className="w-full px-3 py-2 text-white placeholder-slate-400 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., invoice_number"
              disabled={disabled}
            />
          </div>
          <div className={field.type === 'Array' ? "md:col-span-4" : "md:col-span-6"}>
            <label htmlFor={`field-desc-${field.id}`} className="block text-sm font-medium text-slate-300 mb-1">
              Description / Instructions
            </label>
            <input
              type="text"
              id={`field-desc-${field.id}`}
              value={field.description}
              onChange={(e) => updateField(field.id, { description: e.target.value })}
              className="w-full px-3 py-2 text-white placeholder-slate-400 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Extract all line item descriptions"
              disabled={disabled}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`field-type-${field.id}`} className="block text-sm font-medium text-slate-300 mb-1">
              Type
            </label>
            <select
              id={`field-type-${field.id}`}
              value={field.type}
              onChange={(e) => updateField(field.id, { type: e.target.value as SchemaType })}
              className="w-full px-3 py-2 text-white bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={disabled}
            >
              {schemaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
           {field.type === 'Array' && (
            <div className="md:col-span-2">
                <label htmlFor={`field-item-type-${field.id}`} className="block text-sm font-medium text-slate-300 mb-1">
                Item Type
                </label>
                <select
                id={`field-item-type-${field.id}`}
                value={field.itemType || 'String'}
                onChange={(e) => updateField(field.id, { itemType: e.target.value as SchemaItemType })}
                className="w-full px-3 py-2 text-white bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={disabled}
                >
                {schemaItemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
                </select>
            </div>
          )}
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={() => removeField(field.id)}
              className="p-2 w-full flex justify-center text-slate-400 bg-slate-800 rounded-md hover:bg-red-900/50 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={disabled || schema.length <= 1}
              aria-label="Remove field"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addField}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-300 border border-teal-500 rounded-md hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={disabled}
      >
        <PlusIcon />
        Add Field
      </button>
    </div>
  );
};

export default SchemaBuilder;