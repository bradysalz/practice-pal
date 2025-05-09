import { View, Text, ScrollView } from 'react-native';
import { Drum, Home, BookOpen, BarChart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { PracticeSessionCard } from '@/components/practice-session-card';

// Mock data for demonstration
const recentSessions = [
  {
    id: '1',
    date: new Date('2024-05-09'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 120, duration: 15 },
      { id: 'ex2', name: 'Single Stroke Roll', tempo: 100, duration: 10 },
      { id: 'ex3', name: 'Double Stroke Roll', tempo: 90, duration: 10 },
    ],
    songs: [
      { id: 's1', name: 'Back in Black', artist: 'AC/DC', tempo: 96, duration: 20 },
      { id: 's2', name: 'Smells Like Teen Spirit', artist: 'Nirvana', tempo: 116, duration: 15 },
    ],
    totalDuration: 70,
  },
  {
    id: '2',
    date: new Date('2024-05-08'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 110, duration: 10 },
      { id: 'ex4', name: 'Flams', tempo: 85, duration: 15 },
    ],
    songs: [{ id: 's3', name: 'Enter Sandman', artist: 'Metallica', tempo: 123, duration: 25 }],
    totalDuration: 50,
  },
  {
    id: '3',
    date: new Date('2024-05-07'),
    exercises: [
      { id: 'ex5', name: 'Rudiment Combinations', tempo: 90, duration: 20 },
      { id: 'ex6', name: 'Triplet Fills', tempo: 80, duration: 15 },
    ],
    songs: [{ id: 's4', name: 'Tom Sawyer', artist: 'Rush', tempo: 88, duration: 30 }],
    totalDuration: 65,
  },
  {
    id: '4',
    date: new Date('2024-05-06'),
    exercises: [{ id: 'ex7', name: 'Ghost Notes', tempo: 95, duration: 25 }],
    songs: [
      { id: 's5', name: 'Rosanna', artist: 'Toto', tempo: 84, duration: 20 },
      { id: 's6', name: 'Superstition', artist: 'Stevie Wonder', tempo: 96, duration: 15 },
    ],
    totalDuration: 60,
  },
];

export default function RecentSessionsPage() {
  return (
    <View className="flex-1 bg-slate-50/50 px-4 py-6">
      {/* Header */}
      <View className="flex-row items-center gap-x-3 mb-6 pb-3 border-b border-slate-200">
        <Drum size={24} className="text-red-500 mt-1" />
        <Text className="text-2xl font-bold flex-row items-center gap-2">Recent Sessions</Text>
      </View>

      {/* Scrollable list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="space-y-4">
        {recentSessions.map((session) => (
          <PracticeSessionCard key={session.id} session={session} />
        ))}
      </ScrollView>

      {/* Bottom nav */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <View className="flex-row justify-around py-2">
          <Link href="/recent-sessions" className="flex-col items-center p-2">
            <View className="h-6 w-6 items-center flex justify-center ml-1">
              <Home size={20} className="text-red-500" />
            </View>
            <Text className="text-xs text-red-500 mt-1">Home</Text>
          </Link>
          <Link href="/library" className="flex-col items-center p-2">
            <View className="h-6 w-6 items-center flex justify-center ml-1">
              <BookOpen size={20} className="text-slate-500" />
            </View>
            <Text className="text-xs text-slate-500 mt-1">Library</Text>
          </Link>
          <Link href="/create-session" className="flex-col items-center p-2">
            <View className="h-6 w-6 items-center flex justify-center ml-2">
              <Drum size={20} className="text-slate-500" />
            </View>
            <Text className="text-xs text-slate-500 mt-1">Practice</Text>
          </Link>
          <Link href="/stats" className="flex-col items-center p-2">
            <View className="h-6 w-6 items-center flex justify-center">
              <BarChart size={20} className="text-slate-500" />
            </View>
            <Text className="text-xs text-slate-500 mt-1">Stats</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
