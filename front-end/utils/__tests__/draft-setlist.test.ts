import { BookWithCountsRow } from '@/stores/book-store';
import { SectionWithCountsRow } from '@/stores/section-store';
import { ArtistRow, ExerciseRow, SongRow } from '@/types/session';
import { SetlistItemWithNested, SetlistWithItems } from '@/types/setlist';
import {
  createDraftFromSetlist,
  createNewDraft,
  exerciseToDraftSetlistItem,
  setlistItemToDraftSetlistItem,
  songRowToDraftSetlistItem
} from '@/utils/draft-setlist';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid to return predictable values
jest.mock('uuid');
const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
(uuidv4 as jest.Mock).mockReturnValue(mockUuid);

describe('draft-setlist utils', () => {
  describe('setlistItemToDraftSetlistItem', () => {
    it('should convert a setlist song item to draft setlist item', () => {
      const setlistItem: SetlistItemWithNested = {
        id: '1',
        setlist_id: '1',
        type: 'song',
        song_id: '1',
        exercise_id: null,
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        position: 1,
        song: {
          id: '1',
          name: 'Test Song',
          artist_id: '1',
          created_at: new Date().toISOString(),
          created_by: 'user1',
          updated_at: new Date().toISOString(),
          goal_tempo: null,
          artist: {
            id: '1',
            name: 'Test Artist',
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString()
          }
        },
        exercise: null
      };

      const result = setlistItemToDraftSetlistItem(setlistItem);

      expect(result).toEqual({
        id: '1',
        type: 'song',
        song: {
          id: '1',
          name: 'Test Song'
        }
      });
    });

    it('should convert a setlist exercise item to draft setlist item', () => {
      const setlistItem: SetlistItemWithNested = {
        id: '1',
        setlist_id: '1',
        type: 'exercise',
        song_id: null,
        exercise_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        position: 2,
        song: null,
        exercise: {
          id: '1',
          name: 'Test Exercise',
          section_id: '1',
          created_at: new Date().toISOString(),
          created_by: 'user1',
          updated_at: new Date().toISOString(),
          filepath: null,
          goal_tempo: null,
          sort_position: null,
          section: {
            id: '1',
            name: 'Test Section',
            book_id: '1',
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString(),
            book: {
              id: '1',
              name: 'Test Book',
              author: 'Test Author',
              created_at: new Date().toISOString(),
              created_by: 'user1',
              updated_at: new Date().toISOString(),

            }
          }
        }
      };

      const result = setlistItemToDraftSetlistItem(setlistItem);

      expect(result).toEqual({
        id: '1',
        type: 'exercise',
        exercise: {
          id: '1',
          name: 'Test Exercise',
          section: {
            id: '1',
            name: 'Test Section',
            book: {
              id: '1',
              name: 'Test Book'
            }
          }
        }
      });
    });
  });

  describe('songRowToDraftSetlistItem', () => {
    it('should convert a song row to draft setlist item with artist', () => {
      const song: SongRow = {
        id: '1',
        name: 'Test Song',
        artist_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        goal_tempo: null
      };

      const artist: ArtistRow = {
        id: '1',
        name: 'Test Artist',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString()
      };

      const result = songRowToDraftSetlistItem(song, artist);

      expect(result).toEqual({
        id: mockUuid,
        type: 'song',

        song: {
          id: '1',
          name: 'Test Song',
          artist: {
            id: '1',
            name: 'Test Artist'
          }
        }
      });
    });
  });

  describe('exerciseToDraftSetlistItem', () => {
    it('should convert exercise, section, and book to draft setlist item', () => {
      const exercise: ExerciseRow = {
        id: '1',
        name: 'Test Exercise',
        section_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        filepath: null,
        goal_tempo: null,
        sort_position: null
      };

      const section: SectionWithCountsRow = {
        id: '1',
        name: 'Test Section',
        book_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        exercise_count: 1
      };

      const book: BookWithCountsRow = {
        id: '1',
        name: 'Test Book',
        author: 'Test Author',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        exercise_count: 1,
      };

      const result = exerciseToDraftSetlistItem(exercise, section, book);

      expect(result).toEqual({
        id: mockUuid,
        type: 'exercise',
        exercise: {
          id: '1',
          name: 'Test Exercise',
          section: {
            id: '1',
            name: 'Test Section',
            book: {
              id: '1',
              name: 'Test Book'
            }
          }
        }
      });
    });
  });

  describe('createNewDraft', () => {
    it('should create a new empty draft setlist', () => {
      const result = createNewDraft();

      expect(result).toEqual({
        id: mockUuid,
        name: null,
        description: null,
        items: []
      });
    });
  });

  describe('createDraftFromSetlist', () => {
    it('should convert a setlist with items to a draft setlist', () => {
      const setlist: SetlistWithItems = {
        id: '1',
        name: 'Test Setlist',
        description: 'Test Description',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        song_count: 1,
        exercise_count: 1,
        setlist_items: [
          {
            id: '1',
            setlist_id: '1',
            type: 'song',
            song_id: '1',
            exercise_id: null,
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString(),
            position: 1,
            song: {
              id: '1',
              name: 'Test Song',
              artist_id: '1',
              created_at: new Date().toISOString(),
              created_by: 'user1',
              updated_at: new Date().toISOString(),
              goal_tempo: null,
              artist: {
                id: '1',
                name: 'Test Artist',
                created_at: new Date().toISOString(),
                created_by: 'user1',
                updated_at: new Date().toISOString()
              }
            },
            exercise: null
          },
          {
            id: '2',
            setlist_id: '1',
            type: 'exercise',
            song_id: null,
            exercise_id: '1',
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString(),
            position: 2,
            song: null,
            exercise: {
              id: '1',
              name: 'Test Exercise',
              section_id: '1',
              created_at: new Date().toISOString(),
              created_by: 'user1',
              updated_at: new Date().toISOString(),
              filepath: null,
              goal_tempo: null,
              sort_position: null,
              section: {
                id: '1',
                name: 'Test Section',
                book_id: '1',
                created_at: new Date().toISOString(),
                created_by: 'user1',
                updated_at: new Date().toISOString(),
                book: {
                  id: '1',
                  name: 'Test Book',
                  author: 'Test Author',
                  created_at: new Date().toISOString(),
                  created_by: 'user1',
                  updated_at: new Date().toISOString()
                }
              }
            }
          }
        ]
      };

      const result = createDraftFromSetlist(setlist);

      expect(result).toEqual({
        id: '1',
        name: 'Test Setlist',
        description: 'Test Description',
        items: [
          {
            id: mockUuid,
            type: 'song',
            song: {
              id: '1',
              name: 'Test Song',
              artist: {
                id: '1',
                name: 'Test Artist'
              }
            }
          },
          {
            id: mockUuid,
            type: 'exercise',
            exercise: {
              id: '1',
              name: 'Test Exercise',
              section: {
                id: '1',
                name: 'Test Section',
                book: {
                  id: '1',
                  name: 'Test Book'
                }
              }
            }
          }
        ]
      });
    });
  });
});
