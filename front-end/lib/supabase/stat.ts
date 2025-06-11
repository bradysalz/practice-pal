import { supabase } from '@/lib/supabase';


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
