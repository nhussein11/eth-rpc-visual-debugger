"use client";

import Link from "next/link";

const explorerUrl =
  "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-westend.dotters.network#/explorer";

export const Header = () => {
  return (
    <header className="sticky top-0 flex justify-between border-b-2 border-pink-500 text-black p-4">
      <h1 className="text-xl font-bold">ETH RPC Visual Debugger - Asset Hub</h1>
      <Link
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer font-sans text-sm italic hover:underline"
      >
        https://westend-asset-hub-eth-rpc.polkadot.io
      </Link>
    </header>
  );
};
