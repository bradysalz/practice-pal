import {
  refreshAndSelectBookHistory,
  refreshAndSelectBookStats,
  refreshAndSelectSectionHistory,
  refreshAndSelectSectionStats,
} from '@/lib/db/queries';
import {
  BookStatOverTimeRow,
  BookStatRow,
  SectionStatOverTimeRow,
  SectionStatRow,
} from '@/types/stats';
import { toBookStat, toSectionStat } from '@/utils/stat-helpers';
import { create } from 'zustand';

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
    const data = await refreshAndSelectBookStats(bookId);
    const row = data[0];
    if (!row) return;
    set((state) => ({
      bookStats: {
        ...state.bookStats,
        [bookId]: toBookStat(row),
      },
    }));
  },

  fetchSectionStatsBySectionId: async (sectionId: string) => {
    const data = await refreshAndSelectSectionStats(sectionId);
    const row = data[0];
    if (!row) return;
    set((state) => ({
      sectionStats: {
        ...state.sectionStats,
        [sectionId]: toSectionStat(row),
      },
    }));
  },

  fetchBookStatsOverTime: async (bookId: string) => {
    const data = await refreshAndSelectBookHistory(bookId);

    set((state) => ({
      bookStatsOverTime: {
        ...state.bookStatsOverTime,
        [bookId]: data,
      },
    }));
  },

  fetchSectionStatsOverTime: async (sectionId: string) => {
    const data = await refreshAndSelectSectionHistory(sectionId);

    set((state) => ({
      sectionStatsOverTime: {
        ...state.sectionStatsOverTime,
        [sectionId]: data,
      },
    }));
  },
}));
