import { Card, CardHeader } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

interface SectionCardProps {
  sectionName: string;
  exercises: number;
  onPress: () => void;
}

export function SectionCard({ sectionName, exercises, onPress }: SectionCardProps) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <Card className="hover:shadow-sm">
        <View className="flex-row justify-between items-center">
          <CardHeader className="pb-2">
            <Text className="text-lg font-semibold">{sectionName}</Text>
            <Text className="text-md font-medium text-slate-700">{exercises} Exercises</Text>
          </CardHeader>
          <ChevronRight size={20} className="text-muted-foreground mr-4" />
        </View>
      </Card>
    </Pressable>
  );
}
