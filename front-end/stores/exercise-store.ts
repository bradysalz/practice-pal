import { deleteExercise, insertExercise, updateExercise } from '@/lib/db/mutations';
import { selectExerciseById, selectExercisesBySection } from '@/lib/db/queries';
import { LocalExercise, NewExercise } from '@/types/exercise';
import { create } from 'zustand';

type ExercisesState = {
  exercisesById: Record<string, LocalExercise>;
  exercisesBySectionId: Record<string, LocalExercise[]>;
  fetchExercisesBySection: (section_id: string, force?: boolean) => Promise<void>;
  fetchExerciseById: (id: string) => Promise<void>;
  addExercise: (exercise: NewExercise) => Promise<void>;
  updateExercise: (
    id: string,
    updates: { name?: string; section_id?: string; sort_order?: number; goal_tempo?: number }
  ) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercisesById: {},
  exercisesBySectionId: {},

  fetchExercisesBySection: async (section_id, force = false) => {
    // If not forced and we already have the data, return early
    if (!force && get().exercisesBySectionId[section_id]?.length > 0) {
      return;
    }

    const data = await selectExercisesBySection(section_id);

    set((state) => ({
      exercisesBySectionId: {
        ...state.exercisesBySectionId,
        [section_id]: data,
      },
    }));
  },

  fetchExerciseById: async (id) => {
    const data = await selectExerciseById(id);

    const exercise = data[0];
    if (!exercise) return;

    set((state) => ({
      exercisesById: {
        ...state.exercisesById,
        [id]: exercise as unknown as LocalExercise,
      },

      exercisesBySectionId: {
        ...state.exercisesBySectionId,
        [exercise.section_id]: [
          ...(state.exercisesBySectionId[exercise.section_id] || []).filter(
            (e) => e.id !== exercise.id
          ),
          exercise as unknown as LocalExercise,
        ],
      },
    }));
  },

  addExercise: async (exercise: NewExercise) => {
    await insertExercise(
      exercise.name ?? '',
      exercise.section_id,
      exercise.sort_order ?? 0,
      exercise.goal_tempo ?? undefined
    );
    await get().fetchExercisesBySection(exercise.section_id, true);
  },

  updateExercise: async (
    id: string,
    updates: { name?: string; section_id?: string; sort_order?: number; goal_tempo?: number }
  ) => {
    await updateExercise(id, updates);

    // If section_id changed, we need to refetch both sections
    if (updates.section_id) {
      const oldExercise = get().exercisesById[id];
      if (oldExercise) {
        await get().fetchExercisesBySection(oldExercise.section_id, true);
      }
      await get().fetchExercisesBySection(updates.section_id, true);
    } else {
      // Otherwise just refetch the current section
      const exercise = get().exercisesById[id];
      if (exercise) {
        await get().fetchExercisesBySection(exercise.section_id, true);
      }
    }

    await get().fetchExerciseById(id);
  },

  deleteExercise: async (id: string) => {
    const exercise = get().exercisesById[id];
    if (!exercise) return;

    await deleteExercise(id);
    await get().fetchExercisesBySection(exercise.section_id, true);
  },
}));
