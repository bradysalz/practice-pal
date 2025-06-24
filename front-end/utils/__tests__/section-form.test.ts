import { SectionFormData } from '@/types/book';
import { updateCustomName, updateExerciseCount, updateNamingType } from '@/utils/section-form';

describe('section-form utils', () => {
  const baseSection: SectionFormData = {
    name: 'Sec',
    exerciseCount: 2,
    exerciseNaming: 'alpha',
    customExerciseNames: ['a', 'b'],
  };

  test('updateExerciseCount adjusts count and names', () => {
    const result = updateExerciseCount(baseSection, '3', ['a', 'b']);
    expect(result.exerciseCount).toBe(3);
    expect(result.customExerciseNames).toEqual(['a', 'b', '']);
  });

  test('updateNamingType toggles type', () => {
    const result = updateNamingType(baseSection, 'custom');
    expect(result.exerciseNaming).toBe('custom');
    expect(result.customExerciseNames?.length).toBe(2);
  });

  test('updateNamingType works with roman type', () => {
    const result = updateNamingType(baseSection, 'roman');
    expect(result.exerciseNaming).toBe('roman');
    expect(result.customExerciseNames).toBeUndefined();
  });

  test('updateCustomName updates name array and section', () => {
    const { names, section } = updateCustomName(baseSection, ['a', 'b'], 1, 'c');
    expect(names).toEqual(['a', 'c']);
    expect(section.customExerciseNames).toEqual(['a', 'c']);
  });
});
