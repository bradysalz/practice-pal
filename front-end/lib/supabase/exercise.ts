import { EditableExercise } from '@/app/library-forms/edit-section/[sectionId]';
import { supabase } from '@/lib/supabase';
import { ExerciseRow, LocalExercise } from '@/types/exercise';
import { getCurrentUserId } from './shared';

export async function updateExercises(sectionId: string, updates: EditableExercise[]) {
  return supabase.from('exercises').update(updates).eq('section_id', sectionId);
}

export async function updateExercise(id: string, updates: Partial<ExerciseRow>) {
  return supabase.from('exercises').update(updates).eq('id', id);
}

export async function insertExercises(sectionId: string, updates: EditableExercise[]) {
  const mappedUpdates = updates.map((update, index) => ({
    ...update,
    order: index,
    section_id: sectionId,
  }));

  return supabase.from('exercises').insert(mappedUpdates);
}

export async function deleteExercises(ids: string[]) {
  return supabase.from('exercises').delete().in('id', ids);
}

export async function fetchExerciseById(id: string) {
  return supabase.from('exercises').select('*').eq('id', id).single();
}

export async function fetchExercisesBySection(section_id: string) {
  return supabase.from('exercises').select('*').eq('section_id', section_id);
}

export async function insertExercise(exercise: LocalExercise) {
  const userId = await getCurrentUserId();

  return supabase
    .from('exercises')
    .insert({ ...exercise, created_by: userId })
    .select()
    .single();
}

export async function deleteExercise(id: string) {
  return supabase.from('exercises').delete().eq('id', id);
}
