import { deleteSession, insertSession, insertSessionItems } from '@/lib/supabase/session';
import {
  refreshAndSelectSessions,
  refreshAndSelectRecentSessions,
  refreshAndSelectSessionDetail,
  selectSessionItemsBySession,
  selectSessionItemsBySessionIds,
} from '@/lib/db/queries';
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
    const data = await refreshAndSelectSessions();
    set({ sessions: data as unknown as SessionWithCountsRow[] });
  },

  fetchRecentSessionsWithItems: async (limit) => {
    const sessions = await refreshAndSelectRecentSessions(limit);

    // Fetch items
    const ids = sessions.map((s) => s.id);
    const items = await selectSessionItemsBySessionIds(ids);

    const itemsBySession: Record<string, any[]> = {};
    for (const row of items) {
      itemsBySession[row.session_id] = [
        ...(itemsBySession[row.session_id] || []),
        { ...row, song: null, exercise: null },
      ];
    }

    const data: SessionWithItems[] = sessions.map((s) => ({
      ...(s as unknown as SessionWithItems),
      session_items: itemsBySession[s.id] || [],
    }));
    const map = Object.fromEntries(data.map((s) => [s.id, s]));
    set({
      sessionsWithItems: data,
      sessionDetailMap: map,
    });
  },

  fetchSessionDetail: async (sessionId: string) => {
    const existing = get().sessionDetailMap[sessionId];
    if (existing) return;

    const session = await refreshAndSelectSessionDetail(sessionId);
    const base = session[0];
    if (!base) return;

    const items = await selectSessionItemsBySession(sessionId);

    const detail: SessionWithItems = {
      ...(base as unknown as SessionWithItems),
      session_items: items.map((i) => ({ ...i, song: null, exercise: null })),
    };

    set((state) => ({
      sessionDetailMap: {
        ...state.sessionDetailMap,
        [sessionId]: detail,
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
