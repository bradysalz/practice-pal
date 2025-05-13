import { PracticeSessionCard } from '@/components/practice-session-card';
import { recentSessions } from '@/mock/data';
import { ScrollView, View } from 'react-native';

export default function RecentSessionsPage() {
  return (
    <View className="flex-1 bg-white items-center">
      <ScrollView className="w-full max-w-md px-4 mt-6 space-y-4">
        {recentSessions.map((session) => (
          <PracticeSessionCard key={session.id} session={session} />
        ))}
      </ScrollView>
    </View>
  );
}
