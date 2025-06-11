import { supabase } from '@/lib/supabase';
import {
  BookStatOverTimeRow,
  BookStatRow,
  SectionStatOverTimeRow,
  SectionStatRow,
} from '@/types/stats';

export type BookStat = Required<
  Pick<BookStatRow, 'book_id' | 'goal_reached_exercises' | 'played_exercises' | 'total_exercises'>
>;

export type SectionStat = Required<
  Pick<
    SectionStatRow,
    'section_id' | 'goal_reached_exercises' | 'played_exercises' | 'total_exercises'
  >
>;

export type BookStatOverTime = Required<
  Pick<
    BookStatOverTimeRow,
    'at_goal' | 'book_id' | 'date' | 'percent_at_goal' | 'percent_played' | 'played' | 'total'
  >
>;

export type SectionStatOverTime = Required<
  Pick<
    SectionStatOverTimeRow,
    'at_goal' | 'section_id' | 'date' | 'percent_at_goal' | 'percent_played' | 'played' | 'total'
  >
>;

export async function fetchBookStatsByBookId(bookId: string) {
  return supabase.from('book_stats_view').select('*').eq('book_id', bookId).single();
}

export async function fetchSectionStatsBySectionId(sectionId: string) {
  return supabase.from('section_stats_view').select('*').eq('section_id', sectionId).single();
}

export async function fetchBookStatsOverTime(bookId: string) {
  return supabase.from('book_progress_history').select('*').eq('book_id', bookId);
}

export async function fetchSectionStatsOverTime(sectionId: string) {
  return supabase.from('section_progress_history').select('*').eq('section_id', sectionId);
}
