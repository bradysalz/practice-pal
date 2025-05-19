import { supabase } from '@/lib/supabase';
import {
  InputLocalSession,
  SessionInsert,
  SessionWithCountsRow,
  SessionWithItems,
} from '@/types/session';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SessionsState = {
  sessions: SessionWithCountsRow[];
  sessionsWithItems: SessionWithItems[];
  sessionDetailMap: Record<string, SessionWithItems>;
  addSessionLocal: (session: InputLocalSession) => string;
  syncAddSession: (tempId: string) => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchSessionDetail: (sessionId: string) => Promise<void>;
  fetchRecentSessionsWithItems: (limit: number) => Promise<void>;
};

function toSessionInsert(session: SessionWithCountsRow): SessionInsert {
  const { song_count, exercise_count, ...sessionInsert } = session;
  return sessionInsert;
}

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

  addSessionLocal: (session) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSession: SessionWithCountsRow = {
      ...session,
      id,
      created_at: now,
      updated_at: now,
      duration: session.duration ?? null,
      notes: session.notes ?? null,
      song_count: 0, // view field
      exercise_count: 0, // view field
    };

    set((state) => ({ sessions: [newSession, ...state.sessions] }));
    return id;
  },

  syncAddSession: async (tempId) => {
    const session = get().sessions.find((s) => s.id === tempId);
    if (!session) return;

    const sessionToUse = toSessionInsert(session);
    const { data, error } = await supabase.from('sessions').insert(sessionToUse).select().single();

    if (error) {
      console.error('Sync failed', error);
      return;
    }

    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === tempId ? data : s)),
    }));
  },
}));
