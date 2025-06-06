import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type InputLocalExercise = Omit<ExerciseInsert, 'id' | 'created_at' | 'updated_at'> & {
  section_id: string;
};

type ExercisesState = {
  exercises: Record<string, ExerciseRow[]>;
  addExerciseLocal: (exercise: InputLocalExercise) => string;
  syncAddExercise: (tempId: string) => Promise<{ error: PostgrestError | null }>;
  updateExerciseLocal: (id: string, updates: Partial<ExerciseRow>) => void;
  syncUpdateExercise: (id: string) => Promise<{ error: PostgrestError | null }>;
  fetchExercisesBySection: (section_id: string, force?: boolean) => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercises: {},

  fetchExercisesBySection: async (section_id, force = false) => {
    // If not forced and we already have the data, return early
    if (!force && get().exercises[section_id]?.length > 0) {
      return;
    }

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('section_id', section_id);

    if (error) {
      console.error('Fetch failed', error);
      return;
    }

    set((state) => ({
      exercises: {
        ...state.exercises,
        [section_id]: data as ExerciseRow[],
      },
    }));
  },

  updateExerciseLocal: (id, updates) => {
    set((state) => {
      const newExercises = { ...state.exercises };

      // Find the section containing this exercise
      for (const [sectionId, exercises] of Object.entries(state.exercises)) {
        const exerciseIndex = exercises.findIndex(e => e.id === id);
        if (exerciseIndex !== -1) {
          newExercises[sectionId] = exercises.map((e) =>
            e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
          );
          break;
        }
      }

      return { exercises: newExercises };
    });
  },

  syncUpdateExercise: async (id) => {
    let exercise: ExerciseRow | undefined;

    // Find the exercise in any section
    for (const exercises of Object.values(get().exercises)) {
      exercise = exercises.find(e => e.id === id);
      if (exercise) break;
    }

    if (!exercise) return { error: null };

    const { id: _, created_at, ...updatePayload } = exercise;

    const { error } = await supabase.from('exercises').update(updatePayload).eq('id', id);

    if (error) {
      console.error('Failed to sync exercise update:', error);
      return { error };
    }

    return { error: null };
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

    set((state) => ({
      exercises: {
        ...state.exercises,
        [exercise.section_id]: [
          ...(state.exercises[exercise.section_id] || []),
          newExercise,
        ],
      },
    }));
    return id;
  },

  syncAddExercise: async (id) => {
    let localExercise: ExerciseRow | undefined;
    let sectionId: string | undefined;

    // Find the exercise and its section
    for (const [section, exercises] of Object.entries(get().exercises)) {
      localExercise = exercises.find(e => e.id === id);
      if (localExercise) {
        sectionId = section;
        break;
      }
    }

    if (!localExercise || !sectionId) return { error: null };

    const { data, error } = await supabase
      .from('exercises')
      .insert(localExercise)
      .select()
      .single();

    if (error) {
      console.error('Sync failed', error);
      return { error: error as PostgrestError };
    }

    set((state) => ({
      exercises: {
        ...state.exercises,
        [sectionId!]: state.exercises[sectionId!].map((e) =>
          e.id === id ? data : e
        ),
      },
    }));

    return { error: null } as { error: null };
  },
}));
