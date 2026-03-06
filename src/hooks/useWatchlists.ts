'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Watchlist, SavedWallet } from '@/types';
import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from '@/lib/supabase/watchlists';
import {
  getWalletsByWatchlist,
  addWallet,
  updateWalletNickname,
  removeWallet,
} from '@/lib/supabase/wallets';

export function useWatchlists(publicKey: string | null) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWatchlists = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlists(key);
      setWatchlists(data);
      // Auto-select first watchlist
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load watchlists.');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  const loadWallets = useCallback(async (watchlistId: string) => {
    setWalletsLoading(true);
    try {
      const data = await getWalletsByWatchlist(watchlistId);
      setWallets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load wallets.');
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  // Load watchlists whenever publicKey changes
  useEffect(() => {
    if (!publicKey) {
      setWatchlists([]);
      setSelectedId(null);
      setWallets([]);
      return;
    }
    loadWatchlists(publicKey);
  }, [publicKey, loadWatchlists]);

  // Load wallets when selected watchlist changes
  useEffect(() => {
    if (!selectedId) {
      setWallets([]);
      return;
    }
    loadWallets(selectedId);
  }, [selectedId, loadWallets]);



  const createList = useCallback(
    async (name: string) => {
      if (!publicKey) return;
      // Optimistic insert
      const temp: Watchlist = {
        id: `temp-${Date.now()}`,
        userId: publicKey,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setWatchlists((prev) => [...prev, temp]);
      try {
        const created = await createWatchlist(publicKey, name);
        setWatchlists((prev) =>
          prev.map((w) => (w.id === temp.id ? created : w))
        );
        setSelectedId(created.id);
      } catch (err: unknown) {
        // Rollback
        setWatchlists((prev) => prev.filter((w) => w.id !== temp.id));
        setError(err instanceof Error ? err.message : 'Failed to create watchlist.');
      }
    },
    [publicKey]
  );

  const renameList = useCallback(async (id: string, name: string) => {
    const prev = watchlists.find((w) => w.id === id);
    // Optimistic update
    setWatchlists((list) => list.map((w) => (w.id === id ? { ...w, name } : w)));
    try {
      await updateWatchlist(id, name);
    } catch (err: unknown) {
      // Rollback
      if (prev) {
        setWatchlists((list) =>
          list.map((w) => (w.id === id ? prev : w))
        );
      }
      setError(err instanceof Error ? err.message : 'Failed to rename watchlist.');
    }
  }, [watchlists]);

  const deleteList = useCallback(
    async (id: string) => {
      const prev = [...watchlists];
      setWatchlists((list) => list.filter((w) => w.id !== id));
      if (selectedId === id) {
        const remaining = prev.filter((w) => w.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
      try {
        await deleteWatchlist(id);
      } catch (err: unknown) {
        setWatchlists(prev);
        setError(err instanceof Error ? err.message : 'Failed to delete watchlist.');
      }
    },
    [watchlists, selectedId]
  );

  const addWalletToList = useCallback(
    async (address: string, nickname?: string, watchlistId?: string) => {
      const targetId = watchlistId ?? selectedId;
      if (!targetId) return;
      const temp: SavedWallet = {
        id: `temp-${Date.now()}`,
        watchlistId: targetId,
        address,
        nickname: nickname ?? null,
        addedAt: new Date(),
      };
      if (targetId === selectedId) {
        setWallets((prev) => [...prev, temp]);
      }
      try {
        const saved = await addWallet(targetId, address, nickname);
        if (targetId === selectedId) {
          setWallets((prev) =>
            prev.map((w) => (w.id === temp.id ? saved : w))
          );
        }
      } catch (err: unknown) {
        if (targetId === selectedId) {
          setWallets((prev) => prev.filter((w) => w.id !== temp.id));
        }
        setError(err instanceof Error ? err.message : 'Failed to add wallet.');
      }
    },
    [selectedId]
  );

  const renameWalletInList = useCallback(
    async (id: string, nickname: string | null) => {
      const prev = wallets.find((w) => w.id === id);
      setWallets((list) =>
        list.map((w) => (w.id === id ? { ...w, nickname } : w))
      );
      try {
        await updateWalletNickname(id, nickname);
      } catch (err: unknown) {
        if (prev) setWallets((list) => list.map((w) => (w.id === id ? prev : w)));
        setError(err instanceof Error ? err.message : 'Failed to rename wallet.');
      }
    },
    [wallets]
  );

  const removeWalletFromList = useCallback(
    async (id: string) => {
      const prev = [...wallets];
      setWallets((list) => list.filter((w) => w.id !== id));
      try {
        await removeWallet(id);
      } catch (err: unknown) {
        setWallets(prev);
        setError(err instanceof Error ? err.message : 'Failed to remove wallet.');
      }
    },
    [wallets]
  );

  // Check if an address is already saved in any watchlist of this user
  const isAddressSaved = useCallback(
    (address: string) => wallets.some((w) => w.address === address),
    [wallets]
  );

  return {
    watchlists,
    selectedId,
    setSelectedId,
    wallets,
    loading,
    walletsLoading,
    error,
    createList,
    renameList,
    deleteList,
    addWalletToList,
    renameWalletInList,
    removeWalletFromList,
    isAddressSaved,
  };
}
