import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type ArtistRow = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];

type LocalArtist = ArtistRow & { tempId?: string };

type ArtistsState = {
  artists: LocalArtist[];
  addArtistLocal: (artist: Omit<ArtistInsert, 'id' | 'created_at' | 'updated_at'>) => string;
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
    const tempId = uuidv4();
    const newArtist: LocalArtist = {
      ...artist,
      id: -1, // placeholder ID to satisfy type (or null if you prefer)
      created_by: artist.created_by,
      name: artist.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tempId,
    };
    set((state) => ({ artists: [...state.artists, newArtist] }));
    return tempId;
  },

  syncAddArtist: async (tempId) => {
    const localArtist = get().artists.find((s) => s.tempId === tempId);
    if (!localArtist) return;

    const { created_by, name } = localArtist;

    const payload: ArtistInsert = {
      created_by,
      name,
    };

    const { data, error } = await supabase.from('artists').insert(payload).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        artists: state.artists.map((s) => (s.tempId === tempId ? data : s)),
      }));
    }
  },
}));
