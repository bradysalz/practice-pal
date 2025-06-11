import { supabase } from '@/lib/supabase';
import { ArtistRow, LocalArtist } from '@/types/artist';
import { getCurrentUserId } from './shared';

export async function fetchArtists() {
  return supabase.from('artists').select('*').order('name', { ascending: true });
}

export async function insertArtist(artist: LocalArtist) {
  const userId = await getCurrentUserId();

  return supabase
    .from('artists')
    .insert({ ...artist, created_by: userId })
    .select()
    .single();
}

export async function updateArtist(id: string, updates: Partial<ArtistRow>) {
  return supabase.from('artists').update(updates).eq('id', id);
}

export async function deleteArtist(id: string) {
  return supabase.from('artists').delete().eq('id', id);
}
