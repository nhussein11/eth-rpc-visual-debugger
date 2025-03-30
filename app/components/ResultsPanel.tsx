import React from "react";
import { ResultCard } from "./ResultCard";
import { ResultType } from "../types";

interface ResultsPanelProps {
  activeRequests: string[];
  results: Array<{ id: string; method: string; result: ResultType }>;
  loading: Record<string, boolean>;
  removeRequest: (method: string) => void;
}

export const ResultsPanel = ({
  activeRequests,
  results,
  loading,
  removeRequest,
}: ResultsPanelProps) => {
  return (
    <div className="w-96 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Results ({results.length})</h2>
      </div>

      <div className="h-full flex flex-col gap-4 pb-8 overflow-y-auto">
        {activeRequests.map((method) => {
          const resultEntry = results.find((result) => result.id === method);
          return resultEntry ? (
            <ResultCard
              key={method}
              method={method}
              result={resultEntry.result}
              loading={loading[method]}
              onRemove={() => removeRequest(method)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};
