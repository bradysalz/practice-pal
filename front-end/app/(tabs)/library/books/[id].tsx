import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { SectionCard } from '@/components/library/SectionCard';
import { bookData } from '@/mock/data';
export default function BookDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const book = bookData.find((b) => b.id === id);

  if (!book) return <NotFound />;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <View className="flex-row">
            <View className={`${book.coverColor} w-16 items-center justify-center mr-4`}>
              <BookOpen size={32} className="text-slate-700" />
            </View>
            <View className="">
              <Text className="text-2xl font-bold">{book.name}</Text>
              <Text className="text-sm text-muted-foreground">by {book.author}</Text>
            </View>
          </View>
        </CardHeader>
        <CardContent>
          <View className="mt-4 grid grid-cols-2 gap-4">
            <StatBox label="Sections" value={book.sections.length} />
            <StatBox
              label="Exercises"
              value={book.sections.reduce((sum, section) => sum + section.exercises, 0)}
            />
          </View>
        </CardContent>
      </Card>
      <View className="space-y-4">
        {book.sections.map((section) => {
          const sectionSlug = section.name.toLowerCase().replace(/\s+/g, '-');
          return (
            <SectionCard
              key={sectionSlug}
              sectionName={section.name}
              exercises={section.exercises}
              onPress={() => router.push(`/library/sections/${sectionSlug}`)}
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
