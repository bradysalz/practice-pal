import { Card, CardHeader } from '@/components/ui/card';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight, Dumbbell } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function SectionDetailPage() {
  const router = useRouter();
  const { bookId, sectionId } = useLocalSearchParams<{ bookId: string; sectionId: string }>();

  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercises = useExercisesStore((state) => state.exercises);
  const fetchExercisesBySection = useExercisesStore((state) => state.fetchExercisesBySection);

  // only really need to fetch exercises since we already fetched the rest to get here
  useEffect(() => {
    fetchExercisesBySection(sectionId);
  }, [fetchExercisesBySection, sectionId]);

  console.log(exercises);
  const book = books.find((b) => b.id === bookId);
  const section = sections.find((s) => s.id === sectionId);

  if (!book) return <Text>Book not found</Text>;
  if (!section) return <Text>Section not found</Text>;

  const handleExercisePress = (exerciseId: string) => {
    router.push(`/book/${bookId}/section/${sectionId}/exercise/${exerciseId}`);
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-4">
      <Text className="text-2xl font-bold mb-4">{book.name}</Text>
      <Text className="text-2xl font-bold mb-4">{section.name}</Text>

      {exercises.map((exercise) => (
        <Pressable
          key={exercise.id}
          onPress={() => handleExercisePress(exercise.id)}
          className="active:opacity-70"
        >
          <Card className="hover:shadow-sm">
            <CardHeader className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2">
                <Dumbbell size={20} />
                <Text className="text-lg font-medium">({exercise.sort_position})</Text>
                <Text className="text-lg font-medium">Exercise {exercise.name}</Text>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </CardHeader>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
