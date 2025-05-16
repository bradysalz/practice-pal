import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type SectionRow = Database['public']['Tables']['sections']['Row'];
type SectionInsert = Database['public']['Tables']['sections']['Insert'];
type InputLocalSection = Omit<SectionInsert, 'id' | 'created_at' | 'updated_at'> & {
  book_id: string;
};

type SectionsState = {
  sections: SectionRow[];
  addSectionLocal: (section: InputLocalSection) => string;
  syncAddSection: (tempId: string) => Promise<void>;
  fetchSections: () => Promise<void>;
};

export const useSectionsStore = create<SectionsState>((set, get) => ({
  sections: [],

  fetchSections: async () => {
    const { data, error } = await supabase.from('sections').select('*');
    if (error) {
      console.error('Fetch failed', error);
      return;
    }
    set({ sections: data as SectionRow[] });
  },

  addSectionLocal: (section) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newSection: SectionRow = {
      ...section,
      id,
      created_at: now,
      updated_at: now,
    };
    set((state) => ({ sections: [...state.sections, newSection] }));
    return id;
  },

  syncAddSection: async (id) => {
    const localSection = get().sections.find((s) => s.id === id);
    if (!localSection) return;

    const { data, error } = await supabase.from('sections').insert(localSection).select().single();

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
