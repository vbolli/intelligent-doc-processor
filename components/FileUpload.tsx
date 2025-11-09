
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File size cannot exceed ${MAX_FILE_SIZE_MB} MB.`);
        setSelectedFile(null);
        onFileSelect(null);
      } else {
        setError(null);
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if(disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File size cannot exceed ${MAX_FILE_SIZE_MB} MB.`);
            setSelectedFile(null);
            onFileSelect(null);
        } else {
            setError(null);
            setSelectedFile(file);
            onFileSelect(file);
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    }
  }, [onFileSelect, disabled]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div 
        onClick={!disabled ? triggerFileSelect : undefined}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${disabled ? 'bg-slate-700/50 cursor-not-allowed' : 'border-slate-600 hover:border-teal-500 cursor-pointer bg-slate-700'}`}
        >
        <div className="space-y-1 text-center">
          {selectedFile ? <CheckCircleIcon /> : <UploadIcon />}
          <div className="flex text-sm text-slate-400">
            <p className="pl-1">
              {selectedFile ? (
                <span className="font-medium text-green-400">{selectedFile.name}</span>
              ) : (
                <>
                  <span className="font-medium text-teal-400">Upload a file</span> or drag and drop
                </>
              )}
            </p>
            <input
              ref={fileInputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-slate-500">PDF or Image up to {MAX_FILE_SIZE_MB}MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;