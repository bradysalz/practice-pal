import {
  deleteSetlist,
  deleteSetlistItems,
  fetchSetlistById,
  fetchSetlists,
  insertSetlist,
  insertSetlistItems,
  updateSetlist,
} from '@/lib/supabase/setlist';
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
    const { data, error } = await fetchSetlists();

    if (error) {
      console.error('Failed to fetch setlists with items', error);
      return;
    }

    const map = Object.fromEntries(data.map((s) => [s.id, s]));
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
    const { data, error: viewError } = await fetchSetlistById(setlist.id);

    if (viewError) {
      console.error('Failed to fetch updated setlist', viewError);
      throw new Error('Failed to fetch updated setlist');
    }

    // Step 5: Update store
    set((state) => ({
      setlistDetailMap: {
        ...state.setlistDetailMap,
        [setlist.id]: data,
      },
    }));
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
    const { data, error: viewError } = await fetchSetlistById(draft.id);

    if (viewError) {
      console.error('Failed to fetch inserted setlist', viewError);
      throw new Error('Failed to fetch inserted setlist');
    }

    // Step 4: Update store
    set((state) => ({
      setlistDetailMap: {
        ...state.setlistDetailMap,
        [draft.id]: data,
      },
    }));
  },
}));
