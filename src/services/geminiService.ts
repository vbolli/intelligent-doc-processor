import { SchemaField, Execution, SchemaTemplate } from '../types';

// The backend is expected to be running on this URL.
// In a real production environment, this would be a configurable environment variable.
const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const generateSchemaFromDocument = async (
  base64Data: string,
  mimeType: string
): Promise<SchemaField[]> => {
    const response = await fetch(`${API_BASE_URL}/generate-schema`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
    });
    return handleResponse(response);
};

interface ProcessDocumentArgs {
    userPrompt: string;
    schema: SchemaField[];
    fileData: { base64: string; mimeType: string };
    fileName: string;
    userId: string;
}

export const processDocument = async (args: ProcessDocumentArgs): Promise<Execution> => {
    const response = await fetch(`${API_BASE_URL}/process-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
    });
    return handleResponse(response);
};

export const getHistory = async (userId: string): Promise<Execution[]> => {
    const response = await fetch(`${API_BASE_URL}/history?userId=${encodeURIComponent(userId)}`);
    return handleResponse(response);
};

// New functions for schema templates

export const getSchemas = async (userId: string): Promise<SchemaTemplate[]> => {
    const response = await fetch(`${API_BASE_URL}/schemas?userId=${encodeURIComponent(userId)}`);
    return handleResponse(response);
}

interface SaveSchemaArgs {
    name: string;
    schema: SchemaField[];
    userId: string;
}

export const saveSchema = async (args: SaveSchemaArgs): Promise<SchemaTemplate> => {
    const response = await fetch(`${API_BASE_URL}/schemas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
    });
    return handleResponse(response);
}