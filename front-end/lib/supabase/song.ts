import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type SongRow = Database['public']['Tables']['songs']['Row'];
export type SongInsert = Database['public']['Tables']['songs']['Insert'];
export type InputLocalSong = Omit<SongInsert, 'id' | 'created_at' | 'updated_at'>;

export async function fetchSongs() {
  return supabase.from('songs').select('*');
}

export async function insertSong(song: SongRow) {
  return supabase
    .from('songs')
    .insert(song)
    .select()
    .single();
}

export async function updateSong(id: string, updates: Partial<SongRow>) {
  return supabase
    .from('songs')
    .update(updates)
    .eq('id', id);
}

export async function deleteSong(id: string) {
  return supabase
    .from('songs')
    .delete()
    .eq('id', id);
}
