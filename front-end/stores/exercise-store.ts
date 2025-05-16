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
  fetchExercises: () => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercises: [],

  fetchExercises: async () => {
    const { data, error } = await supabase.from('exercises').select('*');
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
      created_at: now,
      updated_at: now,
      name: exercise.name ?? null,
      filepath: exercise.filepath ?? null,
      goal_tempo: exercise.goal_tempo ?? null,
      exercise: exercise.exercise ?? null,
      ...exercise,
    };
    set((state) => ({ exercises: [...state.exercises, newExercise] }));
    return id;
  },

  syncAddExercise: async (id) => {
    const localExercise = get().exercises.find((s) => s.id === id);
    if (!localExercise) return;

    const { data, error } = await supabase
      .from('exercises')
      .insert(localExercise)
      .select()
      .single();

    if (error) {
      console.error('Sync failed', error);
      // Optional: mark sync failure, revert, etc.
    } else {
      set((state) => ({
        exercises: state.exercises.map((s) => (s.id === id ? data : s)),
      }));
    }
  },
}));
