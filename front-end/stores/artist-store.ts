import { selectArtists } from '@/lib/db/queries';
import { insertArtist } from '@/lib/supabase/artist';
import { ArtistRow, LocalArtist, NewArtist } from '@/types/artist';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type ArtistsState = {
  artists: LocalArtist[];
  addArtistLocal: (artist: NewArtist) => string;
  syncAddArtist: (tempId: string) => Promise<void>;
  fetchArtists: () => Promise<void>;
};

export const useArtistsStore = create<ArtistsState>((set, get) => ({
  artists: [],

  fetchArtists: async () => {
    const artists = await selectArtists();
    set({ artists: artists as ArtistRow[] });
  },

  addArtistLocal: (artist: NewArtist) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newArtist: LocalArtist = {
      id,
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

    const { data, error } = await insertArtist(localArtist);

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
