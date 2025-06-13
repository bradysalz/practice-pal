import {
  deleteSetlist,
  deleteSetlistItems,
  insertSetlist,
  insertSetlistItems,
  updateSetlist,
} from '@/lib/supabase/setlist';
import { refreshAndSelectSetlists, selectSetlistItemsByIds } from '@/lib/db/queries';
import {
  DraftSetlist,
  SetlistInsert,
  SetlistItemInsert,
  SetlistUpdate,
  SetlistWithItems,
} from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SetlistsState = {
  setlistDetailMap: Record<string, SetlistWithItems>;
  fetchSetlists: () => Promise<void>;
  updateSetlist: (setlist: DraftSetlist) => Promise<void>;
  insertSetlist: (draft: DraftSetlist) => Promise<void>;
};

export const useSetlistsStore = create<SetlistsState>((set, get) => ({
  setlistDetailMap: {},

  fetchSetlists: async () => {
    const base = await refreshAndSelectSetlists();

    // Fetch items for these setlists
    const ids = base.map((b) => b.id);
    const itemsRows = await selectSetlistItemsByIds(ids);

    const itemsBySetlist: Record<string, any[]> = {};
    for (const row of itemsRows) {
      itemsBySetlist[row.setlist_id] = [
        ...(itemsBySetlist[row.setlist_id] || []),
        { ...row, song: null, exercise: null },
      ];
    }

    const setlists: SetlistWithItems[] = base.map((b) => ({
      ...b,
      setlist_items: itemsBySetlist[b.id] || [],
    }));

    const map = Object.fromEntries(setlists.map((s) => [s.id, s]));
    set({
      setlistDetailMap: map,
    });
  },

  updateSetlist: async (setlist: DraftSetlist) => {
    const now = new Date().toISOString();

    const setlistUpdate: SetlistUpdate = {
      name: setlist.name,
      description: setlist.description,
      updated_at: now,
    };

    // Step 1: Update the setlist
    const { error: setlistError } = await updateSetlist(setlist.id, setlistUpdate);

    if (setlistError) {
      console.error('Failed to update setlist', setlistError);
      throw new Error('Failed to update setlist');
    }

    // Step 2: Delete existing items
    const { error: deleteError } = await deleteSetlistItems(setlist.id);

    if (deleteError) {
      console.error('Failed to delete existing setlist items', deleteError);
      throw new Error('Failed to delete setlist items');
    }

    // Step 3: Insert updated items
    const setlistItemInserts: Partial<SetlistItemInsert>[] = setlist.items.map((item, index) => ({
      id: uuidv4(), // Generate new IDs for items
      setlist_id: setlist.id,
      type: item.type,
      song_id: item.type === 'song' ? item.song?.id : null,
      exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
      position: index,
      updated_at: now,
      created_at: now,
    }));

    const { error: insertError } = await insertSetlistItems(setlistItemInserts);

    if (insertError) {
      console.error('Failed to insert updated setlist items', insertError);
      throw new Error('Failed to update setlist items');
    }

    // Step 4: Fetch updated data to ensure consistency
    await get().fetchSetlists();
  },

  insertSetlist: async (draft: DraftSetlist) => {
    const now = new Date().toISOString();

    // Step 1: Insert the setlist
    const setlistInsert: Partial<SetlistInsert> = {
      id: draft.id,
      name: draft.name,
      description: draft.description,
      created_at: now,
      updated_at: now,
    };

    const { error: setlistError } = await insertSetlist(setlistInsert);

    if (setlistError) {
      console.error('Failed to insert setlist', setlistError);
      throw new Error('Failed to insert setlist');
    }

    // Step 2: Insert items
    const setlistItemInserts: Partial<SetlistItemInsert>[] = draft.items.map((item, index) => ({
      id: uuidv4(),
      setlist_id: draft.id,
      type: item.type,
      song_id: item.type === 'song' ? item.song?.id : null,
      exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
      position: index,
      created_at: now,
      updated_at: now,
    }));

    const { error: itemsError } = await insertSetlistItems(setlistItemInserts);

    if (itemsError) {
      console.error('Failed to insert setlist items', itemsError);
      // Cleanup the setlist since items failed
      await deleteSetlist(draft.id);
      throw new Error('Failed to insert setlist items');
    }

    // Step 3: Fetch updated data to ensure consistency
    await get().fetchSetlists();
  },
}));
