import type { NftItem } from '@/types';

interface NftListProps {
  nfts: NftItem[];
}

export default function NftList({ nfts }: NftListProps) {
  if (nfts.length === 0) {
    return (
      <div className="py-10 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="mx-auto mb-3 h-10 w-10 text-slate-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p className="text-sm text-slate-500">No NFTs found for this wallet.</p>
        <p className="mt-1 text-xs text-slate-600">
          NFT detection follows the SEP-0050 standard (Soroban).
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {nfts.map((nft) => (
        <div
          key={`${nft.code}-${nft.issuer}`}
          className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900"
        >
          {nft.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nft.imageUrl}
              alt={nft.code}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-slate-800">
              <span className="text-2xl font-bold text-slate-600">{nft.code.slice(0, 2)}</span>
            </div>
          )}
          <div className="p-2">
            <p className="truncate text-xs font-semibold text-slate-300">{nft.code}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
