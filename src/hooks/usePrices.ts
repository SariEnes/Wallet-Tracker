"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { getXlmPrice, getTokenPrices } from '@/lib/pricing/coingecko';
import { PRICE_CACHE_TTL_MS } from '@/lib/utils/constants';

interface UsePricesReturn {
  xlmPrice: number | null;
  tokenPrices: Record<string, number>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePrices(tokenCodes: string[] = []): UsePricesReturn {
  const [xlmPrice, setXlmPrice] = useState<number | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      const [xlm, tokens] = await Promise.all([
        getXlmPrice(),
        tokenCodes.length > 0 ? getTokenPrices(tokenCodes) : Promise.resolve({}),
      ]);
      setXlmPrice(xlm);
      setTokenPrices(tokens);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch prices.'
      );
    } finally {
      setLoading(false);
    }
  }, [tokenCodes.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPrices();

    // Auto-refresh every 60 seconds
    intervalRef.current = setInterval(fetchPrices, PRICE_CACHE_TTL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  return {
    xlmPrice,
    tokenPrices,
    loading,
    error,
    refresh: fetchPrices,
  };
}
