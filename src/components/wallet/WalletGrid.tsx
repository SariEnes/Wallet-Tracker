"use client";

import type { WalletData } from '@/types';
import WalletCard from './WalletCard';
import WalletCardSkeleton from './WalletCardSkeleton';

interface WalletGridProps {
  wallets: WalletData[];
  loading: boolean;
  skeletonCount?: number;
  onDetail: (wallet: WalletData) => void;
  xlmPrice: number | null;
}

export default function WalletGrid({
  wallets,
  loading,
  skeletonCount = 3,
  onDetail,
  xlmPrice,
}: WalletGridProps) {
  if (loading) {
    return (
      <div className="mt-10">
        <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-700" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <WalletCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (wallets.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-sm font-medium text-slate-400">
        {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} found
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.address}
            wallet={wallet}
            onDetail={onDetail}
            xlmPrice={xlmPrice}
          />
        ))}
      </div>
    </div>
  );
}
