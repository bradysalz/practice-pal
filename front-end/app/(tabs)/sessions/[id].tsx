import { ThemedIcon } from '@/components/icons/themed-icon';
import { ExerciseDetailCard } from '@/components/sessions/ExerciseDetailCard';
import { NotesDetailCard } from '@/components/sessions/NotesDetailCard';
import { SongDetailCard } from '@/components/sessions/SongDetailCard';
import { formatTimestampToDate, formatToMinutes } from '@/lib/utils/date-time';
import { groupItems } from '@/lib/utils/filter';
import { useSessionsStore } from '@/stores/session-store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PracticeSessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const fetchSessionDetail = useSessionsStore((state) => state.fetchSessionDetail);

  useEffect(() => {
    fetchSessionDetail(id);
  }, [fetchSessionDetail, id]);

  const session = useSessionsStore((state) => state.sessionDetailMap)[id];

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold mb-4">Session not found</Text>
      </View>
    );
  }

  const { exercises, songs } = groupItems(session.session_items);

  return (
    <View className="flex-1 px-4 bg-slate-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between px-4">
          <Text className="text-2xl font-bold">{formatTimestampToDate(session.created_at)}</Text>
          <View className="flex-row items-center mt-1">
            <ThemedIcon name="Clock" className="mr-2" style={{ marginRight: 6 }} />
            <Text className="text-lg text-slate-700">{formatToMinutes(session.duration!)} min</Text>
          </View>
        </View>
        <ExerciseDetailCard items={exercises} />
        <SongDetailCard items={songs} />
        <NotesDetailCard notes={session.notes} />
      </ScrollView>
    </View>
  );
}
