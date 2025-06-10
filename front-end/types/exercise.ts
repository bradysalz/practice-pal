import { Database } from '@/types/supabase';

export type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
export type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
export type LocalExercise = Omit<ExerciseRow, 'created_by'>;
export type NewExercise = Omit<LocalExercise, 'id'> & { section_id: string };
