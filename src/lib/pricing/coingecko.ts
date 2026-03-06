import { COINGECKO_BASE_URL, PRICE_CACHE_TTL_MS } from '@/lib/utils/constants';

// ---------- In-module cache ----------
interface CacheEntry {
  value: number;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): number | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > PRICE_CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key: string, value: number) {
  cache.set(key, { value, fetchedAt: Date.now() });
}

// ---------- Known Stellar token → CoinGecko ID map ----------
// Only well-known tokens with reliable CoinGecko IDs are mapped.
// Unknown tokens will have balanceUsd = null.
const TOKEN_COINGECKO_IDS: Record<string, string> = {
  USDC: 'usd-coin',
  USDT: 'tether',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  XLM: 'stellar',
  AQUA: 'aquarius',
  yXLM: 'stellar',
  SHX: 'stronghold-token',
};

// ---------- Price fetchers ----------

/**
 * Fetch the current XLM/USD price from CoinGecko.
 * Results are cached for PRICE_CACHE_TTL_MS (60s).
 */
export async function getXlmPrice(): Promise<number> {
  const cacheKey = 'xlm_usd';
  const cached = getCached(cacheKey);
  if (cached !== null) return cached;

  const url = `${COINGECKO_BASE_URL}/simple/price?ids=stellar&vs_currencies=usd`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  const price: number = data?.stellar?.usd;

  if (typeof price !== 'number') {
    throw new Error('Unexpected CoinGecko response format');
  }

  setCached(cacheKey, price);
  return price;
}

/**
 * Batch fetch prices for a list of token codes (e.g. ['USDC', 'ETH']).
 * Returns a map of code → USD price. Unknown tokens are omitted.
 */
export async function getTokenPrices(
  codes: string[]
): Promise<Record<string, number>> {
  const unique = [...new Set(codes)];
  const toFetch: string[] = [];
  const result: Record<string, number> = {};

  for (const code of unique) {
    const id = TOKEN_COINGECKO_IDS[code.toUpperCase()];
    if (!id) continue; // Not in our map — skip
    const cached = getCached(`token_${id}`);
    if (cached !== null) {
      result[code] = cached;
    } else {
      toFetch.push(id);
    }
  }

  if (toFetch.length === 0) return result;

  const ids = toFetch.join(',');
  const url = `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) return result; // Return partial results on error

  const data = await response.json();

  for (const code of unique) {
    const id = TOKEN_COINGECKO_IDS[code.toUpperCase()];
    if (!id) continue;
    const price: number = data?.[id]?.usd;
    if (typeof price === 'number') {
      setCached(`token_${id}`, price);
      result[code] = price;
    }
  }

  return result;
}
