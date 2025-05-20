import { supabase } from '@/lib/supabase';
import { InputLocalSetlist, SetlistWithItems } from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SetlistsState = {
  setlistDetailMap: Record<string, SetlistWithItems>;
  fetchSetlists: () => Promise<void>;

  draftSetlist: InputLocalSetlist | null;
  clearDraftSetlist: () => void;
  setDraftSetlist: (draft: InputLocalSetlist) => void;
  syncDraftSetlist: (tempId: string) => Promise<void>;
};

export const useSetlistsStore = create<SetlistsState>((set, get) => ({
  draftSetlist: null,
  draftSetlistItems: [],
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

  setDraftSetlist: (draft) => set({ draftSetlist: draft }),

  clearDraftSetlist: () => set({ draftSetlist: null }),

  syncDraftSetlist: async () => {
    const draft = get().draftSetlist;
    if (!draft || draft.setlistItems.length === 0) return;

    const id = uuidv4();
    const now = new Date().toISOString();

    const setlistInsert = {
      ...draft,
      id,
      created_at: now,
      updated_at: now,
    };

    // Step 1: Insert setlist
    const { error: setlistError } = await supabase.from('setlists').insert(setlistInsert);
    if (setlistError) {
      console.error('Failed to insert setlist', setlistError);
      return;
    }

    // Step 2: Insert setlist items
    const setlistItemInserts = draft.setlistItems.map((item) => ({
      ...item,
      id: uuidv4(),
      setlist_id: id,
      created_at: now,
      updated_at: now,
    }));

    const { error: itemsError } = await supabase.from('setlist_items').insert(setlistItemInserts);
    if (itemsError) {
      console.error('Failed to insert setlist items', itemsError);
      return;
    }

    // Step 3: Fetch from view to get fully joined result
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
      .eq('id', id)
      .single();

    if (viewError) {
      console.error('Failed to fetch hydrated setlist from view', viewError);
      return;
    }

    // Step 4: Store in map + clear draft
    set((state) => ({
      setlistDetailMap: {
        ...state.setlistDetailMap,
        [id]: data,
      },
      draftSetlist: null,
    }));
  },
}));
