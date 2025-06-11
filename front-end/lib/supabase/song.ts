import { supabase } from '@/lib/supabase';
import { LocalSong, SongRow } from '@/types/song';
import { getCurrentUserId } from './shared';


export async function fetchSongs() {
  return supabase
    .from('songs')
    .select('*');
}

export async function fetchSongsByArtist(artistId: string) {
  return supabase
    .from('songs')
    .select('*, artist:artists(id, name)')
    .eq('artist_id', artistId);
}

export async function insertSong(song: LocalSong) {
  const userId = await getCurrentUserId();
  return supabase
    .from('songs')
    .insert({ ...song, created_by: userId })
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
