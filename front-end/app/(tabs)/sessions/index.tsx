import { PracticeSessionSummaryCard } from '@/components/sessions/PracticeSessionSummaryCard';
import { ActionButton } from '@/components/ui/action-button';
import { useSessionsStore } from '@/stores/session-store';
import { router, useNavigation } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecentSessionsPage() {
  const fetchRecentSessionsWithItems = useSessionsStore(
    (state) => state.fetchRecentSessionsWithItems
  );
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchRecentSessionsWithItems(10);
  }, [fetchRecentSessionsWithItems]);

  const sessionsWithItems = useSessionsStore((state) => state.sessionsWithItems);

  return (
    <SafeAreaView className="flex-1  items-center">
      <ScrollView className="w-full max-w-md px-4 mt-2 space-y-4 mb-16">
        {sessionsWithItems.map((session) => (
          <PracticeSessionSummaryCard key={session.id} session={session} />
        ))}
      </ScrollView>

      <View className="absolute bottom-4 w-full max-w-md px-4 ">
        <ActionButton
          text="Start Session"
          icon={<Plus size={24} color="white" />}
          onPress={() => router.push('/sessions/make-session')}
          textVariant="title-2xl"
        />
      </View>
    </SafeAreaView>
  );
}
