import { refreshAndSelectSetlists, selectSetlistItemsWithNestedByIds } from '@/lib/db/queries';
import {
  deleteSetlist,
  deleteSetlistItems,
  insertSetlist,
  insertSetlistItems,
  updateSetlist,
} from '@/lib/supabase/setlist';
import { DraftSetlist, SetlistWithItems } from '@/types/setlist';
import { transformSetlistItemWithNested } from '@/utils/nested-transformers';
import { mapSetlistItemToRow } from '@/utils/setlist';
import { create } from 'zustand';

type SetlistsState = {
  setlistDetailMap: Record<string, SetlistWithItems>;
  fetchSetlists: () => Promise<void>;
  addSetlist: (draft: DraftSetlist) => Promise<void>;
  updateSetlist: (setlist: DraftSetlist) => Promise<void>;
  deleteSetlist: (id: string) => Promise<void>;
};

export const useSetlistsStore = create<SetlistsState>((set, get) => ({
  setlistDetailMap: {},

  fetchSetlists: async () => {
    const base = await refreshAndSelectSetlists();
    const ids = base.map((b) => b.id);
    const itemsRows = await selectSetlistItemsWithNestedByIds(ids);

    const itemsBySetlist: Record<string, any[]> = {};
    for (const row of itemsRows) {
      const setlistItem = transformSetlistItemWithNested(row as any);
      itemsBySetlist[row.setlist_id] = [...(itemsBySetlist[row.setlist_id] || []), setlistItem];
    }

    const setlists: SetlistWithItems[] = base.map((b) => ({
      ...b,
      setlist_items: (itemsBySetlist[b.id] || []) as any,
    }));

    set({ setlistDetailMap: Object.fromEntries(setlists.map((s) => [s.id, s])) });
  },

  addSetlist: async (draft: DraftSetlist) => {
    const now = new Date().toISOString();

    // Insert the setlist
    await insertSetlist({
      id: draft.id,
      name: draft.name,
      description: draft.description,
      created_at: now,
      updated_at: now,
    });

    // Insert items
    await insertSetlistItems(
      draft.items.map((item, index) => ({
        id: item.id,
        setlist_id: draft.id,
        type: item.type,
        song_id: item.type === 'song' ? item.song?.id : null,
        exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
        position: index,
        created_at: now,
        updated_at: now,
      }))
    );

    await get().fetchSetlists();
  },

  updateSetlist: async (setlist: DraftSetlist) => {
    const now = new Date().toISOString();

    // Update the setlist
    await updateSetlist(setlist.id, {
      name: setlist.name,
      description: setlist.description,
      updated_at: now,
    });

    // Delete existing items
    await deleteSetlistItems(setlist.id);

    await insertSetlistItems(
      setlist.items.map((item, index) => mapSetlistItemToRow(item, index, setlist.id, now))
    );

    await get().fetchSetlists();
  },

  deleteSetlist: async (id: string) => {
    await deleteSetlist(id);
    await get().fetchSetlists();
  },
}));
