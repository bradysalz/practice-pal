import { getBookAndSongNamesFromSession } from '@/lib/utils/session';
import { SessionItemWithNested } from '@/types/session';

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
