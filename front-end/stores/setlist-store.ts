import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SetlistRow = Database['public']['Tables']['setlists']['Row'];
type SetlistInsert = Database['public']['Tables']['setlists']['Insert'];
type InputLocalSetlist = Omit<SetlistInsert, 'id' | 'created_at' | 'updated_at'>;

type SetlistsState = {
  setlists: SetlistRow[];
  addSetlistLocal: (setlist: InputLocalSetlist) => string;
  syncAddSetlist: (tempId: string) => Promise<void>;
  fetchSetlists: () => Promise<void>;
};

export const useSetlistsStore = create<SetlistsState>((set, get) => ({
  setlists: [],

  fetchSetlists: async () => {
    const { data, error } = await supabase.from('setlists').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ setlists: data as SetlistRow[] });
  },

  addSetlistLocal: (setlist) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSetlist: SetlistRow = {
      ...setlist,
      id,
      name: setlist.name ?? null,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ setlists: [...state.setlists, newSetlist] }));
    return id;
  },

  syncAddSetlist: async (id) => {
    const localSetlist = get().setlists.find((s) => s.id === id);
    if (!localSetlist) return;

    const { data, error } = await supabase.from('setlists').insert(localSetlist).select().single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark as failed, etc.
    } else {
      set((state) => ({
        setlists: state.setlists.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
