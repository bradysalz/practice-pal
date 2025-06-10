import { fetchSongs, InputLocalSong, insertSong, SongRow, updateSong } from '@/lib/supabase/song';
import { PostgrestError } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SongsState = {
  songs: SongRow[];
  addSongLocal: (song: InputLocalSong) => string;
  syncAddSong: (tempId: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  updateSongLocal: (id: string, updates: Partial<SongRow>) => void;
  syncUpdateSong: (id: string) => Promise<{ error: PostgrestError | null }>;
};

export const useSongsStore = create<SongsState>((set, get) => ({
  songs: [],

  fetchSongs: async () => {
    const { data, error } = await fetchSongs();
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ songs: data as SongRow[] });
  },

  addSongLocal: (song) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSong: SongRow = {
      ...song,
      id,
      artist_id: song.artist_id ?? null,
      goal_tempo: song.goal_tempo ?? null,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ songs: [...state.songs, newSong] }));
    return id;
  },

  syncAddSong: async (id) => {
    const localSong = get().songs.find((s) => s.id === id);
    if (!localSong) return;

    const { data, error } = await insertSong(localSong);

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        songs: state.songs.map((s) => (s.id === id ? data : s)),
      }));
    }
  },

  updateSongLocal: (id, updates) => {
    set((state) => ({
      songs: state.songs.map((song) =>
        song.id === id ? { ...song, ...updates, updated_at: new Date().toISOString() } : song
      ),
    }));
  },

  syncUpdateSong: async (id) => {
    const song = get().songs.find(s => s.id === id);
    if (!song) return { error: null };

    const { id: _, created_at, ...updatePayload } = song;

    const { error } = await updateSong(id, updatePayload);

    if (error) {
      console.error('Failed to sync song update:', error);
      return { error };
    }

    return { error: null };
  },
}));
