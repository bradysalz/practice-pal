import { EditableSection } from '@/app/library-forms/edit-book/[bookId]';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type SectionRow = Database['public']['Tables']['sections']['Row'];
export type SectionWithCountsRow = SectionRow & {
  exercise_count: number;
};

export type SectionInsert = Database['public']['Tables']['sections']['Insert'];
export type InputLocalSection = Omit<SectionInsert, 'id' | 'created_at' | 'updated_at' | 'created_by'> & {
  book_id: string;
};

export function toSectionInsert(section: SectionWithCountsRow): SectionInsert {
  const { exercise_count, ...sectionInsert } = section;
  return sectionInsert;
}

export async function fetchSections() {
  return supabase.from('section_with_counts').select('*');
}

export async function insertSection(section: SectionInsert) {
  return supabase
    .from('sections')
    .insert(section)
    .select()
    .single();
}

export async function updateSection(sectionId: string, updates: Partial<SectionRow>) {
  return supabase
    .from("sections")
    .update(updates)
    .eq("id", sectionId);
}

export async function deleteSection(id: string) {
  return supabase
    .from("sections")
    .delete()
    .eq("id", id);
}

export async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function updateSections(bookId: string, updates: EditableSection[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index
  }));

  return supabase
    .from("sections")
    .update(mappedUpdates)
    .eq("book_id", bookId);
}

export async function insertSections(bookId: string, updates: EditableSection[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index,
    book_id: bookId
  }));

  return supabase
    .from("sections")
    .insert(mappedUpdates);
}

export async function deleteSections(ids: string[]) {
  return supabase
    .from("sections")
    .delete()
    .in("id", ids);
}
