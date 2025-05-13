import { CardWithAccent } from '@/components/card-with-accent';
import { ThemedIcon } from '@/components/icons/themed-icon';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { practiceSessionsData } from '@/mock/data';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

export default function PracticeSessionDetailPage() {
  const { id } = useLocalSearchParams();
  const session = practiceSessionsData[id as keyof typeof practiceSessionsData];

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold mb-4">Session not found</Text>
      </View>
    );
  }

  const formattedDate = format(session.date, 'EEEE, MMMM d, yyyy');

  return (
    <View className="flex-1 bg-slate-50/50 px-4 py-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold">{formattedDate}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} className="mr-1 text-slate-500" />
            <Text className="text-sm text-slate-500">{session.totalDuration} mins</Text>
          </View>
        </View>

        {/* Exercises */}
        {session.exercises?.length > 0 && (
          <CardWithAccent accentColor="red-500">
            <CardHeader className="pb-2">
              <View className="flex-row items-center">
                <ThemedIcon
                  name="Dumbbell"
                  size={20}
                  color="red-500"
                  className="text-red-500 mr-2"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-lg font-semibold">Exercises</Text>
              </View>
            </CardHeader>
            <CardContent className="space-y-2">
              {session.exercises.map((exercise, index) => (
                <View key={exercise.id}>
                  {index > 0 && <Separator className="mb-2" />}
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-medium">{exercise.name}</Text>
                    <View className="flex-row gap-x-3">
                      <View className="flex-row items-center">
                        <Text> {exercise.tempo} BPM </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </CardContent>
          </CardWithAccent>
        )}

        {/* Songs */}
        {session.songs?.length > 0 && (
          <CardWithAccent accentColor="slate-500">
            <CardHeader className="pb-2">
              <View className="flex-row items-center">
                <ThemedIcon
                  name="Music"
                  size={20}
                  color="slate-500"
                  className="text-slate-500 mr-2"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-lg font-semibold">Songs</Text>
              </View>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.songs.map((song, index) => (
                <View key={song.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <View className="flex-row justify-between items-start mb-1">
                    <View>
                      <Text className="font-medium">{song.name}</Text>
                      {song.artist && <Text className="text-sm text-slate-500">{song.artist}</Text>}
                    </View>
                    <View className="flex-row items-center">
                      <Text> {song.tempo} BPM </Text>
                    </View>
                  </View>
                </View>
              ))}
            </CardContent>
          </CardWithAccent>
        )}

        {/* Notes */}
        {session.notes && (
          <CardWithAccent accentColor="slate-300">
            <CardHeader className="pb-2">
              <Text className="text-lg font-semibold">Session Notes</Text>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-slate-700">{session.notes}</Text>
            </CardContent>
          </CardWithAccent>
        )}
      </ScrollView>
    </View>
  );
}
