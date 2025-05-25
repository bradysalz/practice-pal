import { supabase } from '@/lib/supabase';
import { SetlistItemRow } from '@/types/setlist';
import { create } from 'zustand';

type SetlistItemsState = {
  setlistItems: SetlistItemRow[];
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
