import { toBookStat, toSectionStat } from '../stat-helpers';

describe('toBookStat', () => {
  it('should handle null input', () => {
    const result = toBookStat(null);
    expect(result).toEqual({
      book_id: '',
      goal_reached_exercises: 0,
      played_exercises: 0,
      total_exercises: 1,
    });
  });

  it('should handle complete valid data', () => {
    const completeData = {
      book_id: 'book123',
      goal_reached_exercises: 3,
      played_exercises: 5,
      total_exercises: 10,
    };
    const result = toBookStat(completeData);
    expect(result).toEqual(completeData);
  });
});

describe('toSectionStat', () => {
  it('should handle null input', () => {
    const result = toSectionStat(null);
    expect(result).toEqual({
      section_id: '',
      goal_reached_exercises: 0,
      played_exercises: 0,
      total_exercises: 1,
    });
  });

  it('should handle complete valid data', () => {
    const completeData = {
      section_id: 'section123',
      goal_reached_exercises: 3,
      played_exercises: 5,
      total_exercises: 10,
    };
    const result = toSectionStat(completeData);
    expect(result).toEqual(completeData);
  });
});
