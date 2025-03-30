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
  component: "input" | "select" | "checkbox";
  options?: Array<{ value: string; label: string }>;
}

export interface CallObject {
  to: string;
  data: string;
  from?: string;
}

export interface TransactionObject {
  from: string;
  to?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
  nonce?: string;
}

export interface HexValue {
  path: string[];
  value: string;
  readableValue: string | number;
}
