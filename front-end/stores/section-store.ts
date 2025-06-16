import { deleteSection, insertSection, updateSection } from '@/lib/db/mutations';
import { refreshAndSelectSections } from '@/lib/db/queries';
import { NewSection, SectionWithCountsRow } from '@/types/section';
import { create } from 'zustand';

interface SectionsState {
  sections: SectionWithCountsRow[];
  fetchSections: () => Promise<void>;
  addSection: (section: NewSection) => Promise<void>;
  updateSection: (
    id: string,
    updates: { name?: string; book_id?: string; sort_order?: number }
  ) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
}

export const useSectionsStore = create<SectionsState>((set, get) => ({
  sections: [],

  fetchSections: async () => {
    const sections = await refreshAndSelectSections();
    set({ sections: sections as SectionWithCountsRow[] });
  },

  addSection: async (section: NewSection) => {
    await insertSection(section.name, section.book_id, section.sort_order);
    await get().fetchSections();
  },

  updateSection: async (
    id: string,
    updates: { name?: string; book_id?: string; sort_order?: number }
  ) => {
    await updateSection(id, updates);
    await get().fetchSections();
  },

  deleteSection: async (id: string) => {
    await deleteSection(id);
    await get().fetchSections();
  },
}));
