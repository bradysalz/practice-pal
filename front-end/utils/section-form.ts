import { ExerciseNamingType, SectionFormData } from '@/types/book';

export function updateExerciseCount(
  section: SectionFormData,
  value: string,
  currentNames: string[]
): SectionFormData {
  const count = parseInt(value) || 0;
  return {
    ...section,
    exerciseCount: count,
    customExerciseNames: Array(count)
      .fill('')
      .map((_, i) => currentNames[i] || ''),
  };
}

export function updateNamingType(
  section: SectionFormData,
  type: ExerciseNamingType
): SectionFormData {
  return {
    ...section,
    exerciseNaming: type,
    customExerciseNames: type === 'custom' ? Array(section.exerciseCount).fill('') : undefined,
  };
}

export function updateCustomName(
  section: SectionFormData,
  currentNames: string[],
  index: number,
  value: string
): { names: string[]; section: SectionFormData } {
  const newNames = [...currentNames];
  newNames[index] = value;
  return {
    names: newNames,
    section: { ...section, customExerciseNames: newNames },
  };
}
