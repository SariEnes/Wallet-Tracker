import { supabase } from './client';
import type { Watchlist } from '@/types';

function mapRow(row: Record<string, unknown>): Watchlist {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getWatchlists(publicKey: string): Promise<Watchlist[]> {
  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', publicKey)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function createWatchlist(
  publicKey: string,
  name: string
): Promise<Watchlist> {
  const { data, error } = await supabase
    .from('watchlists')
    .insert({ user_id: publicKey, name })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateWatchlist(
  id: string,
  name: string
): Promise<void> {
  const { error } = await supabase
    .from('watchlists')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteWatchlist(id: string): Promise<void> {
  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
