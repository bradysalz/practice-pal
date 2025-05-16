import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type InputLocalExercise = Omit<ExerciseInsert, 'id' | 'created_at' | 'updated_at'> & {
  section_id: string;
};

type ExercisesState = {
  exercises: ExerciseRow[];
  addExerciseLocal: (exercise: InputLocalExercise) => string;
  syncAddExercise: (tempId: string) => Promise<void>;
  fetchExercisesBySection: (section_id: string) => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercises: [],

  fetchExercisesBySection: async (section_id) => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('section_id', section_id);

    if (error) {
      console.error('Fetch failed', error);
      return;
    }

    set({ exercises: data as ExerciseRow[] });
  },

  addExerciseLocal: (exercise) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newExercise: ExerciseRow = {
      id,
      created_by: exercise.created_by,
      name: exercise.name ?? null,
      section_id: exercise.section_id,
      goal_tempo: exercise.goal_tempo ?? null,
      filepath: exercise.filepath ?? null,
      sort_position: exercise.sort_position ?? null,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ exercises: [...state.exercises, newExercise] }));
    return id;
  },

  syncAddExercise: async (id) => {
    const localExercise = get().exercises.find((e) => e.id === id);
    if (!localExercise) return;

    const { data, error } = await supabase
      .from('exercises')
      .insert(localExercise)
      .select()
      .single();

    if (error) {
      console.error('Sync failed', error);
    } else {
      set((state) => ({
        exercises: state.exercises.map((e) => (e.id === id ? data : e)),
      }));
    }
  },
}));
