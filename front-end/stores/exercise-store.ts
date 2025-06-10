import { fetchExercisesBySection, insertExercise, updateExercise } from '@/lib/supabase/exercise';
import { LocalExercise, NewExercise } from '@/types/exercise';
import { PostgrestError } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';


type ExercisesState = {
  exercisesBySectionId: Record<string, LocalExercise[]>;
  addExerciseLocal: (exercise: NewExercise) => Promise<string>;
  syncAddExercise: (tempId: string) => Promise<{ error: PostgrestError | null }>;
  updateExerciseLocal: (id: string, updates: Partial<LocalExercise>) => void;
  syncUpdateExercise: (id: string) => Promise<{ error: PostgrestError | null }>;
  fetchExercisesBySection: (section_id: string, force?: boolean) => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercisesBySectionId: {},

  fetchExercisesBySection: async (section_id, force = false) => {
    // If not forced and we already have the data, return early
    if (!force && get().exercisesBySectionId[section_id]?.length > 0) {
      return;
    }

    const { data, error } = await fetchExercisesBySection(section_id);

    if (error) {
      console.error('Fetch failed', error);
      return;
    }

    set((state) => ({
      exercisesBySectionId: {
        ...state.exercisesBySectionId,
        [section_id]: data as LocalExercise[],
      },
    }));
  },

  updateExerciseLocal: (id, updates) => {
    set((state) => {
      const newExercises = { ...state.exercisesBySectionId };

      // Find the section containing this exercise
      for (const [sectionId, exercises] of Object.entries(state.exercisesBySectionId)) {
        const exerciseIndex = exercises.findIndex(e => e.id === id);
        if (exerciseIndex !== -1) {
          newExercises[sectionId] = exercises.map((e) =>
            e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
          );
          break;
        }
      }

      return { exercisesBySectionId: newExercises };
    });
  },

  syncUpdateExercise: async (id) => {
    let exercise: LocalExercise | undefined;

    // Find the exercise in any section
    for (const exercises of Object.values(get().exercisesBySectionId)) {
      exercise = exercises.find(e => e.id === id);
      if (exercise) break;
    }

    if (!exercise) return { error: null };

    const { id: _, created_at, ...updatePayload } = exercise;

    const { error } = await updateExercise(id, updatePayload);

    if (error) {
      console.error('Failed to sync exercise update:', error);
      return { error };
    }

    return { error: null };
  },

  addExerciseLocal: async (exercise: NewExercise) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newExercise: LocalExercise = {
      id,
      name: exercise.name ?? null,
      section_id: exercise.section_id,
      goal_tempo: exercise.goal_tempo ?? null,
      filepath: exercise.filepath ?? null,
      order: exercise.order ?? null,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      exercisesBySectionId: {
        ...state.exercisesBySectionId,
        [exercise.section_id]: [
          ...(state.exercisesBySectionId[exercise.section_id] || []),
          newExercise,
        ],
      },
    }));
    return id;
  },

  syncAddExercise: async (id) => {
    let localExercise: LocalExercise | undefined;
    let sectionId: string | undefined;

    // Find the exercise and its section
    for (const [section, exercises] of Object.entries(get().exercisesBySectionId)) {
      localExercise = exercises.find(e => e.id === id);
      if (localExercise) {
        sectionId = section;
        break;
      }
    }

    if (!localExercise || !sectionId) return { error: null };

    const { data, error } = await insertExercise(localExercise);

    if (error) {
      console.error('Sync failed', error);
      return { error: error as PostgrestError };
    }

    set((state) => ({
      exercisesBySectionId: {
        ...state.exercisesBySectionId,
        [sectionId!]: state.exercisesBySectionId[sectionId!].map((e) =>
          e.id === id ? data : e
        ),
      },
    }));

    return { error: null } as { error: null };
  },
}));
