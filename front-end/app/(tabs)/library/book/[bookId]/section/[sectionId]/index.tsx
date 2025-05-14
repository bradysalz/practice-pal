import { Card, CardHeader } from '@/components/ui/card';
import { bookData } from '@/mock/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight, Dumbbell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function SectionDetailPage() {
  const router = useRouter();
  const { bookId, sectionId } = useLocalSearchParams<{ bookId: string; sectionId: string }>();

  const book = bookData.find((s) => s.id === bookId);
  if (!book) return <Text>Section not found</Text>;

  const section = book.sections.find((s) => s.id === Number(sectionId));
  if (!section) return <Text>Section not found</Text>;

  const handleExercisePress = (exerciseId: number) => {
    router.push(`/book/${bookId}/section/${sectionId}/exercise/${exerciseId}`);
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-4">
      <Text className="text-2xl font-bold mb-4">{section.name}</Text>

      {Array.from({ length: section.exercises }, (_, idx) => (
        <Pressable
          key={idx}
          onPress={() => handleExercisePress(idx + 1)}
          className="active:opacity-70"
        >
          <Card className="hover:shadow-sm">
            <CardHeader className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2">
                <Dumbbell size={20} />
                <Text className="text-lg font-medium">Exercise {idx + 1}</Text>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </CardHeader>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
