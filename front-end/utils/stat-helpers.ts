import { BookStatRow, SectionStatRow } from '@/types/stats';

export function toBookStat(row: BookStatRow | null): BookStatRow {
  if (!row) {
    return {
      book_id: '',
      goal_reached_exercises: 0,
      played_exercises: 0,
      total_exercises: 1,
    };
  }

  return {
    book_id: row.book_id || '',
    goal_reached_exercises: row.goal_reached_exercises || 0,
    played_exercises: row.played_exercises || 0,
    total_exercises: row.total_exercises || 1,
  };
}

export function toSectionStat(row: SectionStatRow | null): SectionStatRow {
  if (!row) {
    return {
      section_id: '',
      goal_reached_exercises: 0,
      played_exercises: 0,
      total_exercises: 1,
    };
  }

  return {
    section_id: row.section_id || '',
    goal_reached_exercises: row.goal_reached_exercises || 0,
    played_exercises: row.played_exercises || 0,
    total_exercises: row.total_exercises || 1,
  };
}
