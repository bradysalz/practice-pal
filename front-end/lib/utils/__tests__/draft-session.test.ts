import {
  createDraftFromSession,
  createNewDraft,
  exerciseToDraftSessionItem,
  setlistItemToDraftSessionItem,
  songRowToDraftSessionItem
} from '@/lib/utils/draft-session';
import { BookWithCountsRow } from '@/stores/book-store';
import { SectionWithCountsRow } from '@/stores/section-store';
import { ArtistRow, ExerciseRow, SessionWithItems, SongRow } from '@/types/session';
import { SetlistItemWithNested } from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid to return predictable values
jest.mock('uuid');
const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
(uuidv4 as jest.Mock).mockReturnValue(mockUuid);

describe('draft-session utils', () => {
  describe('songRowToDraftSessionItem', () => {
    it('should convert a song row to draft session item with artist', () => {
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

      const result = songRowToDraftSessionItem(song, artist);

      expect(result).toEqual({
        id: mockUuid,
        type: 'song',
        notes: null,
        tempo: null,
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

    it('should convert a song row to draft session item without artist', () => {
      const song: SongRow = {
        id: '1',
        name: 'Test Song',
        artist_id: null,
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        goal_tempo: null
      };

      const result = songRowToDraftSessionItem(song);

      expect(result).toEqual({
        id: mockUuid,
        type: 'song',
        notes: null,
        tempo: null,
        song: {
          id: '1',
          name: 'Test Song'
        }
      });
    });
  });

  describe('exerciseToDraftSessionItem', () => {
    it('should convert exercise, section, and book to draft session item', () => {
      const exercise: ExerciseRow = {
        id: '1',
        name: 'Test Exercise',
        section_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        goal_tempo: 120,
        filepath: null,
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
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        exercise_count: 1,
        cover_color: null
      };

      const result = exerciseToDraftSessionItem(exercise, section, book);

      expect(result).toEqual({
        id: mockUuid,
        type: 'exercise',
        notes: null,
        tempo: 120,
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
    it('should create a new empty draft session', () => {
      const result = createNewDraft();

      expect(result).toEqual({
        id: mockUuid,
        notes: null,
        duration: null,
        items: []
      });
    });
  });

  describe('createDraftFromSession', () => {
    it('should convert a session with items to a draft session', () => {
      const session: SessionWithItems = {
        id: '1',
        notes: 'Test Notes',
        duration: 30,
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        song_count: 1,
        exercise_count: 1,
        session_items: [
          {
            id: '1',
            session_id: '1',
            type: 'song',
            song_id: '1',
            exercise_id: null,
            notes: 'Song Notes',
            tempo: 100,
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString(),
            position: 0,
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
            session_id: '1',
            type: 'exercise',
            song_id: null,
            exercise_id: '1',
            notes: 'Exercise Notes',
            tempo: 120,
            created_at: new Date().toISOString(),
            created_by: 'user1',
            updated_at: new Date().toISOString(),
            song: null,
            position: 1,
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
                  created_at: new Date().toISOString(),
                  created_by: 'user1',
                  updated_at: new Date().toISOString(),
                  cover_color: null
                }
              }
            }
          }
        ]
      };

      const result = createDraftFromSession(session);

      expect(result).toEqual({
        id: '1',
        notes: 'Test Notes',
        duration: 30,
        items: [
          {
            id: mockUuid,
            type: 'song',
            notes: 'Song Notes',
            tempo: 100,
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
            notes: 'Exercise Notes',
            tempo: 120,
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

  describe('setlistItemToDraftSessionItem', () => {
    it('should convert a setlist song item to draft session item', () => {
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

      const result = setlistItemToDraftSessionItem(setlistItem);

      expect(result).toEqual({
        id: mockUuid,
        type: 'song',
        notes: null,
        tempo: null,
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

    it('should convert a setlist exercise item to draft session item', () => {
      const setlistItem: SetlistItemWithNested = {
        id: '1',
        setlist_id: '1',
        type: 'exercise',
        song_id: null,
        exercise_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'user1',
        updated_at: new Date().toISOString(),
        position: 1,
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
              created_at: new Date().toISOString(),
              created_by: 'user1',
              updated_at: new Date().toISOString(),
              cover_color: null
            }
          }
        }
      };

      const result = setlistItemToDraftSessionItem(setlistItem);

      expect(result).toEqual({
        id: mockUuid,
        type: 'exercise',
        notes: null,
        tempo: null,
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
});
