import { HighlightBar } from '@/components/shared/HighlightBar';
import ItemDetailPage from '@/components/shared/ItemDetailPage';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ExerciseDetailPage() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  // Stores
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercisesById = useExercisesStore((state) => state.exercisesById);
  const sessionItemsByExercise = useSessionItemsStore((state) => state.sessionItemsByExercise);

  // Fetch
  const fetchSessionItemByExerciseId = useSessionItemsStore(
    (state) => state.fetchSessionItemByExerciseId
  );

  // Update
  const updateExerciseLocal = useExercisesStore((state) => state.updateExerciseLocal);
  const syncUpdateExercise = useExercisesStore((state) => state.syncUpdateExercise);
  const fetchExerciseById = useExercisesStore((state) => state.fetchExerciseById);

  useEffect(() => {
    fetchExerciseById(exerciseId);
    fetchSessionItemByExerciseId(exerciseId);
  }, [fetchExerciseById, fetchSessionItemByExerciseId, exerciseId]);

  const exercise = exercisesById[exerciseId];
  const section = sections.find((s) => s.id === exercise?.section_id);
  const book = books.find((b) => b.id === section?.book_id);

  const sessionItems = sessionItemsByExercise[exerciseId] || [];

  if (!exercise) return <Text>Exercise not found</Text>;
  if (!section) return <Text>Section not found</Text>;
  if (!book) return <Text>Book not found</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="gap-y-4 mb-4">
        <HighlightBar type="book" name={book.name} />
        <HighlightBar type="section" name={section.name} />
        <HighlightBar type="exercise" name={exercise.name || ''} />
      </View>

      <ItemDetailPage
        sessionItems={sessionItems}
        itemId={exerciseId}
        initialGoalTempo={exercise.goal_tempo || null}
        onUpdateLocal={updateExerciseLocal}
        onSyncUpdate={syncUpdateExercise}
      />
    </ScrollView>
  );
}
