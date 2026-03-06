// Parsed address from bulk input
export interface ParsedAddress {
  address: string;
  type: 'classic' | 'contract';
}

// Stellar wallet data fetched from network
export interface WalletData {
  address: string;
  type: 'classic' | 'contract';
  nativeBalance: string;
  nativeBalanceUsd: number;
  tokens: TokenBalance[];
  nfts: NftItem[];
  isValid: boolean;
  lastUpdated: Date;
}

export interface TokenBalance {
  code: string;
  issuer: string;
  balance: string;
  balanceUsd: number | null;
}

export interface NftItem {
  code: string;
  issuer: string;
  metadata: Record<string, unknown> | null;
  imageUrl: string | null;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'create_account' | 'path_payment' | 'manage_offer' | 'other';
  amount: string;
  asset: string;
  from: string;
  to: string;
  timestamp: Date;
  successful: boolean;
  memo: string | null;
}

// Supabase stored user data
export interface UserProfile {
  publicKey: string;
  createdAt: Date;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedWallet {
  id: string;
  watchlistId: string;
  address: string;
  nickname: string | null;
  addedAt: Date;
}
