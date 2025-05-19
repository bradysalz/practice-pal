import { groupSessionItems } from '@/lib/utils/session-items';
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
    const { exercises, songs } = groupSessionItems(mockItems);

    expect(exercises.length).toBe(1);
    expect(exercises[0].exercise.name).toBe('Exercise 1');

    expect(songs.length).toBe(1);
    expect(songs[0].song.name).toBe('So What');
  });

  it('returns empty arrays when input is empty', () => {
    const { exercises, songs } = groupSessionItems([]);
    expect(exercises).toEqual([]);
    expect(songs).toEqual([]);
  });
});
