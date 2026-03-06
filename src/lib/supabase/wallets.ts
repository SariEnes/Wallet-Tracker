import { supabase } from './client';
import type { SavedWallet } from '@/types';

function mapRow(row: Record<string, unknown>): SavedWallet {
  return {
    id: row.id as string,
    watchlistId: row.watchlist_id as string,
    address: row.address as string,
    nickname: (row.nickname as string | null) ?? null,
    addedAt: new Date(row.added_at as string),
  };
}

export async function getWalletsByWatchlist(
  watchlistId: string
): Promise<SavedWallet[]> {
  const { data, error } = await supabase
    .from('saved_wallets')
    .select('*')
    .eq('watchlist_id', watchlistId)
    .order('added_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function addWallet(
  watchlistId: string,
  address: string,
  nickname?: string
): Promise<SavedWallet> {
  const { data, error } = await supabase
    .from('saved_wallets')
    .upsert(
      { watchlist_id: watchlistId, address, nickname: nickname ?? null },
      { onConflict: 'watchlist_id,address' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateWalletNickname(
  id: string,
  nickname: string | null
): Promise<void> {
  const { error } = await supabase
    .from('saved_wallets')
    .update({ nickname })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function removeWallet(id: string): Promise<void> {
  const { error } = await supabase
    .from('saved_wallets')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
