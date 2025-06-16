import {
  FlatSessionItemQueryResult,
  FlatSetlistItemQueryResult,
  transformSessionItemWithNested,
  transformSetlistItemWithNested,
} from '@/utils/nested-transformers';

describe('transformSessionItemWithNested', () => {
  const baseTimestamp = '2024-01-01T00:00:00.000Z';

  it('should transform a session item with song data', () => {
    const input: FlatSessionItemQueryResult = {
      id: 'session-item-1',
      session_id: 'session-1',
      tempo: 120,
      type: 'song',
      song_id: 'song-1',
      exercise_id: null,
      notes: 'Great performance',
      sort_order: 1,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song fields
      song_name: 'So What',
      song_goal_tempo: 140,
      // Artist fields
      artist_id: 'artist-1',
      artist_name: 'Miles Davis',
      // Exercise fields (null for song)
      exercise_name: null,
      exercise_goal_tempo: null,
      exercise_filepath: null,
      exercise_sort_order: null,
      // Section fields (null for song)
      section_id: null,
      section_name: null,
      section_sort_order: null,
      // Book fields (null for song)
      book_id: null,
      book_name: null,
      book_author: null,
    };

    const result = transformSessionItemWithNested(input);

    expect(result).toEqual({
      id: 'session-item-1',
      session_id: 'session-1',
      tempo: 120,
      type: 'song',
      song_id: 'song-1',
      exercise_id: null,
      notes: 'Great performance',
      sort_order: 1,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      song: {
        id: 'song-1',
        name: 'So What',
        goal_tempo: 140,
        artist_id: 'artist-1',
        created_by: 'user-1',
        created_at: baseTimestamp,
        updated_at: baseTimestamp,
        artist: {
          id: 'artist-1',
          name: 'Miles Davis',
          created_by: 'user-1',
          created_at: baseTimestamp,
          updated_at: baseTimestamp,
        },
      },
      exercise: null,
    });
  });

  it('should transform a session item with exercise data', () => {
    const input: FlatSessionItemQueryResult = {
      id: 'session-item-2',
      session_id: 'session-1',
      tempo: 100,
      type: 'exercise',
      song_id: null,
      exercise_id: 'exercise-1',
      notes: 'Need to work on timing',
      sort_order: 2,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song fields (null for exercise)
      song_name: null,
      song_goal_tempo: null,
      // Artist fields (null for exercise)
      artist_id: null,
      artist_name: null,
      // Exercise fields
      exercise_name: 'Single Stroke Roll',
      exercise_goal_tempo: 120,
      exercise_filepath: '/path/to/exercise.pdf',
      exercise_sort_order: 1,
      // Section fields
      section_id: 'section-1',
      section_name: 'Basic Rolls',
      section_sort_order: 1,
      // Book fields
      book_id: 'book-1',
      book_name: 'Stick Control',
      book_author: 'George Lawrence Stone',
    };

    const result = transformSessionItemWithNested(input);

    expect(result).toEqual({
      id: 'session-item-2',
      session_id: 'session-1',
      tempo: 100,
      type: 'exercise',
      song_id: null,
      exercise_id: 'exercise-1',
      notes: 'Need to work on timing',
      sort_order: 2,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      song: null,
      exercise: {
        id: 'exercise-1',
        name: 'Single Stroke Roll',
        section_id: 'section-1',
        goal_tempo: 120,
        filepath: '/path/to/exercise.pdf',
        sort_order: 1,
        created_by: 'user-1',
        created_at: baseTimestamp,
        updated_at: baseTimestamp,
        section: {
          id: 'section-1',
          name: 'Basic Rolls',
          book_id: 'book-1',
          sort_order: 1,
          created_by: 'user-1',
          created_at: baseTimestamp,
          updated_at: baseTimestamp,
          book: {
            id: 'book-1',
            name: 'Stick Control',
            author: 'George Lawrence Stone',
            created_by: 'user-1',
            created_at: baseTimestamp,
            updated_at: baseTimestamp,
          },
        },
      },
    });
  });

  it('should handle song without artist', () => {
    const input: FlatSessionItemQueryResult = {
      id: 'session-item-3',
      session_id: 'session-1',
      tempo: 110,
      type: 'song',
      song_id: 'song-2',
      exercise_id: null,
      notes: null,
      sort_order: 3,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song fields
      song_name: 'Unknown Song',
      song_goal_tempo: null,
      // Artist fields (null)
      artist_id: null,
      artist_name: null,
      // Exercise fields (null)
      exercise_name: null,
      exercise_goal_tempo: null,
      exercise_filepath: null,
      exercise_sort_order: null,
      // Section fields (null)
      section_id: null,
      section_name: null,
      section_sort_order: null,
      // Book fields (null)
      book_id: null,
      book_name: null,
      book_author: null,
    };

    const result = transformSessionItemWithNested(input);

    expect(result.song).toEqual({
      id: 'song-2',
      name: 'Unknown Song',
      goal_tempo: null,
      artist_id: null,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      artist: null,
    });
    expect(result.exercise).toBeNull();
  });

  it('should handle items with no song or exercise data', () => {
    const input: FlatSessionItemQueryResult = {
      id: 'session-item-4',
      session_id: 'session-1',
      tempo: null,
      type: 'other',
      song_id: null,
      exercise_id: null,
      notes: 'Just a note',
      sort_order: 4,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // All related fields null
      song_name: null,
      song_goal_tempo: null,
      artist_id: null,
      artist_name: null,
      exercise_name: null,
      exercise_goal_tempo: null,
      exercise_filepath: null,
      exercise_sort_order: null,
      section_id: null,
      section_name: null,
      section_sort_order: null,
      book_id: null,
      book_name: null,
      book_author: null,
    };

    const result = transformSessionItemWithNested(input);

    expect(result.song).toBeNull();
    expect(result.exercise).toBeNull();
    expect(result.id).toBe('session-item-4');
    expect(result.type).toBe('other');
  });
});

describe('transformSetlistItemWithNested', () => {
  const baseTimestamp = '2024-01-01T00:00:00.000Z';

  it('should transform a setlist item with song data', () => {
    const input: FlatSetlistItemQueryResult = {
      id: 'setlist-item-1',
      setlist_id: 'setlist-1',
      type: 'song',
      song_id: 'song-1',
      exercise_id: null,
      sort_order: 1,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song fields
      song_name: 'Blue in Green',
      song_goal_tempo: 80,
      // Artist fields
      artist_id: 'artist-2',
      artist_name: 'Bill Evans',
      // Exercise fields (null for song)
      exercise_name: null,
      exercise_goal_tempo: null,
      exercise_filepath: null,
      exercise_sort_order: null,
      // Section fields (null for song)
      section_id: null,
      section_name: null,
      section_sort_order: null,
      // Book fields (null for song)
      book_id: null,
      book_name: null,
      book_author: null,
    };

    const result = transformSetlistItemWithNested(input);

    expect(result).toEqual({
      id: 'setlist-item-1',
      setlist_id: 'setlist-1',
      type: 'song',
      song_id: 'song-1',
      exercise_id: null,
      sort_order: 1,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      song: {
        id: 'song-1',
        name: 'Blue in Green',
        goal_tempo: 80,
        artist_id: 'artist-2',
        created_by: 'user-1',
        created_at: baseTimestamp,
        updated_at: baseTimestamp,
        artist: {
          id: 'artist-2',
          name: 'Bill Evans',
          created_by: 'user-1',
          created_at: baseTimestamp,
          updated_at: baseTimestamp,
        },
      },
      exercise: null,
    });
  });

  it('should transform a setlist item with exercise data', () => {
    const input: FlatSetlistItemQueryResult = {
      id: 'setlist-item-2',
      setlist_id: 'setlist-1',
      type: 'exercise',
      song_id: null,
      exercise_id: 'exercise-2',
      sort_order: 2,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song fields (null for exercise)
      song_name: null,
      song_goal_tempo: null,
      // Artist fields (null for exercise)
      artist_id: null,
      artist_name: null,
      // Exercise fields
      exercise_name: 'Paradiddle',
      exercise_goal_tempo: 100,
      exercise_filepath: null,
      exercise_sort_order: 5,
      // Section fields
      section_id: 'section-2',
      section_name: 'Rudiments',
      section_sort_order: 2,
      // Book fields
      book_id: 'book-1',
      book_name: 'Stick Control',
      book_author: 'George Lawrence Stone',
    };

    const result = transformSetlistItemWithNested(input);

    expect(result).toEqual({
      id: 'setlist-item-2',
      setlist_id: 'setlist-1',
      type: 'exercise',
      song_id: null,
      exercise_id: 'exercise-2',
      sort_order: 2,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      song: null,
      exercise: {
        id: 'exercise-2',
        name: 'Paradiddle',
        section_id: 'section-2',
        goal_tempo: 100,
        filepath: null,
        sort_order: 5,
        created_by: 'user-1',
        created_at: baseTimestamp,
        updated_at: baseTimestamp,
        section: {
          id: 'section-2',
          name: 'Rudiments',
          book_id: 'book-1',
          sort_order: 2,
          created_by: 'user-1',
          created_at: baseTimestamp,
          updated_at: baseTimestamp,
          book: {
            id: 'book-1',
            name: 'Stick Control',
            author: 'George Lawrence Stone',
            created_by: 'user-1',
            created_at: baseTimestamp,
            updated_at: baseTimestamp,
          },
        },
      },
    });
  });

  it('should handle missing nested data gracefully', () => {
    const input: FlatSetlistItemQueryResult = {
      id: 'setlist-item-3',
      setlist_id: 'setlist-1',
      type: 'song',
      song_id: 'song-3',
      exercise_id: null,
      sort_order: 3,
      created_by: 'user-1',
      created_at: baseTimestamp,
      updated_at: baseTimestamp,
      // Song exists but no name
      song_name: null,
      song_goal_tempo: null,
      // No artist
      artist_id: null,
      artist_name: null,
      // No exercise data
      exercise_name: null,
      exercise_goal_tempo: null,
      exercise_filepath: null,
      exercise_sort_order: null,
      section_id: null,
      section_name: null,
      section_sort_order: null,
      book_id: null,
      book_name: null,
      book_author: null,
    };

    const result = transformSetlistItemWithNested(input);

    // Should be null because song_name is null
    expect(result.song).toBeNull();
    expect(result.exercise).toBeNull();
    expect(result.song_id).toBe('song-3');
  });
});
