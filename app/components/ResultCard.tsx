import React, { useState } from "react";
import { ResultType, HexValue } from "../types";
import { MdCheckCircle, MdOutlineContentCopy } from "react-icons/md";

interface ResultCardProps {
  method: string;
  result: ResultType;
  loading: boolean;
  onRemove: () => void;
}

export const ResultCard = ({
  method,
  result,
  loading,
  onRemove,
}: ResultCardProps) => {
  const [displayMode, setDisplayMode] = useState<"hex" | "readable">("hex");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getHumanReadableValue = (value: string): string | number => {
    if (typeof value !== "string") return value;
    if (value.startsWith("0x")) {
      try {
        const numeric = BigInt(value);
        if (numeric < BigInt(1000000000000)) {
          return Number(numeric);
        }
      } catch (e: unknown) {
        console.error("Invalid hex value: ", value);
        console.error(e);
      }
    }
    return value;
  };

  const findHexValues = (
    obj: unknown,
    currentPath: string[] = []
  ): HexValue[] => {
    if (!obj) return [];
    let hexValues: HexValue[] = [];
    if (typeof obj === "string" && obj.startsWith("0x")) {
      hexValues.push({
        path: [...currentPath],
        value: obj,
        readableValue: getHumanReadableValue(obj),
      });
    } else if (typeof obj === "object" && !Array.isArray(obj)) {
      Object.entries(obj).forEach(([key, value]) => {
        hexValues = [
          ...hexValues,
          ...findHexValues(value, [...currentPath, key]),
        ];
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        hexValues = [
          ...hexValues,
          ...findHexValues(item, [...currentPath, index.toString()]),
        ];
      });
    }
    return hexValues;
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const transformResult = (obj: unknown): unknown => {
    if (!obj) return obj;
    if (
      typeof obj === "string" &&
      obj.startsWith("0x") &&
      displayMode === "readable"
    ) {
      return getHumanReadableValue(obj);
    }
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) {
      return obj.map((item) => transformResult(item));
    }
    const transformed: Record<string, unknown> = {};
    Object.entries(obj).forEach(([key, value]) => {
      transformed[key] = transformResult(value);
    });
    return transformed;
  };

  const displayResult = result ? transformResult(result) : null;
  const hexValues = result?.result ? findHexValues(result.result) : [];
  const jsonString = JSON.stringify(displayResult, null, 2);

  if (loading) {
    return (
      <div
        className={`bg-white p-4 rounded-lg shadow border-l-4 border-pink-500`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{method}</h3>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white w-96 p-4 pr-12 h-fit rounded-lg shadow border-l-4 border-pink-500`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="font-medium">{method.split("-")[0]}</h3>
          <span className="text-xs">{method.split("-")[1]}</span>
        </div>

        <div className="flex h-8 rounded-full overflow-hidden border border-gray-200">
          <button
            onClick={() => setDisplayMode("hex")}
            className={`px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-200 ${
              displayMode === "hex"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hex
          </button>
          <button
            onClick={() => setDisplayMode("readable")}
            className={`px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-200 ${
              displayMode === "readable"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-300"
            }`}
          >
            Readable
          </button>
        </div>

        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {hexValues.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-medium text-wrap">
            Quick Access Values:
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto text-sm text-wrap">
            {hexValues.map((hexVal, idx) => {
              const fieldId = `${method}-${idx}`;
              const displayValue =
                displayMode === "hex" ? hexVal.value : hexVal.readableValue;
              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="font-mono truncate mr-16 w-full">
                    {displayValue.toString()}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(displayValue.toString(), fieldId)
                    }
                    className="absolute right-2 text-gray-400 cursor-pointer hover:text-gray-600 text-xs"
                  >
                    {copiedField === fieldId ? (
                      <span className="flex flex-row items-center gap-2">
                        Copied! <MdCheckCircle size={16} />
                      </span>
                    ) : (
                      <MdOutlineContentCopy size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
          {jsonString}
        </pre>
        <button
          onClick={() => copyToClipboard(jsonString, "json-result")}
          className="absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-600"
        >
          {copiedField === "json-result" ? (
            <span className="flex flex-row items-center gap- px-2 py-1 rounded text-xs">
              Copied! <MdCheckCircle size={24} />
            </span>
          ) : (
            <MdOutlineContentCopy size={24} className=" p-1 rounded" />
          )}
        </button>
      </div>
    </div>
  );
};