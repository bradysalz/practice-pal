import { groupItems } from '@/utils/filter';
import { mockSessionItemWithExercise, mockSessionItemWithSong } from './mock-data';

describe('groupSessionItems', () => {
  const mockItems = [mockSessionItemWithExercise, mockSessionItemWithSong];

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
