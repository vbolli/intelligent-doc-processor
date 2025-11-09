import React, { useState, useEffect, useMemo } from 'react';
import { SchemaField, Status, Execution, SchemaTemplate } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { processDocument, generateSchemaFromDocument, getHistory, getSchemas, saveSchema } from '../services/geminiService';

import FileUpload from './FileUpload';
import SchemaBuilder from './SchemaBuilder';
import StatusIndicator from './StatusIndicator';
import ResultsTable from './ResultsTable';
import ExecutionHistory from './ExecutionHistory';
import ProcessingModal from './ProcessingModal';
import SaveSchemaModal from './SaveSchemaModal';
import SchemaTemplates from './SchemaTemplates';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SaveIcon } from './icons/SaveIcon';


interface DocumentProcessorProps {
  user: { email: string };
  onLogout: () => void;
}

const DocumentProcessor: React.FC<DocumentProcessorProps> = ({ user, onLogout }) => {
  const [file, setFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<SchemaField[]>([
    { id: '1', name: 'invoice_id', description: 'The unique identifier for the invoice', type: 'String' },
    { id: '2', name: 'total_amount', description: 'The total amount due on the invoice', type: 'Float' },
  ]);
  const [userPrompt, setUserPrompt] = useState<string>('');
  
  const [currentExecution, setCurrentExecution] = useState<Execution | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [history, setHistory] = useState<Execution[]>([]);
  
  const [savedSchemas, setSavedSchemas] = useState<SchemaTemplate[]>([]);
  const [isSaveSchemaModalOpen, setIsSaveSchemaModalOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGeneratingSchema, setIsGeneratingSchema] = useState<boolean>(false);

  const isProcessingAllowed = !isProcessing && !isGeneratingSchema;

  const executionToDisplay = useMemo(() => selectedExecution || currentExecution, [selectedExecution, currentExecution]);

  // Fetch initial data (history and saved schemas)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userHistory, userSchemas] = await Promise.all([
          getHistory(user.email),
          getSchemas(user.email)
        ]);
        setHistory(userHistory);
        setSavedSchemas(userSchemas);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        alert("Could not load user data. Please try again later.");
      }
    };
    fetchInitialData();
  }, [user.email]);

  const resetStateForNewRun = () => {
    setFile(null);
    setCurrentExecution(null);
    setSelectedExecution(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  }

  const handleSelectTemplate = (templateSchema: SchemaField[]) => {
    // We need to generate new IDs to avoid key conflicts in React
    const newSchema = templateSchema.map(field => ({...field, id: Date.now().toString() + field.id}));
    setSchema(newSchema);
  };
  
  const handleSaveSchema = async (name: string) => {
    try {
        const newTemplate = await saveSchema({ name, schema, userId: user.email });
        setSavedSchemas(prev => [...prev, newTemplate]);
        setIsSaveSchemaModalOpen(false);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        alert(`Failed to save schema: ${errorMessage}`);
    }
  };

  const handleGenerateSchema = async () => {
    if (!file) {
      alert("Please upload a document first to generate a schema.");
      return;
    }
    setIsGeneratingSchema(true);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const generatedSchema = await generateSchemaFromDocument(base64, mimeType);
      if (generatedSchema.length > 0) {
        setSchema(generatedSchema);
      } else {
        alert("Could not generate a schema from the document. Please define one manually.");
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        alert(`Schema generation failed: ${errorMessage}`);
    } finally {
        setIsGeneratingSchema(false);
    }
  };

  const handleProcess = async () => {
    if (!file || schema.length === 0 || schema.some(f => !f.name)) {
      alert("Please select a file and ensure all schema fields have a name.");
      return;
    }

    setIsProcessing(true);
    setSelectedExecution(null); // Unselect any historical run
    
    const tempExecution: Execution = {
      id: Date.now().toString(),
      fileName: file.name,
      status: Status.Parsing,
      timestamp: new Date().toISOString(),
    };
    setCurrentExecution(tempExecution);

    try {
        const { base64, mimeType } = await fileToBase64(file);
        
        const finalExecution = await processDocument({
            userPrompt, 
            schema, 
            fileData: { base64, mimeType }, 
            fileName: file.name, 
            userId: user.email
        });
        
        setCurrentExecution(finalExecution);
        setSelectedExecution(finalExecution); // Automatically select the new run to show results
        
        const userHistory = await getHistory(user.email);
        setHistory(userHistory);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const failedExecution = {
            ...tempExecution,
            status: Status.Failed,
            error: errorMessage
        };
        setCurrentExecution(failedExecution);
        setSelectedExecution(failedExecution);
        
        const userHistory = await getHistory(user.email);
        setHistory(userHistory);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <>
        {isProcessing && <ProcessingModal />}
        <SaveSchemaModal 
            isOpen={isSaveSchemaModalOpen}
            onClose={() => setIsSaveSchemaModalOpen(false)}
            onSave={handleSaveSchema}
        />
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-teal-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Document Extractor</h1>
                        <p className="text-slate-400">Logged in as {user.email}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-teal-300 border border-teal-600 rounded-md hover:bg-teal-900/50 transition-colors">
                    Logout
                </button>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: File Upload */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Upload Document</h2>
                        <FileUpload onFileSelect={setFile} disabled={!isProcessingAllowed} />
                    </section>
                    
                    {/* Step 2: Global Instructions */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Global Instructions (Optional)</h2>
                        <textarea
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            rows={3}
                            className="w-full p-3 text-white placeholder-slate-400 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g., The document is an invoice. Extract all line items."
                            disabled={!isProcessingAllowed}
                        />
                    </section>

                    {/* Step 3: Schema Builder */}
                    <section>
                        <div className="flex justify-between items-center mb-2">
                             <h2 className="text-xl font-semibold text-white">3. Define Schema</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsSaveSchemaModalOpen(true)}
                                    disabled={!isProcessingAllowed || schema.length === 0}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 border border-slate-500 rounded-md hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Save current schema as a template"
                                >
                                    <SaveIcon />
                                    Save
                                </button>
                                <button
                                    onClick={handleGenerateSchema}
                                    disabled={!file || !isProcessingAllowed}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-teal-300 border border-teal-500 rounded-md hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Generate schema from document"
                                >
                                    <MagicWandIcon />
                                    Auto-generate
                                </button>
                            </div>
                        </div>
                        <SchemaBuilder schema={schema} setSchema={setSchema} disabled={!isProcessingAllowed} isLoading={isGeneratingSchema} />
                    </section>
                    
                    {savedSchemas.length > 0 && (
                        <section>
                             <h2 className="text-xl font-semibold text-white mb-2">Saved Templates</h2>
                             <SchemaTemplates templates={savedSchemas} onSelect={handleSelectTemplate} disabled={!isProcessingAllowed} />
                        </section>
                    )}


                    {/* Action Button */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            onClick={handleProcess}
                            disabled={!file || schema.length === 0 || !isProcessingAllowed}
                            className="px-6 py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            Extract Data
                        </button>
                        {currentExecution && (
                             <button
                                onClick={resetStateForNewRun}
                                disabled={isProcessing || isGeneratingSchema}
                                className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-600 rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                Start New Extraction
                            </button>
                        )}
                    </div>

                    {/* Step 4: Results */}
                    {executionToDisplay && (
                        <section className="pt-8">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Results for <span className="text-teal-400 font-medium">{executionToDisplay.fileName}</span>
                            </h2>
                            <div className="space-y-4">
                                <StatusIndicator status={executionToDisplay.status} error={executionToDisplay.error} />
                                {executionToDisplay.status === Status.Completed && executionToDisplay.resultData && (
                                    <ResultsTable data={executionToDisplay.resultData} />
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="lg:col-span-1">
                    <ExecutionHistory 
                        history={history} 
                        onSelect={setSelectedExecution}
                        selectedId={selectedExecution?.id}
                    />
                </aside>
            </main>
        </div>
    </>
  );
};

export default DocumentProcessor;