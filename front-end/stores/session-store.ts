import { deleteSession, fetchRecentSessionsWithItems, fetchSessionDetail, fetchSessions, getCurrentUserId, insertSession, insertSessionItems } from '@/lib/supabase/session';
import {
  DraftSession,
  SessionInsert,
  SessionItemInsert,
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
    const { data, error } = await fetchSessions();
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sessions: data as SessionWithCountsRow[] });
  },

  fetchRecentSessionsWithItems: async (limit) => {
    const { data, error } = await fetchRecentSessionsWithItems(limit);

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

    const { data, error } = await fetchSessionDetail(sessionId);

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
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const now = new Date().toISOString();

    const sessionInsert: SessionInsert = {
      id: draft.id,
      created_by: userId,
      created_at: now,
      updated_at: now,
      duration: draft.duration,
      notes: draft.notes,
    };

    // Insert the session
    const { error: sessionError } = await insertSession(sessionInsert);

    if (sessionError) {
      console.error('Failed to insert session', sessionError);
      throw new Error('Failed to insert session');
    }

    // Insert session items
    const sessionItemInserts: SessionItemInsert[] = draft.items.map((item, index) => ({
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
      type: item.type,
    }));

    const { error: itemsError } = await insertSessionItems(sessionItemInserts);

    if (itemsError) {
      console.error('Failed to insert session items', itemsError);
      // Cleanup the session since items failed
      await deleteSession(draft.id);
      throw new Error('Failed to insert session items');
    }

    // Refresh the sessions list
    await get().fetchSessions();
  },
}));
