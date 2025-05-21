import { PracticeSessionSummaryCard } from '@/components/sessions/PracticeSessionSummaryCard';
import { useSessionsStore } from '@/stores/session-store';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function RecentSessionsPage() {
  const fetchRecentSessionsWithItems = useSessionsStore(
    (state) => state.fetchRecentSessionsWithItems
  );

  useEffect(() => {
    fetchRecentSessionsWithItems(10);
  }, [fetchRecentSessionsWithItems]);

  const sessionsWithItems = useSessionsStore((state) => state.sessionsWithItems);

  return (
    <View className="flex-1 bg-white items-center">
      <ScrollView className="w-full max-w-md px-4 mt-6 space-y-4 mb-24">
        {sessionsWithItems.map((session) => (
          <PracticeSessionSummaryCard key={session.id} session={session} />
        ))}
      </ScrollView>

      <View className="absolute bottom-4 w-full max-w-md px-4">
        <Pressable
          className="flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80"
          onPress={() => router.push('/sessions/make-session')}
        >
          <Plus size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">Start Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
