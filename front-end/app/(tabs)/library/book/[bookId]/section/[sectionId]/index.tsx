import { ThemedIcon } from '@/components/icons/themed-icon';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function SectionDetailPage() {
  const router = useRouter();
  const { bookId, sectionId } = useLocalSearchParams<{ bookId: string; sectionId: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercises = useExercisesStore((state) => state.exercises);
  const fetchExercisesBySection = useExercisesStore((state) => state.fetchExercisesBySection);

  // only really need to fetch exercises since we already fetched the rest to get here
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        await fetchExercisesBySection(sectionId);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, [fetchExercisesBySection, sectionId]);

  const book = books.find((b) => b.id === bookId);
  const section = sections.find((s) => s.id === sectionId);

  if (!book) return <Text>Book not found</Text>;
  if (!section) return <Text>Section not found</Text>;

  const handleExercisePress = (exerciseId: string) => {
    router.push(`/library/book/${bookId}/section/${sectionId}/exercise/${exerciseId}`);
  };

  return (
    <View className="flex-1 p-4">
      <View className="gap-y-4 mb-4">
        <View className="flex-row items-center justify-left bg-orange-100 p-2">
          <ThemedIcon name="BookOpen" size={28} color="black" />
          <Text className="text-2xl font-bold ml-2">{book.name}</Text>
        </View>

        <View className="flex-row items-center justify-left bg-orange-100 p-2">
          <ThemedIcon name="Bookmark" size={28} color="black" />
          <Text className="text-2xl font-bold ml-2">{section.name}</Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="rounded-lg">
          {exercises[sectionId]?.map((exercise) => (
            <ListItemCard
              key={exercise.id}
              title={`${exercise.name}`}
              isAdded={false}
              onPress={() => handleExercisePress(exercise.id)}
              className="mb-4"
              rightElement={<ChevronRight size={20} className="text-slate-500" />}
            />
          ))}
        </View>
      )}
    </View>

  );
}
