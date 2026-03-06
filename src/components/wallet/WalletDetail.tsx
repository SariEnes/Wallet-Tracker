"use client";

import { useState, useEffect, useCallback } from 'react';
import type { WalletData } from '@/types';
import { formatXlm, formatUsd } from '@/lib/utils/format';
import TokenList from './TokenList';
import NftList from './NftList';
import TransactionList from './TransactionList';

type Tab = 'tokens' | 'nfts' | 'transactions';

interface WalletDetailProps {
  wallet: WalletData | null;
  onClose: () => void;
  xlmPrice: number | null;
}

export default function WalletDetail({ wallet, onClose, xlmPrice }: WalletDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tokens');
  const [copied, setCopied] = useState(false);
  const [prevAddress, setPrevAddress] = useState<string | undefined>(wallet?.address);

  // Reset tab when wallet changes
  if (wallet?.address !== prevAddress) {
    setPrevAddress(wallet?.address);
    setActiveTab('tokens');
  }

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (wallet) {
      document.addEventListener('keydown', handleKey);
      // Prevent body scroll while panel is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [wallet, onClose]);

  const copyAddress = useCallback(async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wallet]);

  const isOpen = wallet !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wallet details"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {wallet && (
          <>
            {/* Header */}
            <div className="border-b border-slate-700 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${wallet.type === 'classic'
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-violet-500/20 text-violet-400'
                        }`}
                    >
                      {wallet.type === 'classic' ? 'Classic' : 'Contract'}
                    </span>
                  </div>
                  {/* Full address with copy */}
                  <button
                    type="button"
                    onClick={copyAddress}
                    title="Click to copy address"
                    className="mt-1.5 flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span className="break-all">{wallet.address}</span>
                    <span className="shrink-0">
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
                          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm1.75 2.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
                  aria-label="Close panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>

              {/* Balance summary */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-100">
                  {formatXlm(wallet.nativeBalance)} XLM
                </span>
                <span className="text-sm text-slate-500">
                  {xlmPrice !== null
                    ? formatUsd(parseFloat(wallet.nativeBalance) * xlmPrice)
                    : '— USD'}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700 px-5">
              <nav className="-mb-px flex gap-6">
                {(['tokens', 'nfts', 'transactions'] as Tab[]).map((tab) => {
                  const labels: Record<Tab, string> = {
                    tokens: `Tokens${wallet.tokens.length > 0 ? ` (${wallet.tokens.length})` : ''}`,
                    nfts: `NFTs${wallet.nfts.length > 0 ? ` (${wallet.nfts.length})` : ''}`,
                    transactions: 'Transactions',
                  };
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 py-3 text-sm font-medium transition-colors ${activeTab === tab
                          ? 'border-sky-500 text-sky-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === 'tokens' && <TokenList tokens={wallet.tokens} />}
              {activeTab === 'nfts' && <NftList nfts={wallet.nfts} />}
              {activeTab === 'transactions' && (
                <TransactionList address={wallet.address} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
