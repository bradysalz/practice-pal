import { Database } from '@/types/supabase';

export type SectionRow = Database['public']['Tables']['sections']['Row'];
export type SectionWithCountsRow = SectionRow & {
  exercise_count: number;
};

export type SectionInsert = Database['public']['Tables']['sections']['Insert'];
export type LocalSection = Omit<SectionInsert, 'created_by'> & {
  book_id: string;
};
export type NewSection = Omit<LocalSection, 'id'>;
