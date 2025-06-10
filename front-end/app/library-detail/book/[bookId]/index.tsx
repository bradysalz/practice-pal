import { HighlightBar } from '@/components/shared/HighlightBar';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { Separator } from '@/components/shared/Separator';
import { StatBox } from '@/components/shared/StatBox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { BookStat, useStatStore } from '@/stores/stat-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function BookDetailPage() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  const fetchBookStats = useStatStore((state) => state.fetchBookStatsByBookId);
  const bookStats = useStatStore((state) => state.bookStats);

  useEffect(() => {
    fetchBookStats(bookId);
  }, [fetchBookStats, bookId]);

  const book = useBooksStore((state) => state.books.find((book) => book.id === bookId));
  const sections = useSectionsStore((state) => state.sections);
  const usefulSections = sections.filter((section) => section.book_id === bookId)
    .sort((a, b) => (a.order) - (b.order));

  const bookStat: BookStat = bookStats[bookId] || {
    book_id: bookId,
    goal_reached_exercises: 0,
    played_exercises: 0,
    total_exercises: 1,
  };
  const playedProgress = Math.floor((bookStat.played_exercises || 0) / (bookStat.total_exercises || 1) * 100);
  const goalProgress = Math.floor((bookStat.goal_reached_exercises || 0) / (bookStat.total_exercises || 1) * 100);

  const handleEditBook = () => {
    router.push(`/library-forms/edit-book/${bookId}`);
  };

  if (!book) return <NotFound />;

  return (
    <View className="flex-1 p-4">
      <View className="flex-row items-center justify-between">
        <HighlightBar type="book" name={book.name} showEditIcon={true} onPressEdit={handleEditBook} />
      </View>

      <View className="mt-4 flex-row gap-x-4 mb-4">
        <StatBox label="Sections" value={usefulSections.length} />
        <StatBox label="Exercises" value={book.exercise_count} />
      </View>

      <Pressable onPress={() => router.push(`/stat-detail/book/${bookId}`)}>
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
      <Text className="text-2xl font-semibold my-4">Sections</Text>
      <ScrollView className="rounded-lg">

        {usefulSections.map((section) => {
          return (
            <ListItemCard
              key={section.id}
              title={section.name || 'Untitled Section'}
              subtitle={`${section.exercise_count} exercises`}
              isAdded={false}
              onPress={() => router.push(`/library-detail/book/${bookId}/section/${section.id}`)}
              className="mb-4"
              rightElement={<ChevronRight size={20} className="text-slate-500" />}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function NotFound() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-2xl font-bold mb-4">Book not found</Text>
      <Button onPress={() => router.push('/library')}>
        <ArrowLeft size={16} className="mr-2" />
        <Text>Back to Library</Text>
      </Button>
    </View>
  );
}
