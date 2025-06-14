import { SessionDetailCardWrapper } from '@/components/sessions/SessionDetailCardWrapper';
import { Separator } from '@/components/ui/separator';
import { SessionItemWithNested } from '@/types/session';
import { ExerciseWithSession, groupExercisesByBookAndSectionWithSession } from '@/utils/session';

import { Text, View } from 'react-native';

function ExerciseAtTempoRow({ exercise }: { exercise: ExerciseWithSession }) {
  const tempo = exercise.session.tempo ?? null;
  const goal = exercise.goal_tempo ?? null;
  const notes = exercise.session.notes ?? null;
  const showStar = tempo != null && goal != null && tempo >= goal;

  // TODO: maybe move to ThemedIcon
  return (
    <View key={`${exercise.id}-${exercise.session.id}`} className="pl-4 gap-y-1">
      <View className="flex-row items-center">
        <Text className="text-base">
          • Ex. {exercise.name} ({exercise.session.tempo ?? '-'} bpm)
        </Text>
        {showStar && (
          <Text className="ml-1 text-yellow-500" accessibilityLabel="Met goal tempo">
            ⭐️
          </Text>
        )}
      </View>

      {notes && (
        <Text className="pl-3 pb-2 text-slate-500" accessibilityLabel="Notes">
          {notes}
        </Text>
      )}
    </View>
  );
}

export function ExerciseDetailCard({ items }: { items: SessionItemWithNested[] }) {
  const exercises = items.filter((i) => i.type === 'exercise' && i.exercise);
  const bookOrderedItems = groupExercisesByBookAndSectionWithSession(exercises);

  if (bookOrderedItems.length === 0) return null;
  return (
    <SessionDetailCardWrapper title="Exercises" iconName="Dumbbell" accentColor="orange-500">
      {bookOrderedItems.map((book, bookIndex) => (
        <View key={book.id} className="gap-y-4">
          <Text className="text-lg font-bold">{book.name}</Text>

          {book.sections.map((section) => (
            <View key={section.id} className="pl-2 gap-y-2">
              <Text className="text-lg font-semibold">{section.name}</Text>

              {section.exercises.map((exercise) => (
                <ExerciseAtTempoRow
                  key={`${exercise.id}-${exercise.session.id}`}
                  exercise={exercise}
                />
              ))}
            </View>
          ))}

          {bookIndex < bookOrderedItems.length - 1 && <Separator className="my-4" />}
        </View>
      ))}
    </SessionDetailCardWrapper>
  );
}
