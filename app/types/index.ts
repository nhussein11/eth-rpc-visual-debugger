export interface FormDataType {
    address: string;
    blockValue: string;
    blockHash: string;
    showFullTransactions: boolean;
    recipientAddress: string;
    encodedCall: string;
    storageKey: string;
    gasLimit: string;
    gasPrice: string;
    value: string;
    inputData: string;
    nonce: string;
    callData: string;
  }
  
  export interface MethodConfig {
    execute: () => void;
    fields: string[];
  }
  
  export interface ResultType {
    result?: unknown;
    error?: string | { message: string };
    id?: number;
    jsonrpc?: string;
  }
  
  export interface FieldConfigType {
    label: string;
    type: string;
    placeholder?: string;
    component: 'input' | 'select' | 'checkbox';
    options?: Array<{ value: string; label: string }>;
  }