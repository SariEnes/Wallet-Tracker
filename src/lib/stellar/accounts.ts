import * as StellarSdk from '@stellar/stellar-sdk';
import { horizon } from './client';
import type { ParsedAddress, WalletData, TokenBalance } from '@/types';

/**
 * Fetch a classic Stellar account (G...) from Horizon.
 * Returns balances and trustline tokens.
 */
export async function fetchClassicAccount(address: string): Promise<WalletData> {
  const account = await horizon.loadAccount(address);

  const nativeBalance =
    account.balances.find(
      (b): b is StellarSdk.Horizon.HorizonApi.BalanceLineNative =>
        b.asset_type === 'native'
    )?.balance ?? '0';

  const tokens: TokenBalance[] = account.balances
    .filter(
      (b): b is StellarSdk.Horizon.HorizonApi.BalanceLineAsset =>
        b.asset_type === 'credit_alphanum4' || b.asset_type === 'credit_alphanum12'
    )
    .map((b) => ({
      code: b.asset_code,
      issuer: b.asset_issuer,
      balance: b.balance,
      balanceUsd: null,
    }));

  return {
    address,
    type: 'classic',
    nativeBalance,
    nativeBalanceUsd: 0,
    tokens,
    nfts: [],
    isValid: true,
    lastUpdated: new Date(),
  };
}

/**
 * Fallback for contract (C...) addresses.
 * Full Soroban contract data fetching is implemented in a later phase.
 */
async function fetchContractAccount(address: string): Promise<WalletData> {
  return {
    address,
    type: 'contract',
    nativeBalance: '0',
    nativeBalanceUsd: 0,
    tokens: [],
    nfts: [],
    isValid: true,
    lastUpdated: new Date(),
  };
}

/**
 * Dispatch to the right fetcher based on address type.
 */
export async function fetchWalletData(parsed: ParsedAddress): Promise<WalletData> {
  if (parsed.type === 'classic') {
    return fetchClassicAccount(parsed.address);
  }
  return fetchContractAccount(parsed.address);
}

/**
 * Fetch all wallets in parallel. Failed fetches return an invalid placeholder.
 */
export async function fetchAllWallets(addresses: ParsedAddress[]): Promise<WalletData[]> {
  const results = await Promise.allSettled(
    addresses.map((addr) => fetchWalletData(addr))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    console.error(`Failed to fetch wallet ${addresses[index].address}:`, result.reason);
    return {
      address: addresses[index].address,
      type: addresses[index].type,
      nativeBalance: '0',
      nativeBalanceUsd: 0,
      tokens: [],
      nfts: [],
      isValid: false,
      lastUpdated: new Date(),
    };
  });
}
