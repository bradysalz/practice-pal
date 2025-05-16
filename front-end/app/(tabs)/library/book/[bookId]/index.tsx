import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { SectionCard } from '@/components/library/SectionCard';
import { useBooksStore } from '@/stores/book-store';
import { useSectionsStore } from '@/stores/section-store';
import { useEffect } from 'react';

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

  if (!book) return <NotFound />;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <View className="flex-row">
            <View className={`bg-${book.cover_color}-100 w-16 items-center justify-center mr-4`}>
              <BookOpen size={32} className="text-slate-700" />
            </View>
            <View className="">
              <Text className="text-2xl font-bold">{book.name}</Text>
              {/* <Text className="text-sm text-muted-foreground">by {book.author}</Text> */}
            </View>
          </View>
        </CardHeader>
        <CardContent>
          <View className="mt-4 grid grid-cols-2 gap-4">
            <StatBox label="Sections" value={sections.length} />
            <StatBox label="Exercises" value={book.exercise_count} />
          </View>
        </CardContent>
      </Card>
      <View className="space-y-4">
        {sections.map((section) => {
          return (
            <SectionCard
              key={section.id}
              sectionName={section.name}
              exercises={section.exercise_count}
              onPress={() => router.push(`library/book/${bookId}/section/${section.id}`)}
            />
          );
        })}
      </View>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View className="p-3 bg-slate-100 rounded-md items-center">
      <Text className="text-2xl font-bold">{value}</Text>
      <Text className="text-xs text-muted-foreground">{label}</Text>
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
