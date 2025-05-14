import { PracticeSessionCard } from '@/components/practice-session-card';
import { recentSessions } from '@/mock/data';
import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function RecentSessionsPage() {
  return (
    <View className="flex-1 bg-white items-center">
      <ScrollView className="w-full max-w-md px-4 mt-6 space-y-4 mb-24">
        {recentSessions.map((session) => (
          <PracticeSessionCard key={session.id} session={session} />
        ))}
      </ScrollView>

      <View className="absolute bottom-4 w-full max-w-md px-4">
        <Pressable className="flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80">
          <Plus size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">Start Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
