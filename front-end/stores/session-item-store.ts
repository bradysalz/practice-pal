import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type SessionItemRow = Database['public']['Tables']['session_items']['Row'];
type SessionItemInsert = Database['public']['Tables']['session_items']['Insert'];
type InputLocalSessionItem = Omit<SessionItemInsert, 'id' | 'created_at' | 'updated_at'> & {
  session_id: string;
  tempo: number;
};

type SessionItemsState = {
  sessionItemsBySession: { [sessionId: string]: SessionItemRow[] };
  sessionItemsByExercise: { [exerciseId: string]: SessionItemRow[] };
  sessionItemsBySong: { [songId: string]: SessionItemRow[] };

  fetchSessionItemBySessionId: (sessionId: string) => Promise<void>;
  fetchSessionItemByExerciseId: (exerciseId: string, force?: boolean) => Promise<void>;
  fetchSessionItemBySongId: (songId: string) => Promise<void>;

  addSessionItemLocal: (item: InputLocalSessionItem) => string;
  syncAddSessionItem: (tempId: string) => Promise<void>;
};

export const useSessionItemsStore = create<SessionItemsState>((set, get) => ({
  sessionItemsBySession: {},
  sessionItemsByExercise: {},
  sessionItemsBySong: {},

  fetchSessionItemBySessionId: async (sessionId) => {
    const { data, error } = await supabase
      .from('session_items')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      console.error('Fetch by session failed', error);
      return;
    }

    set((state) => ({
      sessionItemsBySession: {
        ...state.sessionItemsBySession,
        [sessionId]: data as SessionItemRow[],
      },
    }));
  },

  fetchSessionItemByExerciseId: async (exerciseId: string, force: boolean = false) => {
    // Return early if data exists and not forcing refresh
    if (!force && get().sessionItemsByExercise[exerciseId]?.length > 0) {
      return;
    }

    const { data, error } = await supabase
      .from('session_items')
      .select('*')
      .eq('exercise_id', exerciseId);

    if (error) {
      console.error('Fetch by exercise failed', error);
      return;
    }

    set((state) => ({
      sessionItemsByExercise: {
        ...state.sessionItemsByExercise,
        [exerciseId]: data as SessionItemRow[],
      },
    }));
  },

  fetchSessionItemBySongId: async (songId) => {
    const { data, error } = await supabase.from('session_items').select('*').eq('song_id', songId);

    if (error) {
      console.error('Fetch by song failed', error);
      return;
    }

    set((state) => ({
      sessionItemsBySong: { ...state.sessionItemsBySong, [songId]: data as SessionItemRow[] },
    }));
  },

  addSessionItemLocal: (item) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newItem: SessionItemRow = {
      ...item,
      id,
      created_at: now,
      updated_at: now,
      exercise_id: item.exercise_id ?? null,
      song_id: item.song_id ?? null,
      notes: item.notes ?? null,
      position: item.position ?? null,
    };

    set((state) => ({
      sessionItemsBySession: {
        ...state.sessionItemsBySession,
        [item.session_id!]: [newItem, ...(state.sessionItemsBySession[item.session_id!] || [])],
      },
    }));

    return id;
  },

  syncAddSessionItem: async (tempId) => {
    // Search only in sessionItemsBySession
    let found: { sessionId: string; item: SessionItemRow } | undefined;
    for (const sessionId in get().sessionItemsBySession) {
      const item = get().sessionItemsBySession[sessionId].find((i) => i.id === tempId);
      if (item) {
        found = { sessionId, item };
        break;
      }
    }

    if (!found) return;

    const { item } = found;
    const { id, ...insertData } = item;

    const { data, error } = await supabase
      .from('session_items')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Sync failed', error);
      return;
    }

    const newItem = data as SessionItemRow;

    set((state) => ({
      sessionItemsBySession: {
        ...state.sessionItemsBySession,
        [item.session_id!]: state.sessionItemsBySession[item.session_id!].map((i) =>
          i.id === tempId ? newItem : i
        ),
      },
    }));
  },
}));
