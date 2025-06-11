import { getBookAndSongNamesFromSession } from '@/utils/session';
import { mockSessionItemWithExercise, mockSessionItemWithSong } from './mock-data';

describe('getBookAndSongNamesFromSession', () => {
  it('extracts unique book and song ids with names', () => {
    const mockItems = [
      mockSessionItemWithExercise,
      mockSessionItemWithSong,
      // Add a duplicate song item to test deduplication
      mockSessionItemWithSong
    ];

    const { bookMap, songMap } = getBookAndSongNamesFromSession(mockItems);

    expect(bookMap.size).toBe(1);
    expect(bookMap.get('book1')).toBe('Stick Control');

    expect(songMap.size).toBe(1);
    expect(songMap.get('song1')).toBe('So What');
  });
});
