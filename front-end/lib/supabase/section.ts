import { EditableSection } from '@/app/library-forms/edit-book/[bookId]';
import { supabase } from '@/lib/supabase';

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

export async function updateSection(sectionId: string, updates: { name: string }) {
  return supabase
    .from("sections")
    .update(updates)
    .eq("id", sectionId);
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
