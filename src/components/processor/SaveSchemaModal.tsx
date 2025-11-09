import React, { useState, useEffect } from 'react';

interface SaveSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

const SaveSchemaModal: React.FC<SaveSchemaModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setIsSaving(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the schema template.");
      return;
    }
    setIsSaving(true);
    await onSave(name);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-white mb-4">Save Schema Template</h2>
        <p className="text-slate-400 mb-4 text-sm">Enter a name to save the current schema for future use.</p>
        <div>
          <label htmlFor="schema-name" className="sr-only">
            Schema Name
          </label>
          <input
            id="schema-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-white placeholder-slate-400 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g., Invoice Schema"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSchemaModal;