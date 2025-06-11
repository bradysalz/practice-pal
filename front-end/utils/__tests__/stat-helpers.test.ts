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

  it('should handle partial data with nulls', () => {
    const partialData = {
      book_id: 'book123',
      goal_reached_exercises: null,
      played_exercises: 5,
      total_exercises: null,
    };
    const result = toBookStat(partialData);
    expect(result).toEqual({
      book_id: 'book123',
      goal_reached_exercises: 0,
      played_exercises: 5,
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

  it('should handle null book_id', () => {
    const data = {
      book_id: null,
      goal_reached_exercises: 3,
      played_exercises: 5,
      total_exercises: 10,
    };
    const result = toBookStat(data);
    expect(result.book_id).toBe('');
    expect(result.goal_reached_exercises).toBe(3);
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

  it('should handle partial data with nulls', () => {
    const partialData = {
      section_id: 'section123',
      goal_reached_exercises: null,
      played_exercises: 5,
      total_exercises: null,
    };
    const result = toSectionStat(partialData);
    expect(result).toEqual({
      section_id: 'section123',
      goal_reached_exercises: 0,
      played_exercises: 5,
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

  it('should handle null section_id', () => {
    const data = {
      section_id: null,
      goal_reached_exercises: 3,
      played_exercises: 5,
      total_exercises: 10,
    };
    const result = toSectionStat(data);
    expect(result.section_id).toBe('');
    expect(result.goal_reached_exercises).toBe(3);
  });
});
