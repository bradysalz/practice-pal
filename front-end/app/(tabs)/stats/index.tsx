import ItemTempoGraph from '@/components/stats/ItemTempoGraph';
import { ItemTempoPoint } from '@/types/stats';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - 20 points over a year (2 per month)
const MOCK_DATA: ItemTempoPoint[] = Array.from({ length: 40 }, (_, i) => {
  const date = new Date(2024, Math.floor(i / 2), i % 2 ? 15 : 1); // Spread 2 points per month
  return {
    timestamp: date.getTime(),
    tempo: 60 + Math.random() * i, // Random tempo between 60 and 100
  };
});

export default function StatsScreen() {
  return (
    <SafeAreaView className="bg-white p-4">
      <Text className="text-lg font-semibold">Stats</Text>
      <ItemTempoGraph data={MOCK_DATA} />
    </SafeAreaView>
  );
}
