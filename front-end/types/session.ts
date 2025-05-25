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


export type SessionWithItems = SessionWithCountsRow & {
  session_items: SessionItemWithNested[];
};


// Manual create types for local sessions
export type DraftSessionItem = {
  id: string;
  type: 'exercise' | 'song';
  notes: string | null;
  tempo: number | null;

  // one of these is defined based on `type`
  exercise?: {
    id: string;
    name: string | null;
    section: {
      id: string;
      name: string;
      book: {
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

export type DraftSession = {
  id: string;
  notes: string | null;
  duration: number | null;
  items: DraftSessionItem[];
};
