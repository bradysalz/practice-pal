import { HighlightBar } from '@/components/shared/HighlightBar';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { StatBox } from '@/components/shared/StatBox';
import { Button } from '@/components/ui/button';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function BookDetailPage() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const fetchSections = useSectionsStore((state) => state.fetchSections);

  useEffect(() => {
    fetchBooks();
    fetchSections();
  }, [fetchBooks, fetchSections]);

  const book = useBooksStore((state) => state.books.find((book) => book.id === bookId));
  const sections = useSectionsStore((state) => state.sections);
  const usefulSections = sections.filter((section) => section.book_id === bookId);

  if (!book) return <NotFound />;

  return (
    <View className="flex-1 p-4">
      <HighlightBar type="book" name={book.name} />
      <View className="mt-4 flex-row gap-x-4 mb-4">

        <StatBox label="Sections" value={usefulSections.length} />
        <StatBox label="Exercises" value={book.exercise_count} />
      </View>
      <ScrollView className="rounded-lg">
        {usefulSections.map((section) => {
          return (
            <ListItemCard
              key={section.id}
              title={section.name || 'Untitled Section'}
              subtitle={`${section.exercise_count} exercises`}
              isAdded={false}
              onPress={() => router.push(`/library/book/${bookId}/section/${section.id}`)}
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
