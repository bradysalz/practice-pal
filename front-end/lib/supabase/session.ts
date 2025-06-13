import { supabase } from '@/lib/supabase';
import { DraftSession, LocalSessionItem, NewSessionItem } from '@/types/session';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from './shared';

const SESSION_WITH_ITEMS_QUERY = `
  *,
  session_items (
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

export async function fetchSessions() {
  return supabase.from('sessions_with_items').select('*').order('created_at', { ascending: false });
}

export async function fetchRecentSessionsWithItems(limit: number) {
  return supabase
    .from('sessions_with_items')
    .select(SESSION_WITH_ITEMS_QUERY)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function fetchSessionDetail(sessionId: string) {
  return supabase
    .from('sessions_with_items')
    .select(SESSION_WITH_ITEMS_QUERY)
    .eq('id', sessionId)
    .single();
}

export async function insertSession(session: DraftSession) {
  const userId = await getCurrentUserId();
  return supabase.from('sessions').insert({ ...session, created_by: userId });
}

export async function insertSessionItems(items: LocalSessionItem[]) {
  const userId = await getCurrentUserId();
  return supabase
    .from('session_items')
    .insert(items.map((item) => ({ ...item, created_by: userId })));
}

export async function deleteSession(sessionId: string) {
  return supabase.from('sessions').delete().eq('id', sessionId);
}

export async function fetchSessionItemsBySession(sessionId: string) {
  return supabase.from('session_items').select('*').eq('session_id', sessionId);
}

export async function fetchSessionItemsByExercise(exerciseId: string) {
  return supabase.from('session_items').select('*').eq('exercise_id', exerciseId);
}

export async function fetchSessionItemsBySong(songId: string) {
  return supabase.from('session_items').select('*').eq('song_id', songId);
}

export async function insertSessionItem(item: NewSessionItem) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  return supabase
    .from('session_items')
    .insert({ ...item, id, created_by: userId })
    .select()
    .single();
}
