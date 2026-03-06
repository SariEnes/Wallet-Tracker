"use client";

import type { WalletData } from '@/types';
import { formatAddress, formatXlm, formatUsd } from '@/lib/utils/format';

interface WalletCardProps {
  wallet: WalletData;
  onDetail: (wallet: WalletData) => void;
  xlmPrice: number | null;
}

export default function WalletCard({ wallet, onDetail, xlmPrice }: WalletCardProps) {
  const isClassic = wallet.type === 'classic';
  const usdValue =
    xlmPrice !== null ? parseFloat(wallet.nativeBalance) * xlmPrice : null;

  return (
    <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition-shadow hover:shadow-slate-900/50">
      {/* Header: address + type badge */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-slate-300" title={wallet.address}>
            {formatAddress(wallet.address)}
          </p>
          {!wallet.isValid && (
            <p className="mt-0.5 text-xs text-red-400">Account not found on Testnet</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isClassic
              ? 'bg-sky-500/20 text-sky-400'
              : 'bg-violet-500/20 text-violet-400'
          }`}
        >
          {isClassic ? 'Classic' : 'Contract'}
        </span>
      </div>

      {/* XLM Balance */}
      <div className="mb-3 flex-1">
        {wallet.isValid ? (
          <>
            <p className="text-2xl font-bold text-slate-100">
              {formatXlm(wallet.nativeBalance)} XLM
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              {usdValue !== null ? formatUsd(usdValue) : '— USD'}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-slate-600">—</p>
        )}
      </div>

      {/* Token summary */}
      {wallet.isValid && (
        <div className="mb-4 flex items-center gap-3 text-xs text-slate-500">
          {wallet.tokens.length > 0 ? (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5 text-slate-600"
              >
                <path d="M8 1a2 2 0 0 1 2 2v.5h1.5A1.5 1.5 0 0 1 13 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5V5a1.5 1.5 0 0 1 1.5-1.5H6V3a2 2 0 0 1 2-2Zm0 1a1 1 0 0 0-1 1v.5h2V3a1 1 0 0 0-1-1Z" />
              </svg>
              {wallet.tokens.length} token{wallet.tokens.length !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-slate-600">No tokens</span>
          )}
          {wallet.nfts.length > 0 && (
            <span>{wallet.nfts.length} NFT{wallet.nfts.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Detail button */}
      <button
        type="button"
        onClick={() => onDetail(wallet)}
        disabled={!wallet.isValid}
        className="mt-auto w-full rounded-lg border border-slate-600 bg-slate-900/50 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        View Details
      </button>
    </div>
  );
}
