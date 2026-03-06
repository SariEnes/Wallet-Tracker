'use client';

import { useState } from 'react';
import type { Watchlist } from '@/types';

interface Props {
  watchlists: Watchlist[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function WatchlistSidebar({
  watchlists,
  selectedId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName('');
    setCreating(false);
  }

  function startEdit(w: Watchlist) {
    setEditingId(w.id);
    setEditName(w.name);
  }

  function handleRename(e: React.FormEvent, id: string) {
    e.preventDefault();
    const name = editName.trim();
    if (name) onRename(id, name);
    setEditingId(null);
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Watchlists
        </h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          title="New watchlist"
          className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </button>
      </div>

      {/* New watchlist form */}
      {creating && (
        <form onSubmit={handleCreate} className="flex gap-1">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Watchlist name"
            className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-2 py-1.5 text-sm text-white hover:bg-sky-500"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="rounded-lg px-2 py-1.5 text-sm text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </form>
      )}

      {/* Watchlist list */}
      <ul className="space-y-1">
        {watchlists.map((w) => (
          <li key={w.id}>
            {editingId === w.id ? (
              <form onSubmit={(e) => handleRename(e, w.id)} className="flex gap-1">
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="rounded px-2 py-1 text-xs text-sky-400 hover:text-sky-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded px-1 py-1 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div
                className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedId === w.id
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
                onClick={() => onSelect(w.id)}
              >
                <span className="truncate">{w.name}</span>
                <div className="ml-2 hidden shrink-0 items-center gap-1 group-hover:flex">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); startEdit(w); }}
                    title="Rename"
                    className="rounded p-0.5 text-slate-400 hover:text-slate-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474ZM4.75 3.5A2.25 2.25 0 0 0 2.5 5.75v5.5A2.25 2.25 0 0 0 4.75 13.5h5.5A2.25 2.25 0 0 0 12.5 11.25V9a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-5.5a.75.75 0 0 1 .75-.75H7a.75.75 0 0 0 0-1.5H4.75Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${w.name}"?`)) onDelete(w.id);
                    }}
                    title="Delete"
                    className="rounded p-0.5 text-slate-400 hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {watchlists.length === 0 && !creating && (
        <p className="text-xs text-slate-600">
          No watchlists yet. Click + to create one.
        </p>
      )}
    </aside>
  );
}
