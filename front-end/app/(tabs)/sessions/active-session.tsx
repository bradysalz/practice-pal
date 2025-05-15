import { SessionItemCard } from '@/components/sessions/SessionItemCards';
import { router } from 'expo-router';
import { Pause, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const sessionItems = [
  {
    id: '1',
    name: 'Single Stroke Roll',
    source: 'Stick Control / Single Stroke Exercises',
    tempo: 120,
  },
  { id: '2', name: 'Paradiddle Groove', source: 'Syncopation / Paradiddle Variations', tempo: 100 },
  // XXX: link to your real session items
];

export default function ActiveSessionPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [tempos, setTempos] = useState<Record<string, string>>(
    Object.fromEntries(sessionItems.map((item) => [item.id, item.tempo.toString()]))
  );

  return (
    <View className="flex-1 bg-white items-center">
      {/* Header Timer */}
      <View className="w-full max-w-md px-4 py-4 flex-row justify-between items-center">
        <Text className="text-xl font-bold">Practice Session</Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-xl font-mono">00:03:12</Text>
          <Pressable
            className="p-2 bg-slate-200 rounded-md active:opacity-80"
            onPress={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </Pressable>
        </View>
      </View>

      {/* Session Items */}
      <ScrollView className="w-full max-w-md px-4 mb-24 space-y-4">
        {sessionItems.map((item) => (
          <SessionItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            source={item.source}
            tempo={tempos[item.id]}
            onTempoChange={(text) => setTempos((prev) => ({ ...prev, [item.id]: text }))}
          />
        ))}
      </ScrollView>

      {/* Floating End Session Button */}
      <View className="absolute bottom-4 w-full max-w-md px-4">
        <Pressable
          className="w-full py-4 bg-red-500 rounded-xl shadow-md active:opacity-80"
          onPress={() => router.push('/sessions')}
        >
          <Text className="text-white text-center text-lg font-semibold">End Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
