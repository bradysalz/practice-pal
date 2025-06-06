import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toBookStat, toSectionStat } from "@/utils/stat-helpers";
import { create } from "zustand";


type BookStatRow = Database['public']['Views']['book_stats_view']['Row'];
type SectionStatRow = Database['public']['Views']['section_stats_view']['Row'];
type BookStatOverTimeRow = Database['public']['Views']['book_progress_history']['Row'];
type SectionStatOverTimeRow = Database['public']['Views']['section_progress_history']['Row'];

export type BookStat = Required<Pick<BookStatRow,
  'book_id' |
  'goal_reached_exercises' |
  'played_exercises' |
  'total_exercises'
>>;

export type SectionStat = Required<Pick<SectionStatRow,
  'section_id' |
  'goal_reached_exercises' |
  'played_exercises' |
  'total_exercises'
>>;

export type BookStatOverTime = Required<Pick<BookStatOverTimeRow,
  'at_goal' |
  'book_id' |
  'date' |
  'percent_at_goal' |
  'percent_played' |
  'played' |
  'total'
>>;

export type SectionStatOverTime = Required<Pick<SectionStatOverTimeRow,
  'at_goal' |
  'section_id' |
  'date' |
  'percent_at_goal' |
  'percent_played' |
  'played' |
  'total'
>>;

type StatStore = {
  bookStats: Record<string, BookStat>;
  sectionStats: Record<string, SectionStat>;
  bookStatsOverTime: Record<string, BookStatOverTimeRow[]>;
  sectionStatsOverTime: Record<string, SectionStatOverTimeRow[]>;

  fetchBookStatsByBookId: (bookId: string) => Promise<void>;
  fetchSectionStatsBySectionId: (sectionId: string) => Promise<void>;
  fetchBookStatsOverTime: (bookId: string) => Promise<void>;
  fetchSectionStatsOverTime: (sectionId: string) => Promise<void>;
};

export const useStatStore = create<StatStore>((set) => ({
  bookStats: {},
  sectionStats: {},
  bookStatsOverTime: {},
  sectionStatsOverTime: {},

  fetchBookStatsByBookId: async (bookId: string) => {
    const { data, error } = await supabase.from('book_stats_view')
      .select('*')
      .eq('book_id', bookId)
      .single();

    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set((state) => ({
      bookStats: {
        ...state.bookStats,
        [bookId]: toBookStat(data),
      },
    }));
  },

  fetchSectionStatsBySectionId: async (sectionId: string) => {
    const { data, error } = await supabase.from('section_stats_view')
      .select('*')
      .eq('section_id', sectionId)
      .single();

    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set((state) => ({
      sectionStats: {
        ...state.sectionStats,
        [sectionId]: toSectionStat(data),
      },
    }));
  },

  fetchBookStatsOverTime: async (bookId: string) => {
    const { data, error } = await supabase.from('book_progress_history')
      .select('*')
      .eq('book_id', bookId);

    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set((state) => ({
      bookStatsOverTime: {
        ...state.bookStatsOverTime,
        [bookId]: data,
      },
    }));
  },

  fetchSectionStatsOverTime: async (sectionId: string) => {
    const { data, error } = await supabase.from('section_progress_history')
      .select('*')
      .eq('section_id', sectionId);

    if (error) {
      console.error('Fetch failed', error);
      return;
    }

    set((state) => ({
      sectionStatsOverTime: {
        ...state.sectionStatsOverTime,
        [sectionId]: data,
      },
    }));
  },
}));
