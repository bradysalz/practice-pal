import { SessionItemWithNested } from '@/types/session';
import { SetlistItemWithNested } from '@/types/setlist';

// Type for the flat result from selectSessionItemsWithNestedBySessionIds query
export type FlatSessionItemQueryResult = {
  id: string;
  session_id: string;
  tempo: number | null;
  type: string;
  song_id: string | null;
  exercise_id: string | null;
  notes: string | null;
  sort_order: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Song fields
  song_name: string | null;
  song_goal_tempo: number | null;
  // Artist fields
  artist_id: string | null;
  artist_name: string | null;
  // Exercise fields
  exercise_name: string | null;
  exercise_goal_tempo: number | null;
  exercise_filepath: string | null;
  exercise_sort_order: number | null;
  // Section fields
  section_id: string | null;
  section_name: string | null;
  section_sort_order: number | null;
  // Book fields
  book_id: string | null;
  book_name: string | null;
  book_author: string | null;
};

// Type for the flat result from selectSetlistItemsWithNestedByIds query
export type FlatSetlistItemQueryResult = {
  id: string;
  setlist_id: string;
  type: string;
  song_id: string | null;
  exercise_id: string | null;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Song fields
  song_name: string | null;
  song_goal_tempo: number | null;
  // Artist fields
  artist_id: string | null;
  artist_name: string | null;
  // Exercise fields
  exercise_name: string | null;
  exercise_goal_tempo: number | null;
  exercise_filepath: string | null;
  exercise_sort_order: number | null;
  // Section fields
  section_id: string | null;
  section_name: string | null;
  section_sort_order: number | null;
  // Book fields
  book_id: string | null;
  book_name: string | null;
  book_author: string | null;
};

/**
 * Transforms a flat session item query result into a SessionItemWithNested structure
 */
export function transformSessionItemWithNested(
  row: FlatSessionItemQueryResult
): SessionItemWithNested {
  return {
    id: row.id,
    session_id: row.session_id,
    tempo: row.tempo,
    type: row.type,
    song_id: row.song_id,
    exercise_id: row.exercise_id,
    notes: row.notes,
    sort_order: row.sort_order,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    song:
      row.song_id && row.song_name
        ? {
            id: row.song_id,
            name: row.song_name,
            goal_tempo: row.song_goal_tempo,
            artist_id: row.artist_id,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            artist:
              row.artist_id && row.artist_name
                ? {
                    id: row.artist_id,
                    name: row.artist_name,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                  }
                : null,
          }
        : null,
    exercise:
      row.exercise_id && row.exercise_name
        ? {
            id: row.exercise_id,
            name: row.exercise_name,
            section_id: row.section_id!,
            goal_tempo: row.exercise_goal_tempo,
            filepath: row.exercise_filepath,
            sort_order: row.exercise_sort_order!,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            section:
              row.section_id && row.section_name
                ? {
                    id: row.section_id,
                    name: row.section_name,
                    book_id: row.book_id!,
                    sort_order: row.section_sort_order!,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    book:
                      row.book_id && row.book_name
                        ? {
                            id: row.book_id,
                            name: row.book_name,
                            author: row.book_author,
                            created_by: row.created_by,
                            created_at: row.created_at,
                            updated_at: row.updated_at,
                          }
                        : ({} as any),
                  }
                : ({} as any),
          }
        : null,
  } as SessionItemWithNested;
}

/**
 * Transforms a flat setlist item query result into a SetlistItemWithNested structure
 */
export function transformSetlistItemWithNested(
  row: FlatSetlistItemQueryResult
): SetlistItemWithNested {
  return {
    id: row.id,
    setlist_id: row.setlist_id,
    type: row.type,
    song_id: row.song_id,
    exercise_id: row.exercise_id,
    sort_order: row.sort_order,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    song:
      row.song_id && row.song_name
        ? {
            id: row.song_id,
            name: row.song_name,
            goal_tempo: row.song_goal_tempo,
            artist_id: row.artist_id,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            artist:
              row.artist_id && row.artist_name
                ? {
                    id: row.artist_id,
                    name: row.artist_name,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                  }
                : null,
          }
        : null,
    exercise:
      row.exercise_id && row.exercise_name
        ? {
            id: row.exercise_id,
            name: row.exercise_name,
            section_id: row.section_id!,
            goal_tempo: row.exercise_goal_tempo,
            filepath: row.exercise_filepath,
            sort_order: row.exercise_sort_order!,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            section:
              row.section_id && row.section_name
                ? {
                    id: row.section_id,
                    name: row.section_name,
                    book_id: row.book_id!,
                    sort_order: row.section_sort_order!,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    book:
                      row.book_id && row.book_name
                        ? {
                            id: row.book_id,
                            name: row.book_name,
                            author: row.book_author,
                            created_by: row.created_by,
                            created_at: row.created_at,
                            updated_at: row.updated_at,
                          }
                        : null,
                  }
                : null,
          }
        : null,
  } as SetlistItemWithNested;
}
