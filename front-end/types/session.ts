import { Database } from '@/types/supabase';

type SessionRow = Database['public']['Tables']['sessions']['Row'];

export type SessionItemRow = Database['public']['Tables']['session_items']['Row'];
export type SongRow = Database['public']['Tables']['songs']['Row'];
export type ArtistRow = Database['public']['Tables']['artists']['Row'];
export type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
export type SectionRow = Database['public']['Tables']['sections']['Row'];
export type BookRow = Database['public']['Tables']['books']['Row'];

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

// Local exercise details for display
export type LocalExerciseDetails = {
  id: string;
  name: string;
  section: {
    id: number;
    name: string;
    book: {
      id: string;
      name: string;
      author: string;
    };
  };
};

// For creating new session items locally before sync
export type InputLocalSessionItem = {
  song_id: string | null;
  exercise_id: string | null;
  notes: string | null;
  tempo: number | null;
  // Include exercise details for local display
  exercise?: LocalExerciseDetails;
};

// Manually build the View row
export type SessionWithCountsRow = SessionRow & {
  song_count: number;
  exercise_count: number;
};
export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

// When creating a local session, created_by will be added by the store
export type InputLocalSession = Omit<SessionInsert, 'id' | 'created_at' | 'updated_at' | 'created_by'> & {
  created_by?: string;
  session_items?: InputLocalSessionItem[];
};

// A session that exists only locally
export type LocalSession = {
  id: string;
  created_at: string;
  updated_at: string;
  duration: number | null;
  notes: string | null;
  session_items: InputLocalSessionItem[];
};

export type SessionWithItems = SessionWithCountsRow & {
  session_items: SessionItemWithNested[];
};
