import { EditableExercise } from '@/app/library-forms/edit-section/[sectionId]';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

export async function updateExercises(sectionId: string, updates: EditableExercise[]) {
  return supabase
    .from("exercises")
    .update(updates)
    .eq("section_id", sectionId);
}

export async function updateExercise(exerciseId: string, updates: Partial<ExerciseRow>) {
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

export async function fetchExercisesBySection(section_id: string) {
  return supabase
    .from('exercises')
    .select('*')
    .eq('section_id', section_id);
}

export async function insertExercise(exercise: ExerciseRow) {
  return supabase
    .from('exercises')
    .insert(exercise)
    .select()
    .single();
}

export async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}
