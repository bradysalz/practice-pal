import { HighlightBar } from '@/components/shared/HighlightBar';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { Separator } from '@/components/shared/Separator';
import { Progress } from '@/components/ui/progress';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { SectionStat, useStatStore } from '@/stores/stat-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

export default function SectionDetailPage() {
  const router = useRouter();
  const { bookId, sectionId } = useLocalSearchParams<{ bookId: string; sectionId: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercises = useExercisesStore((state) => state.exercises);
  const fetchExercisesBySection = useExercisesStore((state) => state.fetchExercisesBySection);

  const fetchSectionStats = useStatStore((state) => state.fetchSectionStatsBySectionId);
  const sectionStats = useStatStore((state) => state.sectionStats);

  // only really need to fetch exercises since we already fetched the rest to get here
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        await fetchExercisesBySection(sectionId);
        await fetchSectionStats(sectionId);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, [fetchExercisesBySection, sectionId, fetchSectionStats]);

  const book = books.find((b) => b.id === bookId);
  const section = sections.find((s) => s.id === sectionId);

  const sectionStat: SectionStat = sectionStats[sectionId] || {
    section_id: sectionId,
    goal_reached_exercises: 0,
    played_exercises: 0,
    total_exercises: 1,
  };

  const playedProgress = Math.floor((sectionStat.played_exercises || 0) / (sectionStat.total_exercises || 1) * 100);
  const goalProgress = Math.floor((sectionStat.goal_reached_exercises || 0) / (sectionStat.total_exercises || 1) * 100);


  if (!book) return <Text>Book not found</Text>;
  if (!section) return <Text>Section not found</Text>;



  const handleExercisePress = (exerciseId: string) => {
    router.push(`/library-detail/book/${bookId}/section/${sectionId}/exercise/${exerciseId}`);
  };

  return (
    <View className="flex-1 p-4">
      <View className="gap-y-4 mb-4">
        <HighlightBar type="book" name={book.name} />
        <HighlightBar type="section" name={section.name} />
      </View>

      <Pressable onPress={() => router.push(`/stat-detail/section/${sectionId}`)}>
        <View className="flex-col gap-y-2">
          <View className="flex-row items-end gap-x-2">
            <View className="w-32">
              <Text className="text-lg">{playedProgress.toString()}% Played</Text>
            </View>
            <View className="flex-1">
              <Progress
                value={playedProgress}
                className="bg-slate-300 mb-2"
                indicatorClassName="bg-red-400"
              />
            </View>
          </View>
          <View className="flex-row items-end gap-x-2">
            <View className="w-32">
              <Text className="text-lg">{goalProgress.toString()}% Goal Beat</Text>
            </View>
            <View className="flex-1">
              <Progress
                value={goalProgress}
                className="bg-slate-300 mb-2"
                indicatorClassName="bg-red-400"
              />
            </View>
          </View>
          <Text className="text-xl text-blue-500">See more stats</Text>
        </View>
      </Pressable>

      <Separator color="slate" />
      <Text className="text-2xl font-semibold my-4">Exercises</Text>


      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView className="rounded-lg">
          {exercises[sectionId]?.map((exercise) => (
            <ListItemCard
              key={exercise.created_at}
              title={`${exercise.name}`}
              isAdded={false}
              onPress={() => handleExercisePress(exercise.id)}
              className="mb-4"
              rightElement={<ChevronRight size={20} className="text-slate-500" />}
            />
          ))}
        </ScrollView>
      )}
    </View>

  );
}
