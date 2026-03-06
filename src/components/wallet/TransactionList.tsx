"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchOperations } from '@/lib/stellar/transactions';
import { formatAddress, formatNumber } from '@/lib/utils/format';
import type { Transaction } from '@/types';

interface TransactionListProps {
  address: string;
}

const TYPE_LABELS: Record<Transaction['type'], string> = {
  payment: 'Payment',
  create_account: 'Create Account',
  path_payment: 'Path Payment',
  manage_offer: 'Manage Offer',
  other: 'Operation',
};

const TYPE_COLORS: Record<Transaction['type'], string> = {
  payment: 'bg-sky-500/20 text-sky-400',
  create_account: 'bg-emerald-500/20 text-emerald-400',
  path_payment: 'bg-violet-500/20 text-violet-400',
  manage_offer: 'bg-amber-500/20 text-amber-400',
  other: 'bg-slate-500/20 text-slate-400',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function TransactionList({ address }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await fetchOperations(address, 20);
      setTransactions(page.transactions);
      setNextCursor(page.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await fetchOperations(address, 20, nextCursor);
      setTransactions((prev) => [...prev, ...page.transactions]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more transactions.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-700/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-sm text-red-400">{error}</div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        No transactions found for this wallet.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[tx.type]}`}
                >
                  {TYPE_LABELS[tx.type]}
                </span>
                {tx.from && (
                  <span className="truncate font-mono text-xs text-slate-500">
                    {formatAddress(tx.from)}
                    {tx.to && ` → ${formatAddress(tx.to)}`}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                {formatDate(tx.timestamp)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-slate-300">
                {formatNumber(parseFloat(tx.amount) || 0, 4)}
              </p>
              <p className="text-xs text-slate-500">{tx.asset}</p>
            </div>
          </div>
        ))}
      </div>

      {nextCursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 w-full rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-sky-500/50 hover:text-sky-400 disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
