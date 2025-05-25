import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type SongRow = Database['public']['Tables']['songs']['Row'];
type SongInsert = Database['public']['Tables']['songs']['Insert'];
type InputLocalSong = Omit<SongInsert, 'id' | 'created_at' | 'updated_at'>;

type SongsState = {
  songs: SongRow[];
  addSongLocal: (song: InputLocalSong) => string;
  syncAddSong: (tempId: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
};

export const useSongsStore = create<SongsState>((set, get) => ({
  songs: [],

  fetchSongs: async () => {
    const { data, error } = await supabase.from('songs').select('*');
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

    const { data, error } = await supabase.from('songs').insert(localSong).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        songs: state.songs.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
