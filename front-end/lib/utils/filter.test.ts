import { getBookAndSongNamesFromSession, groupItems } from '@/lib/utils/filter';
import { SessionItemWithNested } from '@/types/session';

describe('groupSessionItems', () => {
  const mockItems: SessionItemWithNested[] = [
    {
      id: '1',
      created_by: 'tester',
      session_id: 'session1',
      tempo: 120,
      created_at: '',
      updated_at: '',
      type: 'exercise',
      exercise_id: 'e1',
      song_id: null,
      notes: null,
      exercise: {
        id: 'e1',
        name: 'Exercise 1',
        section_id: 's1',
        created_at: '',
        updated_at: '',
        created_by: 'user1',
        goal_tempo: 130,
        filepath: null,
        sort_position: null,
        section: {
          id: 's1',
          book_id: 'b1',
          created_at: '',
          updated_at: '',
          name: 'Stickings',
          created_by: 'user1',
          book: {
            id: 'b1',
            name: 'Stick Control',
            cover_color: null,
            created_at: '',
            updated_at: '',
            created_by: 'user1',
          },
        },
      },
      song: null,
    },
    {
      id: '2',
      created_by: 'tester',
      session_id: 'session1',
      tempo: 90,
      created_at: '',
      updated_at: '',
      type: 'song',
      song_id: 's1',
      exercise_id: null,
      notes: null,
      song: {
        id: 's1',
        name: 'So What',
        artist_id: 'a1',
        created_at: '',
        updated_at: '',
        created_by: 'user1',
        goal_tempo: null,
        artist: {
          id: 'a1',
          name: 'Miles Davis',
          created_at: '',
          updated_at: '',
          created_by: 'user1',
        },
      },
      exercise: null,
    },
  ];

  it('groups session items into exercises and songs', () => {
    const { exercises, songs } = groupItems(mockItems);

    expect(exercises.length).toBe(1);
    expect(exercises[0].exercise.name).toBe('Exercise 1');

    expect(songs.length).toBe(1);
    expect(songs[0].song.name).toBe('So What');
  });

  it('returns empty arrays when input is empty', () => {
    const { exercises, songs } = groupItems([]);
    expect(exercises).toEqual([]);
    expect(songs).toEqual([]);
  });
});

describe('getBookAndSongNamesFromSession', () => {
  it('extracts unique book and song ids with names', () => {
    const mockItems: SessionItemWithNested[] = [
      {
        id: '1',
        type: 'exercise',
        session_id: 's1',
        song: null,
        created_by: 'user1',
        created_at: '',
        updated_at: '',
        exercise_id: 'ex1',
        song_id: null,
        tempo: null,
        notes: null,
        exercise: {
          id: 'ex1',
          name: 'Exercise 1',
          created_by: 'user1',
          created_at: '',
          updated_at: '',
          filepath: null,
          goal_tempo: null,
          section_id: null,
          sort_position: null,
          section: {
            id: 'sec1',
            name: 'Section 1',
            book_id: 'book1',
            created_by: 'user1',
            created_at: '',
            updated_at: '',
            book: {
              id: 'book1',
              name: 'Stick Control',

              cover_color: null,
              created_by: 'user1',
              created_at: '',
              updated_at: '',
            },
          },
        },
      },
      {
        id: '2',
        type: 'song',
        session_id: 's1',
        created_by: 'user1',
        created_at: '',
        updated_at: '',
        exercise_id: 'ex1',
        song_id: null,
        tempo: null,
        notes: null,
        song: {
          id: 'song1',
          name: 'So What',
          created_by: 'user1',
          created_at: '',
          updated_at: '',
          artist_id: 'artist1',
          goal_tempo: null,
          artist: {
            id: 'artist1',
            name: 'Miles Davis',
            created_by: 'user1',
            created_at: '',
            updated_at: '',
          },
        },
        exercise: null,
      },
      {
        id: '3',
        type: 'song',
        session_id: 's2',
        created_by: 'user1',
        created_at: '',
        updated_at: '',
        exercise_id: 'ex1',
        song_id: null,
        tempo: null,
        notes: null,
        song: {
          id: 'song1', // duplicate
          name: 'So What',
          created_by: 'user1',
          created_at: '',
          updated_at: '',
          artist_id: 'artist1',
          goal_tempo: null,
          artist: {
            id: 'artist1',
            name: 'Miles Davis',
            created_by: 'user1',
            created_at: '',
            updated_at: '',
          },
        },
        exercise: null,
      },
    ];

    const { bookMap, songMap } = getBookAndSongNamesFromSession(mockItems);

    expect(bookMap.size).toBe(1);
    expect(bookMap.get('book1')).toBe('Stick Control');

    expect(songMap.size).toBe(1);
    expect(songMap.get('song1')).toBe('So What');
  });
});
