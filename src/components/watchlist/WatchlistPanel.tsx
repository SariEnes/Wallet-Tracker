'use client';

import { useState } from 'react';
import type { SavedWallet, Watchlist } from '@/types';
import { formatAddress } from '@/lib/utils/format';

interface Props {
  watchlist: Watchlist | null;
  wallets: SavedWallet[];
  loading: boolean;
  onRemove: (id: string) => void;
  onRename: (id: string, nickname: string | null) => void;
}

export default function WatchlistPanel({
  watchlist,
  wallets,
  loading,
  onRemove,
  onRename,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNick, setEditNick] = useState('');

  if (!watchlist) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-600">
        Select or create a watchlist
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-800/50" />
        ))}
      </div>
    );
  }

  function startEdit(w: SavedWallet) {
    setEditingId(w.id);
    setEditNick(w.nickname ?? '');
  }

  function handleSave(e: React.FormEvent, id: string) {
    e.preventDefault();
    onRename(id, editNick.trim() || null);
    setEditingId(null);
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">{watchlist.name}</h2>
        <span className="text-sm text-slate-500">{wallets.length} wallet{wallets.length !== 1 ? 's' : ''}</span>
      </div>

      {wallets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 py-12 text-center">
          <p className="text-sm text-slate-600">No wallets in this watchlist yet.</p>
          <p className="mt-1 text-xs text-slate-700">
            Go to the home page and scan wallets to save them here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {wallets.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3"
            >
              <div className="min-w-0">
                {editingId === w.id ? (
                  <form onSubmit={(e) => handleSave(e, w.id)} className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editNick}
                      onChange={(e) => setEditNick(e.target.value)}
                      placeholder="Nickname (optional)"
                      className="rounded border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button type="submit" className="text-xs text-sky-400 hover:text-sky-300">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-xs text-slate-500 hover:text-slate-300">Cancel</button>
                  </form>
                ) : (
                  <>
                    {w.nickname && (
                      <p className="text-sm font-medium text-slate-200">{w.nickname}</p>
                    )}
                    <p className={`font-mono text-xs ${w.nickname ? 'text-slate-500' : 'text-slate-300'}`}>
                      {formatAddress(w.address)}
                    </p>
                  </>
                )}
              </div>

              {editingId !== w.id && (
                <div className="ml-4 flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(w)}
                    title="Edit nickname"
                    className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474ZM4.75 3.5A2.25 2.25 0 0 0 2.5 5.75v5.5A2.25 2.25 0 0 0 4.75 13.5h5.5A2.25 2.25 0 0 0 12.5 11.25V9a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-5.5a.75.75 0 0 1 .75-.75H7a.75.75 0 0 0 0-1.5H4.75Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Remove this wallet from the watchlist?')) onRemove(w.id);
                    }}
                    title="Remove"
                    className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
