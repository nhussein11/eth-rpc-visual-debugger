import React from 'react';
import { FormDataType, FieldConfigType } from '../types';

interface InputFormProps {
  formData: FormDataType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  requiredFields: string[];
}

const InputForm: React.FC<InputFormProps> = ({ formData, handleInputChange, requiredFields }) => {
  const fieldConfig: Record<string, FieldConfigType> = {
    address: { label: "Address", type: "text", placeholder: "0x...", component: "input" },
    blockValue: { 
      label: "Block Value", 
      type: "select", 
      options: [
        { value: "latest", label: "latest" },
        { value: "earliest", label: "earliest" },
        { value: "pending", label: "pending" },
        { value: "0x1", label: "Block 0x1" }
      ],
      component: "select"
    },
    blockHash: { label: "Block Hash", type: "text", placeholder: "0x...", component: "input" },
    showFullTransactions: { label: "Show Full Transactions", type: "checkbox", component: "checkbox" },
    recipientAddress: { label: "Recipient Address", type: "text", placeholder: "0x...", component: "input" },
    encodedCall: { label: "Encoded Call Data", type: "text", placeholder: "0x...", component: "input" },
    storageKey: { label: "Storage Key", type: "text", placeholder: "0x...", component: "input" },
    gasLimit: { label: "Gas Limit", type: "text", placeholder: "90000", component: "input" },
    gasPrice: { label: "Gas Price", type: "text", placeholder: "0x...", component: "input" },
    value: { label: "Value (Wei)", type: "text", placeholder: "0", component: "input" },
    inputData: { label: "Input Data", type: "text", placeholder: "0x...", component: "input" },
    nonce: { label: "Nonce", type: "text", placeholder: "0x...", component: "input" },
    callData: { label: "Raw Transaction Data", type: "text", placeholder: "0x...", component: "input" }
  };

  if (requiredFields.length === 0) {
    return <p className="text-gray-500">No input parameters required</p>;
  }

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow w-full">
      <h3 className="font-medium mb-2">Required Parameters</h3>
      
      {requiredFields.map(field => {
        const config = fieldConfig[field];
        
        if (!config) return null;
        
        if (config.component === "checkbox") {
          return (
            <div key={field} className="flex items-center">
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={formData[field as keyof FormDataType] as boolean}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor={field} className="ml-2 text-sm text-gray-700">
                {config.label}
              </label>
            </div>
          );
        }
        
        if (config.component === "select") {
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
              <select
                name={field}
                value={formData[field as keyof FormDataType] as string}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {config.options?.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          );
        }
        
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
            <input
              type={config.type}
              name={field}
              value={formData[field as keyof FormDataType] as string}
              onChange={handleInputChange}
              placeholder={config.placeholder}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputForm