import { Database } from '@/types/supabase';

type SessionRow = Database['public']['Tables']['sessions']['Row'];

type SessionItemRow = Database['public']['Tables']['session_items']['Row'];
type SongRow = Database['public']['Tables']['songs']['Row'];
type ArtistRow = Database['public']['Tables']['artists']['Row'];
type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type SectionRow = Database['public']['Tables']['sections']['Row'];
type BookRow = Database['public']['Tables']['books']['Row'];

export type SessionItemWithNested = SessionItemRow & {
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
export type SessionWithCountsRow = SessionRow & {
  song_count: number;
  exercise_count: number;
};
export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
export type InputLocalSession = Omit<SessionInsert, 'id' | 'created_at' | 'updated_at'>;

export type SessionWithItems = SessionWithCountsRow & {
  session_items: SessionItemWithNested[];
};
