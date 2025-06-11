import {
  deleteSession,
  fetchRecentSessionsWithItems,
  fetchSessionDetail,
  fetchSessions,
  insertSession,
  insertSessionItems,
} from '@/lib/supabase/session';
import {
  DraftSession,
  LocalSessionItem,
  SessionWithCountsRow,
  SessionWithItems,
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
    const now = new Date().toISOString();

    // Insert the session
    const { error: sessionError } = await insertSession(draft);

    if (sessionError) {
      console.error('Failed to insert session', sessionError);
      throw new Error('Failed to insert session');
    }

    // Insert session items
    const validSessionItems = draft.items.filter((item) => item.tempo !== null);
    const sessionItemInserts: LocalSessionItem[] = validSessionItems.map((item, index) => ({
      ...item,
      session_id: draft.id,
      created_at: now,
      updated_at: now,
      position: index,
      song_id: item.song?.id ?? null,
      exercise_id: item.exercise?.id ?? null,
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
