export default function WalletCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-700" />
      </div>
      {/* Balance */}
      <div className="mb-1 h-8 w-40 animate-pulse rounded bg-slate-700" />
      <div className="mb-4 h-4 w-20 animate-pulse rounded bg-slate-700" />
      {/* Token summary */}
      <div className="mb-4 h-4 w-24 animate-pulse rounded bg-slate-700" />
      {/* Button */}
      <div className="mt-auto h-9 w-full animate-pulse rounded-lg bg-slate-700" />
    </div>
  );
}
