import { supabase } from './client';

/**
 * Upsert a user profile identified by their Stellar public key.
 * Called after a successful Freighter connection.
 */
export async function upsertProfile(publicKey: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ public_key: publicKey }, { onConflict: 'public_key' });

  if (error) {
    console.error('Failed to upsert profile:', error.message);
  }
}

/**
 * Check if a profile exists for the given public key.
 */
export async function getProfile(publicKey: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('public_key, created_at')
    .eq('public_key', publicKey)
    .single();

  if (error) return null;
  return data;
}
