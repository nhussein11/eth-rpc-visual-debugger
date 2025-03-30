import React from "react";
import { MethodConfig, ResultType } from "../types";

interface MethodSelectorProps {
  methodConfigs: Record<string, MethodConfig>
  selectedMethod: string | null;
  setSelectedMethod: (method: string) => void;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({
  methodConfigs,
  selectedMethod,
  setSelectedMethod,
}) => {
  return (
    <div className="method-selector space-y-2">
      {Object.entries(methodConfigs).map(([method]) => (
        <div key={method} className="border border-pink-500 rounded-md overflow-hidden">
          <div 
            className={`transition-all duration-200 overflow-hidden`}
          >
            <div className="space-y-1 bg-white">
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`w-full h-10 font-semibold text-left px-4 py-3 rounded text-sm transition-colors hover:cursor-pointer
                    ${selectedMethod === method 
                      ? `bg-pink-500 text-black` 
                      : `text-gray-700 hover:bg-pink-500`
                    }`}
                >
                  {method}
                </button>
            
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MethodSelector;
