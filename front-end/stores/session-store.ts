import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SessionRow = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
type InputLocalSession = Omit<SessionInsert, 'id' | 'created_at' | 'updated_at'>;

type SessionsState = {
  sessions: SessionRow[];
  addSessionLocal: (session: InputLocalSession) => string;
  syncAddSession: (tempId: string) => Promise<void>;
  fetchSessions: () => Promise<void>;
};

export const useSessionsStore = create<SessionsState>((set, get) => ({
  sessions: [],

  fetchSessions: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sessions: data as SessionRow[] });
  },

  addSessionLocal: (session) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSession: SessionRow = {
      ...session,
      id,
      created_at: now,
      updated_at: now,
      duration: session.duration ?? null,
    };

    set((state) => ({ sessions: [newSession, ...state.sessions] }));
    return id;
  },

  syncAddSession: async (tempId) => {
    const session = get().sessions.find((s) => s.id === tempId);
    if (!session) return;

    const { id, ...sessionInsert } = session;

    const { data, error } = await supabase.from('sessions').insert(sessionInsert).select().single();
    if (error) {
      console.error('Sync failed', error);
      return;
    }

    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === tempId ? (data as SessionRow) : s)),
    }));
  },
}));
