// FIX: Implementing Gemini API logic for schema generation and document processing.
import { GoogleGenAI, Type } from '@google/genai';
import { SchemaField, SchemaItemType } from './types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mapSchemaTypeToGeminiType = (type: SchemaItemType): Type => {
    switch (type) {
        case 'String':
            return Type.STRING;
        case 'Number':
            return Type.NUMBER;
        case 'Float':
            return Type.NUMBER;
        default:
            return Type.STRING;
    }
}

export const generateSchema = async (base64Data: string, mimeType: string): Promise<SchemaField[]> => {
    const model = 'gemini-2.5-pro'; 
    
    const prompt = `You are an expert at analyzing documents and creating a data extraction schema.
Analyze the following document and suggest a schema for extracting the key information.
The schema should be an array of objects, where each object has 'name', 'description', and 'type'.
The 'type' can be 'String', 'Number', 'Float', or 'Array'. If the type is 'Array', also include an 'itemType' which can be 'String', 'Number', or 'Float'.
For field names, use snake_case.
Provide a concise but clear description for each field.
Do not extract metadata like file name or page numbers. Focus on the content of the document.
Based on the document, what would be a good schema to extract its information?`;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'The name of the field, in snake_case.' },
                description: { type: Type.STRING, description: 'A concise description of what the field represents.' },
                type: { type: Type.STRING, description: "The data type, one of 'String', 'Number', 'Float', or 'Array'." },
                itemType: { type: Type.STRING, description: "If type is 'Array', the type of items in the array. One of 'String', 'Number', or 'Float'." }
            },
            required: ['name', 'description', 'type']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType
                        }
                    }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });
        
        const text = response.text.trim();
        const generatedSchema = JSON.parse(text);

        return generatedSchema.map((field: any, index: number) => ({
            ...field,
            id: Date.now().toString() + index,
        }));
    } catch (error) {
        console.error("Error generating schema with Gemini:", error);
        throw new Error("Failed to generate schema from the document.");
    }
};

interface ProcessDocumentWithSchemaArgs {
    userPrompt: string;
    schema: SchemaField[];
    fileData: { base64: string; mimeType: string };
}

export const processDocumentWithSchema = async (args: ProcessDocumentWithSchemaArgs): Promise<Record<string, any>[]> => {
    const { userPrompt, schema, fileData } = args;
    const model = 'gemini-2.5-pro';

    const properties: { [key: string]: any } = {};
    schema.forEach(field => {
        if (field.name) { // only add fields with a name
            properties[field.name] = {
                type: field.type === 'Array' ? Type.ARRAY : mapSchemaTypeToGeminiType(field.type as SchemaItemType),
                description: field.description
            };
            if (field.type === 'Array') {
                properties[field.name].items = {
                    type: mapSchemaTypeToGeminiType(field.itemType || 'String')
                };
            }
        }
    });

    const responseSchema = {
        type: Type.ARRAY,
        description: "An array of objects, where each object conforms to the provided schema.",
        items: {
            type: Type.OBJECT,
            properties: properties,
            required: schema.map(f => f.name).filter(Boolean),
        }
    };

    const prompt = `Analyze the provided document and extract information according to the user's instructions and the JSON schema.
User instructions: "${userPrompt || 'No specific instructions provided.'}"
The output MUST be a JSON array of objects, where each object's structure is defined by the provided schema.
If you cannot find a value for a field, use null.
If the instructions imply multiple items should be extracted (like line items from an invoice), return an array with one object per item.
If the document is a single entity (like a single invoice summary), return an array with a single object.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: fileData.base64,
                            mimeType: fileData.mimeType
                        }
                    }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        const text = response.text.trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error processing document with Gemini:", error);
        throw new Error("Failed to extract data from the document.");
    }
};
