import { deleteArtist, insertArtist, updateArtist } from '@/lib/db/mutations';
import { selectArtists } from '@/lib/db/queries';
import { ArtistRow, LocalArtist } from '@/types/artist';
import { create } from 'zustand';

type ArtistsState = {
  artists: LocalArtist[];
  addArtist: (name: string) => Promise<void>;
  updateArtist: (id: string, updates: { name?: string }) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
  fetchArtists: () => Promise<void>;
};

export const useArtistsStore = create<ArtistsState>((set, get) => ({
  artists: [],

  fetchArtists: async () => {
    const artists = await selectArtists();
    set({ artists: artists as ArtistRow[] });
  },

  addArtist: async (name: string) => {
    await insertArtist(name);
    await get().fetchArtists();
  },

  updateArtist: async (id: string, updates: { name?: string }) => {
    await updateArtist(id, updates);
    await get().fetchArtists();
  },

  deleteArtist: async (id: string) => {
    await deleteArtist(id);
    await get().fetchArtists();
  },
}));
