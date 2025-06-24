import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export type ExerciseWithSetlist = {
  id: string;
  name: string | null;
  section: {
    id: string;
    name: string;
    book: {
      id: string;
      name: string;
    } | null;
  };
};

export type ExerciseWithSession = {
  id: string;
  name: string | null;
  goal_tempo?: number | null;
  section: {
    id: string;
    name: string;
    book: {
      id: string;
      name: string;
    } | null;
  };
  session: {
    id: string;
    tempo?: number | null;
    notes?: string | null;
  };
};

type SectionWithExercises<T> = {
  id: string;
  name: string;
  book: {
    id: string;
    name: string;
  } | null;
  exercises: T[];
};

type BookWithSections<T> = {
  id: string;
  name: string;
  sections: SectionWithExercises<T>[];
};

interface ExerciseBodyProps<T> {
  bookOrderedItems: BookWithSections<T>[];
  showTempo?: boolean;
  showNotes?: boolean;
  showStar?: boolean;
  getTempo?: (exercise: T) => number | null;
  getNotes?: (exercise: T) => string | null;
  getGoalTempo?: (exercise: T) => number | null;
}

export function ExerciseBody<T>({
  bookOrderedItems,
  showTempo = false,
  showNotes = false,
  showStar = false,
  getTempo,
  getNotes,
  getGoalTempo,
}: ExerciseBodyProps<T>) {
  if (bookOrderedItems.length === 0) return null;

  return (
    <>
      {bookOrderedItems.map((book, bookIndex) => (
        <View key={book.id} className="gap-y-1">
          <View className="flex-row items-center">
            <Text variant="title-xl">{book.name}</Text>
          </View>

          {book.sections.map((section) => (
            <View key={section.id} className="ml-6 gap-y-2 pb-4">
              <View className="flex-row items-center">
                <ThemedIcon name="Bookmark" size={20} color="black" />
                <Text variant="body" className="ml-1">
                  {section.name}
                </Text>
              </View>

              {section.exercises.map((exercise) => {
                const tempo = getTempo ? getTempo(exercise) : null;
                const notes = getNotes ? getNotes(exercise) : null;
                const goalTempo = getGoalTempo ? getGoalTempo(exercise) : null;
                const showStarIcon =
                  showStar && tempo != null && goalTempo != null && tempo >= goalTempo;

                return (
                  <View key={(exercise as any).id} className="gap-y-1 ml-12">
                    <View className="flex-row items-center">
                      <Text variant="body" className="text-lg">
                        {(exercise as any).name}
                      </Text>
                      {showTempo && tempo && (
                        <Text variant="body-semibold" className="text-lg italic">
                          {` @ ${tempo} bpm`}
                        </Text>
                      )}
                      {showStarIcon && (
                        <Text
                          variant="body"
                          className="ml-1 text-yellow-500 text-lg"
                          accessibilityLabel="Met goal tempo"
                        >
                          ⭐️
                        </Text>
                      )}
                    </View>

                    {showNotes && notes && (
                      <Text
                        variant="body"
                        className="pb-2 italic text-lg"
                        accessibilityLabel="Notes"
                      >
                        {notes}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          {bookIndex < bookOrderedItems.length - 1 && <Separator className="my-4" />}
        </View>
      ))}
    </>
  );
}
