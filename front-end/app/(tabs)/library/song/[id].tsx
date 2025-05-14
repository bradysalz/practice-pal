import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

// Mock Data
const mockSong = {
  id: 's1',
  name: 'Blue Bossa',
  goalTempo: 140,
  artist: { id: 'a1', name: 'John Doe Trio' },
  sessions: [
    { id: 'ps1', tempo: 120, duration: 15, date: '2024-05-02' },
    { id: 'ps2', tempo: 130, duration: 18, date: '2024-05-07' },
  ],
};

export default function SongDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goalTempo, setGoalTempo] = useState(String(mockSong.goalTempo));

  const handleBackToArtist = () => {
    router.push(`library/artist/${mockSong.artist.id}`);
  };

  const handleUpdateGoal = () => {
    // TODO: Save goalTempo to backend
    console.log(`Update song goal tempo to ${goalTempo}`);
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold">{mockSong.name}</Text>

      <Pressable
        onPress={handleBackToArtist}
        className="self-start px-4 py-2 bg-slate-100 rounded-md border border-slate-200 active:opacity-70 flex-row items-center space-x-2"
      >
        <Text className="text-slate-600 text-sm">View Artist: {mockSong.artist.name}</Text>
      </Pressable>

      <Card>
        <CardHeader>
          <Text className="text-lg font-medium">Goal Tempo (BPM)</Text>
        </CardHeader>
        <CardContent className="space-y-3">
          <TextInput
            value={goalTempo}
            onChangeText={setGoalTempo}
            keyboardType="numeric"
            className="border border-gray-300 rounded-md p-3 text-base"
          />
          <Button onPress={handleUpdateGoal}>Update Goal Tempo</Button>
        </CardContent>
      </Card>

      <Text className="text-xl font-semibold">Practice Sessions</Text>

      {mockSong.sessions.length === 0 ? (
        <Text className="text-gray-500 italic">No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={mockSong.sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card className="mb-3">
              <CardHeader className="flex-row justify-between items-center">
                <Text className="font-medium">{item.tempo} BPM</Text>
                <View className="flex-row items-center space-x-1">
                  <Clock size={16} className="text-gray-500" />
                  <Text className="text-gray-500 text-sm">{item.duration} min</Text>
                </View>
              </CardHeader>
              <CardContent>
                <Text className="text-sm text-gray-400">{item.date}</Text>
              </CardContent>
            </Card>
          )}
        />
      )}
    </View>
  );
}
