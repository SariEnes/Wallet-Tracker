import * as StellarSdk from '@stellar/stellar-sdk';

export const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_TESTNET_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
export const FRIENDBOT_URL = 'https://friendbot.stellar.org';

export const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';
export const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || HORIZON_TESTNET_URL;
export const SOROBAN_RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || SOROBAN_TESTNET_URL;

export const MAX_TRANSACTIONS_PER_PAGE = 20;
export const PRICE_CACHE_TTL_MS = 60_000; // 60 seconds
