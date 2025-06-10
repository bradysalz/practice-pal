import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type ArtistRow = Database['public']['Tables']['artists']['Row'];
export type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
export type InputArtist = Omit<ArtistInsert, 'id' | 'created_at' | 'updated_at'>;

export async function fetchArtists() {
  return supabase.from('artists').select('*');
}

export async function insertArtist(artist: ArtistRow) {
  return supabase
    .from('artists')
    .insert(artist)
    .select()
    .single();
}

export async function updateArtist(id: string, updates: Partial<ArtistRow>) {
  return supabase
    .from('artists')
    .update(updates)
    .eq('id', id);
}

export async function deleteArtist(id: string) {
  return supabase
    .from('artists')
    .delete()
    .eq('id', id);
}
