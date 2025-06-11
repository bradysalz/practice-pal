import {
  createDraftFromSetlist,
  createNewDraft,
  exerciseToDraftSetlistItem,
  setlistItemToDraftSetlistItem,
  songRowToDraftSetlistItem
} from '@/utils/draft-setlist';
import { v4 as uuidv4 } from 'uuid';
import {
  MOCK_UUID,
  mockArtist,
  mockBook,
  mockExercise,
  mockSection,
  mockSetlist,
  mockSetlistItemWithExercise,
  mockSetlistItemWithSong,
  mockSong
} from './mock-data';

// Mock uuid to return predictable values
jest.mock('uuid');
(uuidv4 as jest.Mock).mockReturnValue(MOCK_UUID);

describe('draft-setlist utils', () => {
  describe('setlistItemToDraftSetlistItem', () => {
    it('should convert a setlist song item to draft setlist item', () => {
      const result = setlistItemToDraftSetlistItem(mockSetlistItemWithSong);

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
      const result = setlistItemToDraftSetlistItem(mockSetlistItemWithExercise);

      expect(result).toEqual({
        id: '2',
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
      const result = songRowToDraftSetlistItem(mockSong, mockArtist);

      expect(result).toEqual({
        id: MOCK_UUID,
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
      const result = exerciseToDraftSetlistItem(mockExercise, mockSection, mockBook);

      expect(result).toEqual({
        id: MOCK_UUID,
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
        id: MOCK_UUID,
        name: null,
        description: null,
        items: []
      });
    });
  });

  describe('createDraftFromSetlist', () => {
    it('should convert a setlist with items to a draft setlist', () => {
      const result = createDraftFromSetlist(mockSetlist);

      expect(result).toEqual({
        id: '1',
        name: 'Test Setlist',
        description: 'Test Description',
        items: [
          {
            id: MOCK_UUID,
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
            id: MOCK_UUID,
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
