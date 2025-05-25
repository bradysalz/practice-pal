import { supabase } from '@/lib/supabase';
import {
  DraftSession,
  SessionWithCountsRow,
  SessionWithItems
} from '@/types/session';
import { create } from 'zustand';

type SessionsState = {
  sessions: SessionWithCountsRow[];
  sessionsWithItems: SessionWithItems[];
  sessionDetailMap: Record<string, SessionWithItems>;
  insertSession: (draft: DraftSession) => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchSessionDetail: (sessionId: string) => Promise<void>;
  fetchRecentSessionsWithItems: (limit: number) => Promise<void>;
};


export const useSessionsStore = create<SessionsState>((set, get) => ({
  sessions: [],
  sessionsWithItems: [],
  sessionDetailMap: {},

  fetchSessions: async () => {
    const { data, error } = await supabase
      .from('sessions_with_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sessions: data as SessionWithCountsRow[] });
  },

  fetchRecentSessionsWithItems: async (limit) => {
    const { data, error } = await supabase
      .from('sessions_with_items')
      .select(
        `
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
      `
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch sessions with items', error);
      return;
    }

    const map = Object.fromEntries(data.map((s) => [s.id, s]));
    set({
      sessionsWithItems: data,
      sessionDetailMap: map,
    });
  },

  fetchSessionDetail: async (sessionId: string) => {
    const existing = get().sessionDetailMap[sessionId];
    if (existing) return;

    const { data, error } = await supabase
      .from('sessions_with_items')
      .select(
        `
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
    `
      )
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Failed to fetch session detail', error);
      return;
    }

    set((state) => ({
      sessionDetailMap: {
        ...state.sessionDetailMap,
        [sessionId]: data,
      },
    }));
  },

  insertSession: async (draft: DraftSession) => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const now = new Date().toISOString();

    // Insert the session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        id: draft.id,
        created_by: userId,
        created_at: now,
        updated_at: now,
        duration: draft.duration,
        notes: draft.notes,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to insert session', sessionError);
      throw new Error('Failed to insert session');
    }

    // Insert session items
    const sessionItems = draft.items.map((item, index) => ({
      id: item.id,
      session_id: draft.id,
      created_by: userId,
      created_at: now,
      updated_at: now,
      position: index,
      notes: item.notes,
      tempo: item.tempo,
      song_id: item.type === 'song' ? item.song?.id : null,
      exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
    }));

    const { error: itemsError } = await supabase
      .from('session_items')
      .insert(sessionItems);

    if (itemsError) {
      console.error('Failed to insert session items', itemsError);
      // Cleanup the session since items failed
      await supabase.from('sessions').delete().eq('id', draft.id);
      throw new Error('Failed to insert session items');
    }

    // Refresh the sessions list
    await get().fetchSessions();
  },
}));
