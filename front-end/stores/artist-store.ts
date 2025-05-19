import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type ArtistRow = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
type InputArist = Omit<ArtistInsert, 'id' | 'created_at' | 'updated_at'>;

type ArtistsState = {
  artists: ArtistRow[];
  addArtistLocal: (artist: InputArist) => string;
  syncAddArtist: (tempId: string) => Promise<void>;
  fetchArtists: () => Promise<void>;
};

export const useArtistsStore = create<ArtistsState>((set, get) => ({
  artists: [],

  fetchArtists: async () => {
    const { data, error } = await supabase.from('artists').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ artists: data as ArtistRow[] });
  },

  addArtistLocal: (artist) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newArtist: ArtistRow = {
      id,
      created_by: artist.created_by,
      name: artist.name,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ artists: [...state.artists, newArtist] }));
    return id;
  },

  syncAddArtist: async (id) => {
    const localArtist = get().artists.find((s) => s.id === id);
    if (!localArtist) return;

    const { data, error } = await supabase.from('artists').insert(localArtist).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optionally mark artist as needing retry or show error UI
    } else {
      // Update local data with fresh server fields (if needed)
      set((state) => ({
        artists: state.artists.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
