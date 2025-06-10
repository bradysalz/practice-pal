import {
  createDraftFromSession,
  createNewDraft,
  exerciseToDraftSessionItem,
  setlistItemToDraftSessionItem,
  songRowToDraftSessionItem
} from '@/utils/draft-session';
import { v4 as uuidv4 } from 'uuid';
import {
  MOCK_UUID,
  mockArtist,
  mockBook,
  mockExercise,
  mockSection,
  mockSession,
  mockSetlistItemWithExercise,
  mockSetlistItemWithSong,
  mockSong
} from './mock-data';

// Mock uuid to return predictable values
jest.mock('uuid');
(uuidv4 as jest.Mock).mockReturnValue(MOCK_UUID);

describe('draft-session utils', () => {
  describe('songRowToDraftSessionItem', () => {
    it('should convert a song row to draft session item with artist', () => {
      const result = songRowToDraftSessionItem(mockSong, mockArtist);

      expect(result).toEqual({
        id: MOCK_UUID,
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
      const songWithoutArtist = { ...mockSong, artist_id: '' };
      const result = songRowToDraftSessionItem(songWithoutArtist);

      expect(result).toEqual({
        id: MOCK_UUID,
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
      const exerciseWithTempo = { ...mockExercise, goal_tempo: 120 };
      const result = exerciseToDraftSessionItem(exerciseWithTempo, mockSection, mockBook);

      expect(result).toEqual({
        id: MOCK_UUID,
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
        id: MOCK_UUID,
        notes: null,
        duration: null,
        items: []
      });
    });
  });

  describe('createDraftFromSession', () => {
    it('should convert a session with items to a draft session', () => {
      const result = createDraftFromSession(mockSession);

      expect(result).toEqual({
        id: '1',
        notes: 'Test Notes',
        duration: 30,
        items: [
          {
            id: MOCK_UUID,
            type: 'song',
            notes: 'Song Notes',
            tempo: 100,
            song: {
              id: 'song1',
              name: 'So What',
              artist: {
                id: 'artist1',
                name: 'Miles Davis'
              }
            }
          },
          {
            id: MOCK_UUID,
            type: 'exercise',
            notes: 'Exercise Notes',
            tempo: 120,
            exercise: {
              id: 'ex1',
              name: 'Exercise 1',
              section: {
                id: 'sec1',
                name: 'Section 1',
                book: {
                  id: 'book1',
                  name: 'Stick Control'
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
      const result = setlistItemToDraftSessionItem(mockSetlistItemWithSong);

      expect(result).toEqual({
        id: MOCK_UUID,
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
      const result = setlistItemToDraftSessionItem(mockSetlistItemWithExercise);

      expect(result).toEqual({
        id: MOCK_UUID,
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
