import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { SessionItemWithNested } from '@/types/session';
import { ExerciseWithSession, groupExercisesByBookAndSectionWithSession } from '@/utils/session';
import { ExerciseBody } from '../shared/ExerciseBody';

export function ExerciseDetailCard({ items }: { items: SessionItemWithNested[] }) {
  const exercises = items.filter((i) => i.type === 'exercise' && i.exercise);
  const bookOrderedItems = groupExercisesByBookAndSectionWithSession(exercises);

  if (bookOrderedItems.length === 0) return null;

  return (
    <SessionDetailCardWrapper title="Exercises" iconName="Dumbbell" accentColor="orange-500">
      <ExerciseBody
        bookOrderedItems={bookOrderedItems}
        showTempo={true}
        showNotes={true}
        showStar={true}
        getTempo={(exercise: ExerciseWithSession) => exercise.session.tempo ?? null}
        getNotes={(exercise: ExerciseWithSession) => exercise.session.notes ?? null}
        getGoalTempo={(exercise: ExerciseWithSession) => exercise.goal_tempo ?? null}
      />
    </SessionDetailCardWrapper>
  );
}
