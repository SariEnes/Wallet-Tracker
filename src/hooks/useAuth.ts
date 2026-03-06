'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
} from '@stellar/freighter-api';
import { upsertProfile } from '@/lib/supabase/auth';

const STORAGE_KEY = 'stellar_insight_pubkey';

export interface AuthState {
  publicKey: string | null;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    publicKey: null,
    connected: false,
    loading: true,
    error: null,
  });

  const restoreSession = useCallback(async () => {
    // Check localStorage first for fast initial render
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;

    if (!stored) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    try {
      // Verify Freighter is still connected and allowed
      const { isConnected: freighterInstalled } = await isConnected();
      if (!freighterInstalled) {
        localStorage.removeItem(STORAGE_KEY);
        setState({ publicKey: null, connected: false, loading: false, error: null });
        return;
      }

      const { isAllowed: allowed } = await isAllowed();
      if (!allowed) {
        localStorage.removeItem(STORAGE_KEY);
        setState({ publicKey: null, connected: false, loading: false, error: null });
        return;
      }

      // Get address to confirm it matches what we stored
      const { address, error } = await getAddress();
      if (error || !address) {
        localStorage.removeItem(STORAGE_KEY);
        setState({ publicKey: null, connected: false, loading: false, error: null });
        return;
      }

      // Address may have changed (e.g. user switched account in Freighter)
      if (address !== stored) {
        localStorage.setItem(STORAGE_KEY, address);
      }

      setState({ publicKey: address, connected: true, loading: false, error: null });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setState({ publicKey: null, connected: false, loading: false, error: null });
    }
  }, []);

  // On mount: try to restore session silently
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    restoreSession();
  }, [restoreSession]);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { isConnected: freighterInstalled } = await isConnected();
      if (!freighterInstalled) {
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Freighter wallet not installed. Please install the Freighter browser extension.',
        }));
        return;
      }

      // requestAccess opens the Freighter popup and returns the address
      const { address, error } = await requestAccess();
      if (error || !address) {
        setState((s) => ({
          ...s,
          loading: false,
          error: error?.message || 'Access denied or no address returned.',
        }));
        return;
      }

      localStorage.setItem(STORAGE_KEY, address);

      // Fire-and-forget: upsert profile in Supabase
      upsertProfile(address).catch(console.error);

      setState({ publicKey: address, connected: true, loading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ publicKey: null, connected: false, loading: false, error: null });
  }, []);

  return { ...state, connect, disconnect };
}
