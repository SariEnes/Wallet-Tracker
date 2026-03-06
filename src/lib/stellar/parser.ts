import type { ParsedAddress } from '@/types';

/**
 * Extract all valid Stellar addresses from arbitrary text input.
 * Supports Classic (G..., 56 chars) and Contract (C..., 56 chars) addresses.
 * Deduplicates results.
 */
export function parseAddresses(input: string): ParsedAddress[] {
  const classicRegex = /G[A-Z2-7]{55}/g;
  const contractRegex = /C[A-Z2-7]{55}/g;

  const classics = (input.match(classicRegex) || []).map((address) => ({
    address,
    type: 'classic' as const,
  }));

  const contracts = (input.match(contractRegex) || []).map((address) => ({
    address,
    type: 'contract' as const,
  }));

  const seen = new Set<string>();
  return [...classics, ...contracts].filter((item) => {
    if (seen.has(item.address)) return false;
    seen.add(item.address);
    return true;
  });
}
