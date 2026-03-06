"use client";

import { useState } from 'react';

interface AddressInputProps {
  onScan: (input: string) => void;
  loading: boolean;
  error: string | null;
  resultCount?: number;
}

export default function AddressInput({ onScan, loading, error, resultCount }: AddressInputProps) {
  const [input, setInput] = useState('');

  const handleScan = () => {
    if (!input.trim() || loading) return;
    onScan(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleScan();
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <label
          htmlFor="wallet-input"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Wallet Addresses
        </label>
        <textarea
          id="wallet-input"
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={
            'Paste wallet addresses here... (G... for Classic, C... for Contract accounts)\nYou can paste multiple addresses or mixed text — we\'ll extract them automatically.'
          }
          className="w-full resize-none rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
        />

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {resultCount !== undefined && resultCount > 0
              ? `${resultCount} wallet${resultCount !== 1 ? 's' : ''} found`
              : 'Supports Classic (G...) and Contract (C...) addresses · Ctrl+Enter to scan'}
          </p>
          <button
            type="button"
            onClick={handleScan}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Scan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
