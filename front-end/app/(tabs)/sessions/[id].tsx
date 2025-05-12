import { CardWithAccent } from '@/components/card-with-accent';
import { ThemedIcon } from '@/components/themed-icon';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Clock, Dumbbell, Music } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

// Mock data for demonstration - in a real app, you'd fetch this based on the ID
const practiceSessionsData = {
  '1': {
    id: '1',
    date: new Date('2024-05-09'),
    exercises: [
      {
        id: 'ex1',
        name: 'Paradiddles',
        tempo: 120,
        duration: 15,
        notes: 'Focused on keeping consistent dynamics between left and right hand',
      },
      {
        id: 'ex2',
        name: 'Single Stroke Roll',
        tempo: 100,
        duration: 10,
        notes: 'Worked on speed and endurance',
      },
      {
        id: 'ex3',
        name: 'Double Stroke Roll',
        tempo: 90,
        duration: 10,
        notes: 'Practiced with accent patterns',
      },
    ],
    songs: [
      {
        id: 's1',
        name: 'Back in Black',
        artist: 'AC/DC',
        tempo: 96,
        duration: 20,
        notes: 'Focused on the intro fill and keeping steady time',
      },
      {
        id: 's2',
        name: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        tempo: 116,
        duration: 15,
        notes: 'Worked on the verse groove and dynamics',
      },
    ],
    totalDuration: 70,
    notes: 'Great session today! Made progress on paradiddles at higher tempos.',
  },
  '2': {
    id: '2',
    date: new Date('2024-05-08'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 110, duration: 10, notes: '' },
      { id: 'ex4', name: 'Flams', tempo: 85, duration: 15, notes: 'Worked on spacing' },
    ],
    songs: [
      {
        id: 's3',
        name: 'Enter Sandman',
        artist: 'Metallica',
        tempo: 123,
        duration: 25,
        notes: 'Focused on the intro and verse groove',
      },
    ],
    totalDuration: 50,
    notes: 'Shorter session but productive work on flams.',
  },
};

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
                <Dumbbell size={20} className="mr-2 text-red-500" />
                <ThemedIcon
                  name="Dumbbell"
                  size={20}
                  color="text-red-500"
                  style={{ marginRight: 2 }}
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
                <Music size={20} className="mr-2 text-slate-500" />
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
