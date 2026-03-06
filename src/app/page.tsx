"use client";

import { useState, useCallback, useMemo } from 'react';
import AddressInput from '@/components/wallet/AddressInput';
import WalletGrid from '@/components/wallet/WalletGrid';
import WalletDetail from '@/components/wallet/WalletDetail';
import { useWalletData } from '@/hooks/useWalletData';
import { usePrices } from '@/hooks/usePrices';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlists } from '@/hooks/useWatchlists';
import { formatUsd } from '@/lib/utils/format';
import type { WalletData } from '@/types';
import AddToWatchlist from '@/components/watchlist/AddToWatchlist';

export default function Home() {
  const { wallets, loading, error, scan } = useWalletData();
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);

  const { connected, publicKey } = useAuth();
  const { watchlists, selectedId, createList, addWalletToList } = useWatchlists(publicKey);

  // Collect all unique token codes across wallets for price fetching
  const tokenCodes = useMemo(
    () => [...new Set(wallets.flatMap((w) => w.tokens.map((t) => t.code)))],
    [wallets]
  );

  const { xlmPrice, loading: priceLoading, error: priceError } = usePrices(tokenCodes);

  // Portfolio total: sum of all wallet XLM balances in USD
  const portfolioTotal = useMemo(() => {
    if (xlmPrice === null || wallets.length === 0) return null;
    return wallets
      .filter((w) => w.isValid)
      .reduce((sum, w) => sum + parseFloat(w.nativeBalance) * xlmPrice, 0);
  }, [wallets, xlmPrice]);

  const handleDetail = useCallback((wallet: WalletData) => {
    setSelectedWallet(wallet);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedWallet(null);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          Stellar Wallet Tracker
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Paste one or more Stellar wallet addresses to instantly view balances,
          tokens, NFTs, and transaction history.
        </p>
        <div className="mt-2 flex items-center justify-center gap-3 text-sm text-slate-500">
          <span>Read-only · No wallet connection required · Testnet</span>
          {/* Live XLM price indicator */}
          <span className="text-slate-700">·</span>
          {priceLoading ? (
            <span className="animate-pulse text-slate-600">Loading price…</span>
          ) : priceError ? (
            <span className="text-red-500/70" title={priceError}>Price unavailable</span>
          ) : xlmPrice !== null ? (
            <span className="text-slate-400">
              XLM{' '}
              <span className="font-medium text-slate-300">
                {formatUsd(xlmPrice)}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Address Input */}
      <AddressInput
        onScan={scan}
        loading={loading}
        error={error}
        resultCount={wallets.length > 0 ? wallets.length : undefined}
      />

      {/* Portfolio total bar */}
      {portfolioTotal !== null && wallets.length > 0 && (
        <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-slate-700/50 bg-slate-800/50 px-5 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Total portfolio value ({wallets.filter((w) => w.isValid).length} wallets)
            </span>
            <div className="flex items-center gap-4">
              {connected && (
                <AddToWatchlist
                  wallets={wallets}
                  watchlists={watchlists}
                  selectedWatchlistId={selectedId}
                  onAdd={addWalletToList}
                  onCreate={createList}
                />
              )}
              <span className="text-xl font-bold text-slate-100">
                {formatUsd(portfolioTotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Grid */}
      <WalletGrid
        wallets={wallets}
        loading={loading}
        skeletonCount={3}
        onDetail={handleDetail}
        xlmPrice={xlmPrice}
      />

      {/* Empty state */}
      {wallets.length === 0 && !loading && !error && (
        <div className="mt-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="mx-auto mb-3 h-16 w-16 text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18 0H3"
            />
          </svg>
          <p className="text-sm text-slate-600">
            Paste wallet addresses above and click{' '}
            <strong className="text-slate-500">Scan</strong> to see results
          </p>
        </div>
      )}

      {/* Detail panel */}
      <WalletDetail
        wallet={selectedWallet}
        onClose={handleClose}
        xlmPrice={xlmPrice}
      />
    </div>
  );
}
