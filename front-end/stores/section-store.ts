import { fetchSections, insertSection } from '@/lib/supabase/section';
import { getCurrentUserId } from '@/lib/supabase/shared';
import { NewSection, SectionWithCountsRow } from '@/types/section';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

interface SectionsState {
  sections: SectionWithCountsRow[];
  addSectionLocal: (section: NewSection) => Promise<string>;
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

  addSectionLocal: async (section: NewSection) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const newSection: SectionWithCountsRow = {
      ...section,
      id,
      created_at: now,
      updated_at: now,
      created_by: userId,
      exercise_count: 0, // lazy fill the view field, will drop later
    };
    set((state) => ({ sections: [...state.sections, newSection] }));
    return id;
  },

  syncAddSection: async (id) => {
    const localSection = get().sections.find((s) => s.id === id);
    if (!localSection) return;

    const { data, error } = await insertSection(localSection);

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
