import { Database } from '@/types/supabase';

export type SetlistRow = Database['public']['Tables']['setlists']['Row'];
export type SetlistItemRow = Database['public']['Tables']['setlist_items']['Row'];

type SongRow = Database['public']['Tables']['songs']['Row'];
type ArtistRow = Database['public']['Tables']['artists']['Row'];
type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type SectionRow = Database['public']['Tables']['sections']['Row'];
type BookRow = Database['public']['Tables']['books']['Row'];

export type SetlistItemWithNested = SetlistItemRow & {
  song:
  | (SongRow & {
    artist: ArtistRow | null;
  })
  | null;
  exercise:
  | (ExerciseRow & {
    section:
    | (SectionRow & {
      book: BookRow | null;
    })
    | null;
  })
  | null;
};
// Manually build the View row
export type SetlistWithCountsRow = SetlistRow & {
  song_count: number;
  exercise_count: number;
};


// Manual create types for local setlists
export type DraftSetlistItem = {
  id: string;
  type: 'exercise' | 'song';

  // one of these is defined based on `type`
  exercise?: {
    id: string;
    name: string | null;
    section?: {
      id: string;
      name: string;
      book?: {
        id: string;
        name: string;
      };
    };
  };
  song?: {
    id: string;
    name: string;
    artist?: {
      id: string;
      name: string;
    };
  };
};

export type DraftSetlist = {
  id: string;
  name: string | null;
  description: string | null;
  items: DraftSetlistItem[];
};


export type SetlistInsert = Database['public']['Tables']['setlists']['Insert'];
export type SetlistUpdate = Database['public']['Tables']['setlists']['Update'];
export type SetlistWithItems = SetlistWithCountsRow & {
  setlist_items: SetlistItemWithNested[];
};


export type SetlistItemInsert = Database['public']['Tables']['setlist_items']['Insert'];
