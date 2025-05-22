import { Database } from '@/types/supabase';

export type SetlistRow = Database['public']['Tables']['setlists']['Row'];

export type SetlistItemRow = Database['public']['Tables']['setlist_items']['Row'];
export type SetlistItemInsert = Database['public']['Tables']['setlist_items']['Insert'];
export type InputLocalSetlistItem = Omit<SetlistItemInsert, 'id' | 'created_by' | 'created_at' | 'updated_at'> & {
  setlist_id: string;
  position: number; // enforce always present, adjust as needed
};

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
export type SetlistInsert = Database['public']['Tables']['setlists']['Insert'];
export type InputLocalSetlist = Omit<SetlistInsert, 'id' | 'created_at' | 'updated_at'> & {
  setlistItems: InputLocalSetlistItem[];
};

export type SetlistWithItems = SetlistWithCountsRow & {
  setlist_items: SetlistItemWithNested[];
};
