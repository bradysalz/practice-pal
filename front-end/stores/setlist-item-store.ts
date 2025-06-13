import { selectSetlistItems } from '@/lib/db/queries';
import { deleteSetlistItems, insertSetlistItem, updateSetlist } from '@/lib/supabase/setlist';
import { SetlistItemRow } from '@/types/setlist';
import { create } from 'zustand';

type SetlistItemsState = {
  setlistItems: SetlistItemRow[];
  fetchSetlistItems: (setlistId: string) => Promise<void>;
  addSetlistItem: (item: SetlistItemRow) => Promise<void>;
  updateSetlistItem: (id: string, updates: Partial<SetlistItemRow>) => Promise<void>;
  deleteSetlistItem: (id: string) => Promise<void>;
};

export const useSetlistItemsStore = create<SetlistItemsState>((set, get) => ({
  setlistItems: [],

  fetchSetlistItems: async (setlistId) => {
    const data = await selectSetlistItems(setlistId);
    set({ setlistItems: data as SetlistItemRow[] });
  },

  addSetlistItem: async (item: SetlistItemRow) => {
    await insertSetlistItem(item);
    await get().fetchSetlistItems(item.setlist_id);
  },

  updateSetlistItem: async (id: string, updates: Partial<SetlistItemRow>) => {
    const item = get().setlistItems.find((i) => i.id === id);
    if (item) {
      await updateSetlist(item.setlist_id, { ...updates, id });
      await get().fetchSetlistItems(item.setlist_id);
    }
  },

  deleteSetlistItem: async (id: string) => {
    const item = get().setlistItems.find((i) => i.id === id);
    if (item) {
      await deleteSetlistItems(item.setlist_id);
      await get().fetchSetlistItems(item.setlist_id);
    }
  },
}));
