import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

// Mock Data
const mockExercise = {
  id: '1',
  name: 'Quarter Note Pulse',
  goalTempo: 120,
  sessions: [
    { id: 's1', tempo: 100, duration: 10, date: '2024-05-01' },
    { id: 's2', tempo: 110, duration: 12, date: '2024-05-05' },
  ],
};

export default function ExerciseDetailPage() {
  // const { id } = useLocalSearchParams<{ id: string }>();
  const [goalTempo, setGoalTempo] = useState(String(mockExercise.goalTempo));

  const handleUpdateGoal = () => {
    // TODO: Save goalTempo to backend
    console.log(`Update goal tempo to ${goalTempo}`);
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold">{mockExercise.name}</Text>

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

      {mockExercise.sessions.length === 0 ? (
        <Text className="text-gray-500 italic">No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={mockExercise.sessions}
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
