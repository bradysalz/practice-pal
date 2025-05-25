import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

// Not directly typing on the view because it null'd every field
export type SectionRow = Database['public']['Tables']['sections']['Row'];
export type SectionWithCountsRow = SectionRow & {
  exercise_count: number;
};

type SectionInsert = Database['public']['Tables']['sections']['Insert'];
type InputLocalSection = Omit<SectionInsert, 'id' | 'created_at' | 'updated_at'> & {
  book_id: string;
};

function toSectionInsert(section: SectionWithCountsRow): SectionInsert {
  const { exercise_count, ...sectionInsert } = section;
  return sectionInsert;
}

type SectionsState = {
  sections: SectionWithCountsRow[];
  addSectionLocal: (section: InputLocalSection) => string;
  syncAddSection: (tempId: string) => Promise<void>;
  fetchSections: () => Promise<void>;
};

export const useSectionsStore = create<SectionsState>((set, get) => ({
  sections: [],

  fetchSections: async () => {
    const { data, error } = await supabase.from('section_with_counts').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sections: data as SectionWithCountsRow[] });
  },

  addSectionLocal: (section) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSection: SectionWithCountsRow = {
      ...section,
      id,
      created_at: now,
      updated_at: now,
      exercise_count: 0, // lazy fill the view field, will drop later
    };
    set((state) => ({ sections: [...state.sections, newSection] }));
    return id;
  },

  syncAddSection: async (id) => {
    const localSection = get().sections.find((s) => s.id === id);
    if (!localSection) return;

    const cleanSection = toSectionInsert(localSection);
    const { data, error } = await supabase.from('sections').insert(cleanSection).select().single();

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
