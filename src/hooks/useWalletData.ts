"use client";

import { useState, useCallback } from 'react';
import { parseAddresses } from '@/lib/stellar/parser';
import { fetchAllWallets } from '@/lib/stellar/accounts';
import type { WalletData, ParsedAddress } from '@/types';

interface UseWalletDataReturn {
  wallets: WalletData[];
  parsedAddresses: ParsedAddress[];
  loading: boolean;
  error: string | null;
  scan: (input: string) => Promise<void>;
  clear: () => void;
}

export function useWalletData(): UseWalletDataReturn {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [parsedAddresses, setParsedAddresses] = useState<ParsedAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (input: string) => {
    setError(null);

    const addresses = parseAddresses(input);
    if (addresses.length === 0) {
      setError('No valid Stellar addresses found. Addresses start with G (Classic) or C (Contract).');
      return;
    }

    setParsedAddresses(addresses);
    setLoading(true);
    setWallets([]);

    try {
      const results = await fetchAllWallets(addresses);
      console.log('[Stellar Insight] Wallet data:', results);
      setWallets(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setWallets([]);
    setParsedAddresses([]);
    setError(null);
  }, []);

  return { wallets, parsedAddresses, loading, error, scan, clear };
}
