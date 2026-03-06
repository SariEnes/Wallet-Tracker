"use client";

import Link from 'next/link';
import ConnectButton from '@/components/auth/ConnectButton';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { connected } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-white"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm-1 3v2H7v2h4v2H7v2h4v2h2v-2h4v-2h-4v-2h4V9h-4V7h-2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-100">
            Stellar Insight
          </span>
          <span className="hidden rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-medium text-sky-400 sm:inline">
            Testnet
          </span>
        </div>

        {/* Navigation & Connect */}
        <div className="flex items-center gap-6">
          {connected && (
            <Link
              href="/watchlists"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Watchlists
            </Link>
          )}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
