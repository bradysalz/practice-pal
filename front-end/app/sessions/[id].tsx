import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dumbbell,
  Music,
  Clock,
  ArrowLeft,
  Home,
  BookOpen,
  Drum,
  BarChart,
} from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Mock data for demonstration - in a real app, you'd fetch this based on the ID
const sessionsData = {
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

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams();
  const session = sessionsData[id as keyof typeof sessionsData];

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-6">
        <Text className="text-2xl font-bold mb-4">Session not found</Text>
        <Link href="/recent-sessions" asChild>
          <Button>
            <ArrowLeft size={16} className="mr-2" />
            Back to Recent Sessions
          </Button>
        </Link>
      </View>
    );
  }

  const formattedDate = format(session.date, 'EEEE, MMMM d, yyyy');

  return (
    <View className="flex-1 bg-slate-50/50 px-4 py-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mb-6">
          <Link
            href="/recent-sessions"
            className="flex-row items-center text-sm text-slate-500 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            <Text>Back to Recent Sessions</Text>
          </Link>
          <Text className="text-2xl font-bold">{formattedDate}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} className="mr-1 text-slate-500" />
            <Text className="text-sm text-slate-500">{session.totalDuration} mins</Text>
          </View>
        </View>

        {/* Exercises */}
        {session.exercises?.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-red-500 rounded-xl bg-white">
            <CardHeader className="pb-2">
              <View className="flex-row items-center">
                <Dumbbell size={20} className="mr-2 text-red-500" />
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
          </Card>
        )}

        {/* Songs */}
        {session.songs?.length > 0 && (
          <Card className="mb-4 border-l-4 border-l-slate-500 rounded-xl bg-white">
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
          </Card>
        )}

        {/* Notes */}
        {session.notes && (
          <Card className="mb-4 border-l-4 border-l-slate-300 rounded-xl bg-white">
            <CardHeader className="pb-2">
              <Text className="text-lg font-semibold">Session Notes</Text>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-slate-700">{session.notes}</Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <View className="flex-row justify-around py-2">
          {[
            { href: '/recent-sessions', icon: Home, label: 'Home', color: 'text-red-500' },
            { href: '/library', icon: BookOpen, label: 'Library' },
            { href: '/create-session', icon: Drum, label: 'Practice' },
            { href: '/stats', icon: BarChart, label: 'Stats' },
          ].map(({ href, icon: Icon, label, color = 'text-slate-500' }) => (
            <Link key={href} href={href} className="flex-col items-center p-2">
              <View className="h-6 w-6 flex items-center justify-center">
                <Icon size={20} className={color} />
              </View>
              <Text className={`text-xs mt-1 ${color}`}>{label}</Text>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}
