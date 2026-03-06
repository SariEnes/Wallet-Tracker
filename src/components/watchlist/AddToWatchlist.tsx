'use client';

import { useState } from 'react';
import type { Watchlist, WalletData } from '@/types';

interface Props {
  wallets: WalletData[];
  watchlists: Watchlist[];
  selectedWatchlistId: string | null;
  onAdd: (address: string, nickname: string | undefined, watchlistId: string) => void;
  onCreate: (name: string) => void;
}

export default function AddToWatchlist({
  wallets,
  watchlists,
  selectedWatchlistId,
  onAdd,
  onCreate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>(selectedWatchlistId ?? '');
  const [newListName, setNewListName] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);
  const [nicknames, setNicknames] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(wallets.filter((w) => w.isValid).map((w) => w.address))
  );

  const validWallets = wallets.filter((w) => w.isValid);

  function toggle(address: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(address)) next.delete(address);
      else next.add(address);
      return next;
    });
  }

  function handleSave() {
    if (!targetId && !creatingNew) return;

    if (creatingNew) {
      const name = newListName.trim() || 'My Watchlist';
      onCreate(name);
      // After creating, the new list will be auto-selected in the hook;
      // here we just close. The user can re-open to assign.
      setCreatingNew(false);
      setOpen(false);
      return;
    }

    for (const address of selected) {
      const nick = nicknames[address]?.trim() || undefined;
      onAdd(address, nick, targetId);
    }
    setOpen(false);
  }

  if (validWallets.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setTargetId(selectedWatchlistId ?? watchlists[0]?.id ?? '');
          setSelected(new Set(validWallets.map((w) => w.address)));
          setNicknames({});
          setCreatingNew(false);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-sky-500/50 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-sky-500/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        Save to Watchlist
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <h3 className="text-base font-semibold text-slate-100">Save to Watchlist</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* Watchlist selector */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Watchlist
                </label>
                {creatingNew ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Watchlist name"
                      className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setCreatingNew(false)}
                      className="text-sm text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {watchlists.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setCreatingNew(true)}
                      className="whitespace-nowrap rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                      + New
                    </button>
                  </div>
                )}
              </div>

              {/* Wallet list with nicknames */}
              {!creatingNew && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    Wallets to save
                  </label>
                  <ul className="max-h-60 space-y-2 overflow-y-auto">
                    {validWallets.map((w) => (
                      <li
                        key={w.address}
                        className={`rounded-lg border px-3 py-2 ${
                          selected.has(w.address)
                            ? 'border-sky-500/50 bg-sky-500/5'
                            : 'border-slate-700 bg-slate-800/30 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected.has(w.address)}
                            onChange={() => toggle(w.address)}
                            className="h-4 w-4 accent-sky-500"
                          />
                          <span className="flex-1 font-mono text-xs text-slate-300">
                            {w.address.slice(0, 6)}...{w.address.slice(-6)}
                          </span>
                        </div>
                        {selected.has(w.address) && (
                          <input
                            type="text"
                            value={nicknames[w.address] ?? ''}
                            onChange={(e) =>
                              setNicknames((n) => ({ ...n, [w.address]: e.target.value }))
                            }
                            placeholder="Nickname (optional)"
                            className="mt-2 w-full rounded border border-slate-600 bg-slate-700/50 px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-700 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!creatingNew && selected.size === 0}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
              >
                {creatingNew ? 'Create Watchlist' : `Save ${selected.size} wallet${selected.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
