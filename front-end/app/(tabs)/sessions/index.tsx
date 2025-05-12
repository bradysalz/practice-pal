import { View, Text, ScrollView } from 'react-native';
import { ThemedIcon } from '@/components/themed-icon';
import { PracticeSessionCard } from '@/components/practice-session-card';
import { Page } from '@/components/page';

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
    // <View className="flex-1 bg-slate-50/50 px-4 py-6">
    <Page>
      {/* Header */}
      {/* <View className="flex-row items-center gap-x-3 mb-6 pb-3 border-b border-slate-200">
        <ThemedIcon name="Drum" size={24} color="red-500" style={{ marginTop: 4 }} />
        <Text className="text-2xl font-bold flex-row items-center gap-2">Recent Sessions</Text>
      </View> */}

      {/* Scrollable list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="space-y-4">
        {recentSessions.map((session) => (
          <PracticeSessionCard key={session.id} session={session} />
        ))}
      </ScrollView>
    </Page>
  );
}
