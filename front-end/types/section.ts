import { Database } from '@/types/supabase';
import { NonNullableFields } from '@/types/util';

export type SectionRow = Database['public']['Tables']['sections']['Row'];
type SectionWithCountsPrivate = Database['public']['Views']['section_with_counts']['Row'];
export type SectionWithCountsRow = NonNullableFields<SectionWithCountsPrivate>;

export type SectionInsert = Database['public']['Tables']['sections']['Insert'];
export type LocalSection = Omit<SectionInsert, 'created_by'> & {
  book_id: string;
};
export type NewSection = Omit<LocalSection, 'id'>;
