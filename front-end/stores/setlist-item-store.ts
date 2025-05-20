import { supabase } from '@/lib/supabase';
import { InputLocalSetlistItem, SetlistItemRow } from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SetlistItemsState = {
  setlistItems: SetlistItemRow[];
  addSetlistItemLocal: (item: InputLocalSetlistItem) => string;
  syncAddSetlistItem: (tempId: string) => Promise<void>;
  fetchSetlistItems: (setlistId: string) => Promise<void>;
};

export const useSetlistItemsStore = create<SetlistItemsState>((set, get) => ({
  setlistItems: [],

  fetchSetlistItems: async (setlistId) => {
    const { data, error } = await supabase
      .from('setlist_items')
      .select('*')
      .eq('setlist_id', setlistId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ setlistItems: data as SetlistItemRow[] });
  },

  addSetlistItemLocal: (item) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newItem: SetlistItemRow = {
      ...item,
      id,
      exercise_id: item.exercise_id ?? null,
      song_id: item.song_id ?? null,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ setlistItems: [...state.setlistItems, newItem] }));
    return id;
  },

  syncAddSetlistItem: async (id) => {
    const localItem = get().setlistItems.find((s) => s.id === id);
    if (!localItem) return;

    const { data, error } = await supabase
      .from('setlist_items')
      .insert(localItem)
      .select()
      .single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark as failed, etc.
    } else {
      set((state) => ({
        setlistItems: state.setlistItems.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
