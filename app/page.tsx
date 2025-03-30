"use client";

import { useState } from "react";
import MethodSelector from "./components/MethodSelector";
import InputForm from "./components/InputForm";
import ResultsPanel from "./components/ResultsPanel";
import { MethodConfig, FormDataType, ResultType } from "./types";
import { Header } from "./components/Header";

export default function Home() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeRequests, setActiveRequests] = useState<string[]>([]);
  const [results, setResults] = useState<
    Array<{ id: string; method: string; result: ResultType }>
  >([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormDataType>({
    address: "",
    blockValue: "latest",
    blockHash: "",
    showFullTransactions: false,
    recipientAddress: "",
    encodedCall: "",
    storageKey: "",
    gasLimit: "90000",
    gasPrice: "",
    value: "0",
    inputData: "",
    nonce: "",
    callData: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name as keyof FormDataType]: type === "checkbox" ? checked : value,
    });
  };

  interface CallObject {
    to: string;
    data: string;
    from?: string;
  }

  interface TransactionObject {
    from: string;
    to?: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
    nonce?: string;
  }

  const executeRpcCall = async (method: string, params: unknown[] = []) => {
    const requestId = `${method}-${results.length + 1}`;
    setLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      const response = await fetch(
        "https://westend-asset-hub-eth-rpc.polkadot.io",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method,
            params,
            id: 1,
            jsonrpc: "2.0",
          }),
        }
      );
      const data = await response.json();
      setResults((prev) => [...prev, { id: requestId, method, result: data }]);
      setActiveRequests((prev) => [...prev, requestId]);
    } catch (error) {
      console.error(`Error executing ${method}:`, error);
      setResults((prev) => [
        ...prev,
        { id: requestId, method, result: { error: (error as Error).message } },
      ]);
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const methodConfigs: Record<string, MethodConfig> = {
    eth_accounts: {
      execute: () => executeRpcCall("eth_accounts"),
      fields: [],
    },
    eth_blockNumber: {
      execute: () => executeRpcCall("eth_blockNumber"),
      fields: [],
    },
    eth_call: {
      execute: () => {
        if (!formData.recipientAddress)
          return alert("Recipient address is required");
        const callObj: CallObject = {
          to: formData.recipientAddress,
          data: formData.encodedCall,
        };
        if (formData.address) callObj.from = formData.address;
        executeRpcCall("eth_call", [callObj, formData.blockValue]);
      },
      fields: ["address", "recipientAddress", "encodedCall", "blockValue"],
    },
    eth_chainId: {
      execute: () => executeRpcCall("eth_chainId"),
      fields: [],
    },
    eth_estimateGas: {
      execute: () => {
        if (!formData.recipientAddress)
          return alert("Recipient address is required");
        const callObj: CallObject = {
          to: formData.recipientAddress,
          data: formData.encodedCall,
        };
        if (formData.address) callObj.from = formData.address;
        executeRpcCall("eth_estimateGas", [callObj]);
      },
      fields: ["address", "recipientAddress", "encodedCall"],
    },
    eth_gasPrice: {
      execute: () => executeRpcCall("eth_gasPrice"),
      fields: [],
    },
    eth_getBalance: {
      execute: () => {
        if (!formData.address) return alert("Address is required");
        executeRpcCall("eth_getBalance", [
          formData.address,
          formData.blockValue,
        ]);
      },
      fields: ["address", "blockValue"],
    },
    eth_getBlockByHash: {
      execute: () => {
        if (!formData.blockHash) return alert("Block hash is required");
        executeRpcCall("eth_getBlockByHash", [
          formData.blockHash,
          formData.showFullTransactions,
        ]);
      },
      fields: ["blockHash", "showFullTransactions"],
    },
    eth_getBlockByNumber: {
      execute: () => {
        executeRpcCall("eth_getBlockByNumber", [
          formData.blockValue,
          formData.showFullTransactions,
        ]);
      },
      fields: ["blockValue", "showFullTransactions"],
    },
    eth_getCode: {
      execute: () => {
        if (!formData.address) return alert("Address is required");
        executeRpcCall("eth_getCode", [formData.address, formData.blockValue]);
      },
      fields: ["address", "blockValue"],
    },
    eth_getStorageAt: {
      execute: () => {
        if (!formData.address) return alert("Address is required");
        if (!formData.storageKey) return alert("Storage key is required");
        executeRpcCall("eth_getStorageAt", [
          formData.address,
          formData.storageKey,
          formData.blockValue,
        ]);
      },
      fields: ["address", "storageKey", "blockValue"],
    },
    eth_getTransactionCount: {
      execute: () => {
        if (!formData.address) return alert("Address is required");
        executeRpcCall("eth_getTransactionCount", [
          formData.address,
          formData.blockValue,
        ]);
      },
      fields: ["address", "blockValue"],
    },
    eth_maxPriorityFeePerGas: {
      execute: () => executeRpcCall("eth_maxPriorityFeePerGas"),
      fields: [],
    },
    eth_sendRawTransaction: {
      execute: () => {
        if (!formData.callData) return alert("Call data is required");
        executeRpcCall("eth_sendRawTransaction", [formData.callData]);
      },
      fields: ["callData"],
    },
    eth_sendTransaction: {
      execute: () => {
        if (!formData.address) return alert("From address is required");
        const txObj: TransactionObject = {
          from: formData.address,
        };

        if (formData.recipientAddress) txObj.to = formData.recipientAddress;
        if (formData.gasLimit) txObj.gas = formData.gasLimit;
        if (formData.gasPrice) txObj.gasPrice = formData.gasPrice;
        if (formData.value) txObj.value = formData.value;
        if (formData.inputData) txObj.data = formData.inputData;
        if (formData.nonce) txObj.nonce = formData.nonce;

        executeRpcCall("eth_sendTransaction", [txObj]);
      },
      fields: [
        "address",
        "recipientAddress",
        "gasLimit",
        "gasPrice",
        "value",
        "inputData",
        "nonce",
      ],
    },
    net_version: {
      execute: () => executeRpcCall("net_version"),
      fields: [],
    },
  };

  const removeRequest = (method: string) => {
    setActiveRequests((prev) => prev.filter((req) => req !== method));
  };

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden max-h-screen">
        <div className="w-72 p-4 shadow-md overflow-y-auto">
          <MethodSelector
            methodConfigs={methodConfigs}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        </div>

        <div className="w-full flex justify-between p-6 border border-red-400">
          {selectedMethod && (
            <div className="w-full pr-14 mt-6">
              <InputForm
                formData={formData}
                handleInputChange={handleInputChange}
                requiredFields={methodConfigs[selectedMethod]?.fields || []}
              />

              <div className="mt-4">
                <button
                  onClick={() => methodConfigs[selectedMethod]?.execute()}
                  className={`bg-pink-500 w-32 text-white px-4 py-2 rounded hover:bg-pink-600 hover:cursor-pointer`}
                >
                  Execute
                </button>
              </div>
            </div>
          )}
          {activeRequests.length > 0 ? (
            <ResultsPanel
              activeRequests={activeRequests}
              results={results}
              loading={loading}
              removeRequest={removeRequest}
            />
          ) : (
            <div className="flex items-center text-center justify-center w-full h-full">
              <p className="text-gray-500">
                Select a method from the sidebar, configure parameters, and
                execute to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
