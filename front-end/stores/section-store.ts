import { fetchSections, getCurrentUserId, InputLocalSection, insertSection, SectionWithCountsRow, toSectionInsert } from '@/lib/supabase/section';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

interface SectionsState {
  sections: SectionWithCountsRow[];
  addSectionLocal: (section: InputLocalSection) => Promise<string>;
  syncAddSection: (tempId: string) => Promise<void>;
  fetchSections: () => Promise<void>;
}

export const useSectionsStore = create<SectionsState>((set, get) => ({
  sections: [],

  fetchSections: async () => {
    const { data, error } = await fetchSections();
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sections: data as SectionWithCountsRow[] });
  },

  addSectionLocal: async (section) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const newSection: SectionWithCountsRow = {
      ...section,
      id,
      created_at: now,
      updated_at: now,
      exercise_count: 0, // lazy fill the view field, will drop later
      created_by: userId,
      name: section.name || '',
      order: section.order || 0,
    };
    set((state) => ({ sections: [...state.sections, newSection] }));
    return id;
  },

  syncAddSection: async (id) => {
    const localSection = get().sections.find((s) => s.id === id);
    if (!localSection) return;

    const cleanSection = toSectionInsert(localSection);
    const { data, error } = await insertSection(cleanSection);

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        sections: state.sections.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
