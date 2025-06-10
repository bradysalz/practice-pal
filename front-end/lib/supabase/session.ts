import { supabase } from '@/lib/supabase';
import { SessionInsert } from '@/types/session';
import { Database } from '@/types/supabase';

export type SessionItemRow = Database['public']['Tables']['session_items']['Row'];
export type SessionItemInsert = Database['public']['Tables']['session_items']['Insert'];
export type InputLocalSessionItem = Omit<SessionItemInsert, 'id' | 'created_at' | 'updated_at'> & {
  session_id: string;
  tempo: number;
};

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
  return supabase
    .from('sessions_with_items')
    .select('*')
    .order('created_at', { ascending: false });
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

export async function insertSession(sessionInsert: SessionInsert) {
  return supabase
    .from('sessions')
    .insert(sessionInsert);
}

export async function insertSessionItems(items: SessionItemInsert[]) {
  return supabase
    .from('session_items')
    .insert(items);
}

export async function deleteSession(sessionId: string) {
  return supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);
}

export async function fetchSessionItemsBySession(sessionId: string) {
  return supabase
    .from('session_items')
    .select('*')
    .eq('session_id', sessionId);
}

export async function fetchSessionItemsByExercise(exerciseId: string) {
  return supabase
    .from('session_items')
    .select('*')
    .eq('exercise_id', exerciseId);
}

export async function fetchSessionItemsBySong(songId: string) {
  return supabase
    .from('session_items')
    .select('*')
    .eq('song_id', songId);
}

export async function insertSessionItem(item: Omit<SessionItemRow, 'id'>) {
  return supabase
    .from('session_items')
    .insert(item)
    .select()
    .single();
}

export async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}
