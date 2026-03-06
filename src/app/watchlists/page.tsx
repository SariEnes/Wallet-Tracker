'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlists } from '@/hooks/useWatchlists';
import WatchlistSidebar from '@/components/watchlist/WatchlistSidebar';
import WatchlistPanel from '@/components/watchlist/WatchlistPanel';

export default function WatchlistsPage() {
    const router = useRouter();
    const { connected, loading: authLoading, publicKey } = useAuth();

    const {
        watchlists,
        selectedId,
        setSelectedId,
        wallets,
        loading: watchlistsLoading,
        walletsLoading,
        createList,
        renameList,
        deleteList,
        renameWalletInList,
        removeWalletFromList
    } = useWatchlists(publicKey);

    const selectedWatchlist = watchlists.find(w => w.id === selectedId) || null;

    useEffect(() => {
        if (!authLoading && !connected) {
            router.replace('/');
        }
    }, [authLoading, connected, router]);

    if (authLoading || (connected && watchlistsLoading && watchlists.length === 0)) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            </div>
        );
    }

    if (!connected) {
        return null; // Will redirect
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">
                    Your Watchlists
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Organize your saved wallets and keep track of their balances.
                </p>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
                {/* Sidebar */}
                <WatchlistSidebar
                    watchlists={watchlists}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onCreate={createList}
                    onRename={renameList}
                    onDelete={deleteList}
                />

                {/* Main Panel */}
                <div className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/20 p-6">
                    <WatchlistPanel
                        watchlist={selectedWatchlist}
                        wallets={wallets}
                        loading={walletsLoading}
                        onRemove={removeWalletFromList}
                        onRename={renameWalletInList}
                    />
                </div>
            </div>
        </div>
    );
}
