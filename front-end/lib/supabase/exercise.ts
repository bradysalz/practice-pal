import { EditableExercise } from '@/app/library-forms/edit-section/[sectionId]';
import { supabase } from '@/lib/supabase';

export async function updateExercises(sectionId: string, updates: EditableExercise[]) {

  return supabase
    .from("exercises")
    .update(updates)
    .eq("section_id", sectionId);
}

export async function updateExercise(exerciseId: string, updates: { name: string }) {
  return supabase
    .from("exercises")
    .update(updates)
    .eq("id", exerciseId);
}

export async function insertExercises(sectionId: string, updates: EditableExercise[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index,
    section_id: sectionId
  }));

  return supabase
    .from("exercises")
    .insert(mappedUpdates);
}

export async function deleteExercises(ids: string[]) {
  return supabase
    .from("exercises")
    .delete()
    .in("id", ids);
}
