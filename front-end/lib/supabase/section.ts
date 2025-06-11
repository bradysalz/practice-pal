import { EditableSection } from '@/app/library-forms/edit-book/[bookId]';
import { supabase } from '@/lib/supabase';
import { LocalSection, SectionInsert, SectionRow, SectionWithCountsRow } from '@/types/section';
import { getCurrentUserId } from './shared';

export function toSectionInsert(section: SectionWithCountsRow): SectionInsert {
  const { exercise_count, ...sectionInsert } = section;
  return sectionInsert;
}

export async function fetchSections() {
  return supabase.from('section_with_counts').select('*');
}

export async function insertSection(section: LocalSection) {
  const userId = await getCurrentUserId();
  return supabase
    .from('sections')
    .insert({ ...section, created_by: userId })
    .select()
    .single();
}

export async function updateSection(sectionId: string, updates: Partial<SectionRow>) {
  return supabase.from('sections').update(updates).eq('id', sectionId);
}

export async function deleteSection(id: string) {
  return supabase.from('sections').delete().eq('id', id);
}

export async function updateSections(bookId: string, updates: EditableSection[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index,
  }));

  return supabase.from('sections').update(mappedUpdates).eq('book_id', bookId);
}

export async function insertSections(bookId: string, updates: EditableSection[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index,
    book_id: bookId,
  }));

  return supabase.from('sections').insert(mappedUpdates);
}

export async function deleteSections(ids: string[]) {
  return supabase.from('sections').delete().in('id', ids);
}
