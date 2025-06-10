import { fetchBookStatsByBookId, fetchBookStatsOverTime, fetchSectionStatsBySectionId, fetchSectionStatsOverTime } from "@/lib/supabase/stat";
import { BookStatOverTimeRow, BookStatRow, SectionStatOverTimeRow, SectionStatRow } from "@/types/stats";
import { toBookStat, toSectionStat } from "@/utils/stat-helpers";
import { create } from "zustand";

type StatStore = {
  bookStats: Record<string, BookStatRow>;
  sectionStats: Record<string, SectionStatRow>;
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
    const { data, error } = await fetchBookStatsByBookId(bookId);

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
    const { data, error } = await fetchSectionStatsBySectionId(sectionId);

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
    const { data, error } = await fetchBookStatsOverTime(bookId);

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
    const { data, error } = await fetchSectionStatsOverTime(sectionId);

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
