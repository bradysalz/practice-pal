import {
  selectSessionItemsByExercise,
  selectSessionItemsBySession,
  selectSessionItemsBySong,
} from '@/lib/db/queries';
import { LocalSessionItem, NewSessionItem, SessionItemRow } from '@/types/session';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SessionItemsState = {
  sessionItemsBySession: { [sessionId: string]: LocalSessionItem[] };
  sessionItemsByExercise: { [exerciseId: string]: LocalSessionItem[] };
  sessionItemsBySong: { [songId: string]: LocalSessionItem[] };

  fetchSessionItemBySessionId: (sessionId: string) => Promise<void>;
  fetchSessionItemByExerciseId: (exerciseId: string, force?: boolean) => Promise<void>;
  fetchSessionItemBySongId: (songId: string) => Promise<void>;

  addSessionItemLocal: (item: NewSessionItem) => string;
};

export const useSessionItemsStore = create<SessionItemsState>((set, get) => ({
  sessionItemsBySession: {},
  sessionItemsByExercise: {},
  sessionItemsBySong: {},

  fetchSessionItemBySessionId: async (sessionId) => {
    const data = await selectSessionItemsBySession(sessionId);

    set((state) => ({
      sessionItemsBySession: {
        ...state.sessionItemsBySession,
        [sessionId]: data as LocalSessionItem[],
      },
    }));
  },

  fetchSessionItemByExerciseId: async (exerciseId: string, force: boolean = false) => {
    // Return early if data exists and not forcing refresh
    if (!force && get().sessionItemsByExercise[exerciseId]?.length > 0) {
      return;
    }

    const data = await selectSessionItemsByExercise(exerciseId);

    set((state) => ({
      sessionItemsByExercise: {
        ...state.sessionItemsByExercise,
        [exerciseId]: data as SessionItemRow[],
      },
    }));
  },

  fetchSessionItemBySongId: async (songId) => {
    const data = await selectSessionItemsBySong(songId);

    set((state) => ({
      sessionItemsBySong: { ...state.sessionItemsBySong, [songId]: data as SessionItemRow[] },
    }));
  },

  addSessionItemLocal: (item: NewSessionItem) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newItem: LocalSessionItem = {
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
}));
