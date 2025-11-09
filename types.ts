export enum Status {
  Idle = 'Idle',
  Parsing = 'Parse',
  Generating = 'Schema Generation',
  Failed = 'Failed',
  Completed = 'Completed'
}

export type SchemaItemType = 'String' | 'Number' | 'Float';
export type SchemaType = SchemaItemType | 'Array';


export interface SchemaField {
  id: string;
  name: string;
  description: string;
  type: SchemaType;
  itemType?: SchemaItemType;
}

export interface Execution {
  id: string;
  fileName: string;
  status: Status;
  timestamp: string;
  resultData?: Record<string, any>[];
  error?: string;
  userId?: string;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  schema: SchemaField[];
  userId: string;
}