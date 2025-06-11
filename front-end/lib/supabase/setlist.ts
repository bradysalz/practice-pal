import { supabase } from '@/lib/supabase';
import { SetlistInsert, SetlistItemInsert, SetlistItemRow, SetlistUpdate } from '@/types/setlist';
import { getCurrentUserId } from './shared';

const SETLIST_WITH_ITEMS_QUERY = `
  *,
  setlist_items (
    *,
    song:song_id (
      *,
      artist:artist_id (*)
    ),
    exercise:exercise_id (
      *,
      section:section_id (
        *,
        book:book_id (*)
      )
    )
  )
`;

export async function fetchSetlists() {
  return supabase
    .from('setlists_with_items')
    .select(SETLIST_WITH_ITEMS_QUERY)
    .order('created_at', { ascending: false });
}

export async function fetchSetlistById(id: string) {
  return supabase
    .from('setlists_with_items')
    .select(SETLIST_WITH_ITEMS_QUERY)
    .eq('id', id)
    .single();
}

export async function insertSetlist(setlist: SetlistInsert) {
  return supabase.from('setlists').insert(setlist);
}

export async function updateSetlist(id: string, updates: SetlistUpdate) {
  return supabase.from('setlists').update(updates).eq('id', id);
}

export async function deleteSetlist(id: string) {
  return supabase.from('setlists').delete().eq('id', id);
}

export async function deleteSetlistItems(setlistId: string) {
  return supabase.from('setlist_items').delete().eq('setlist_id', setlistId);
}

export async function insertSetlistItems(items: SetlistItemInsert[]) {
  return supabase.from('setlist_items').insert(items);
}

export async function fetchSetlistItems(setlistId: string) {
  return supabase
    .from('setlist_items')
    .select('*')
    .eq('setlist_id', setlistId)
    .order('position', { ascending: true });
}

export async function insertSetlistItem(item: SetlistItemRow) {
  return supabase.from('setlist_items').insert(item).select().single();
}

export { getCurrentUserId };
