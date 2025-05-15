import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SongRow = Database['public']['Tables']['songs']['Row'];
type SongInsert = Database['public']['Tables']['songs']['Insert'];

type LocalSong = SongRow & { tempId?: string };

type SongsState = {
  songs: LocalSong[];
  addSongLocal: (song: Omit<SongInsert, 'id' | 'created_at' | 'updated_at'>) => string;
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
    console.log(data);
    set({ songs: data as SongRow[] });
  },

  addSongLocal: (song) => {
    const tempId = uuidv4();
    const newSong: LocalSong = {
      ...song,
      id: -1, // placeholder ID to satisfy type (or null if you prefer)
      created_by: song.created_by,
      name: song.name,
      artist_id: song.artist_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tempId,
    };
    set((state) => ({ songs: [...state.songs, newSong] }));
    return tempId;
  },

  syncAddSong: async (tempId) => {
    const localSong = get().songs.find((s) => s.tempId === tempId);
    if (!localSong) return;

    const { artist_id, created_by, name } = localSong;

    const payload: SongInsert = {
      artist_id,
      created_by,
      name,
    };

    const { data, error } = await supabase.from('songs').insert(payload).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        songs: state.songs.map((s) => (s.tempId === tempId ? data : s)),
      }));
    }
  },
}));
