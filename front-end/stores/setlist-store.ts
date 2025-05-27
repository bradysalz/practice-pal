import { supabase } from '@/lib/supabase';
import { DraftSetlist, SetlistInsert, SetlistItemInsert, SetlistUpdate, SetlistWithItems } from '@/types/setlist';
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
    const { data, error } = await supabase
      .from('setlists_with_items')
      .select(
        `
        *,
        setlist_items (
          *,
          song:song_id (
            *,
            artist:artist_id (*)
          ),
          exercise:exercise_id (
            *,
            section:section_id (
              *,
              book:book_id (*)
            )
          )
        )
      `
      )
      .order('created_at', { ascending: false });

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
    const userId = (await supabase.auth.getUser()).data.user?.id;
    console.log('userId', userId, 'supabase.user()', await supabase.auth.getUser());

    if (!userId) throw new Error('User not authenticated');

    const setlistUpdate: SetlistUpdate = {
      name: setlist.name,
      description: setlist.description,
      updated_at: now,
      created_by: userId,
    };

    // Step 1: Update the setlist
    const { error: setlistError } = await supabase
      .from('setlists')
      .update(setlistUpdate)
      .eq('id', setlist.id);

    if (setlistError) {
      console.error('Failed to update setlist', setlistError);
      throw new Error('Failed to update setlist');
    }

    // Step 2: Delete existing items
    const { error: deleteError } = await supabase
      .from('setlist_items')
      .delete()
      .eq('setlist_id', setlist.id);

    if (deleteError) {
      console.error('Failed to delete existing setlist items', deleteError);
      throw new Error('Failed to delete setlist items');
    }

    // Step 3: Insert updated items

    const setlistItemInserts: SetlistItemInsert[] = setlist.items.map((item, index) => ({
      id: uuidv4(), // Generate new IDs for items
      setlist_id: setlist.id,
      type: item.type,
      song_id: item.type === 'song' ? item.song?.id : null,
      exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
      position: index,
      updated_at: now,
      created_at: now,
      created_by: userId,
    }));

    const { error: insertError } = await supabase
      .from('setlist_items')
      .insert(setlistItemInserts);

    if (insertError) {
      console.error('Failed to insert updated setlist items', insertError);
      throw new Error('Failed to update setlist items');
    }

    // Step 4: Fetch updated data to ensure consistency
    const { data, error: viewError } = await supabase
      .from('setlists_with_items')
      .select(
        `
        *,
        setlist_items (
          *,
          song:song_id (
            *,
            artist:artist_id (*)
          ),
          exercise:exercise_id (
            *,
            section:section_id (
              *,
              book:book_id (*)
            )
          )
        )
      `
      )
      .eq('id', setlist.id)
      .single();

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
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    // Step 1: Insert the setlist
    const setlistInsert: SetlistInsert = {
      id: draft.id,
      name: draft.name,
      description: draft.description,
      created_by: userId,
      created_at: now,
      updated_at: now,
    };

    const { error: setlistError } = await supabase
      .from('setlists')
      .insert(setlistInsert);

    if (setlistError) {
      console.error('Failed to insert setlist', setlistError);
      throw new Error('Failed to insert setlist');
    }

    // Step 2: Insert items
    const setlistItemInserts: SetlistItemInsert[] = draft.items.map((item, index) => ({
      id: uuidv4(),
      setlist_id: draft.id,
      type: item.type,
      song_id: item.type === 'song' ? item.song?.id : null,
      exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
      position: index,
      created_by: userId,
      created_at: now,
      updated_at: now,
    }));

    const { error: itemsError } = await supabase
      .from('setlist_items')
      .insert(setlistItemInserts);

    if (itemsError) {
      console.error('Failed to insert setlist items', itemsError);
      // Cleanup the setlist since items failed
      await supabase.from('setlists').delete().eq('id', draft.id);
      throw new Error('Failed to insert setlist items');
    }

    // Step 3: Fetch updated data to ensure consistency
    const { data, error: viewError } = await supabase
      .from('setlists_with_items')
      .select(
        `
        *,
        setlist_items (
          *,
          song:song_id (
            *,
            artist:artist_id (*)
          ),
          exercise:exercise_id (
            *,
            section:section_id (
              *,
              book:book_id (*)
            )
          )
        )
      `
      )
      .eq('id', draft.id)
      .single();

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
