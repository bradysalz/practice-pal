import { deleteSong, insertSong, updateSong } from '@/lib/db/mutations';
import { selectSongs } from '@/lib/db/queries';
import { LocalSong, NewSong } from '@/types/song';
import { create } from 'zustand';

type SongsState = {
  songs: LocalSong[];
  addSong: (song: NewSong) => Promise<void>;
  updateSong: (id: string, updates: Partial<LocalSong>) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
};

export const useSongsStore = create<SongsState>((set, get) => ({
  songs: [],

  fetchSongs: async () => {
    const songs = await selectSongs();
    set({ songs: songs as LocalSong[] });
  },

  addSong: async (song: NewSong) => {
    await insertSong(song.name, song.artist_id, song.goal_tempo ?? undefined);
    await get().fetchSongs();
  },

  updateSong: async (id: string, updates: Partial<LocalSong>) => {
    await updateSong(id, {
      name: updates.name,
      artist_id: updates.artist_id,
      goal_tempo: updates.goal_tempo ?? undefined,
    });
    await get().fetchSongs();
  },

  deleteSong: async (id: string) => {
    await deleteSong(id);
    await get().fetchSongs();
  },
}));
