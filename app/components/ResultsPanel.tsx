import React from "react";
import ResultCard from "./ResultCard";
import { ResultType, MethodConfig } from "../types";

interface ResultsPanelProps {
  activeRequests: string[];
  results: Array<{ id: string; method: string; result: ResultType }>;
  loading: Record<string, boolean>;
  removeRequest: (method: string) => void;
  methodConfigs: Record<string, MethodConfig>;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  activeRequests,
  results,
  loading,
  removeRequest,
  methodConfigs,
}) => {
    console.log(results)
activeRequests.map((method) => (
    console.log(method)
))
  return (
    <div className="w-96 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Results ({activeRequests.length})
        </h2>
      </div>

      <div className="h-full flex flex-col gap-4 pb-8 overflow-y-auto">
        {activeRequests.map((method) => (
          <ResultCard
            key={method}
            method={method}
            result={results.find((result) => result?.id === method)?.result}
            loading={loading[method]}
            onRemove={() => removeRequest(method)}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;
