import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { ExerciseDetailCard } from '@/components/sessions/ExerciseDetailCard';
import { SongDetailCard } from '@/components/sessions/SongDetailCard';
import { Text } from '@/components/ui/text';
import { useSessionsStore } from '@/stores/session-store';
import { formatTimestampToDate, formatToMinutes } from '@/utils/date-time';
import { groupItems } from '@/utils/filter';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

export default function PracticeSessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchSessionDetail = useSessionsStore((state) => state.fetchSessionDetail);

  useEffect(() => {
    fetchSessionDetail(id);
  }, [fetchSessionDetail, id]);

  const session = useSessionsStore((state) => state.sessionDetailMap)[id];

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text variant="title-2xl" className="mb-4">
          Session not found
        </Text>
      </View>
    );
  }

  const { exercises, songs } = groupItems(session.session_items);

  return (
    <>
      {/* Header */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex-row items-center justify-between w-full pr-4">
              <Text variant="title-2xl">{formatTimestampToDate(session.created_at)}</Text>
              <View className="flex-row items-center">
                <ThemedIcon name="Clock" style={{ marginRight: 6 }} />
                {/* TODO: use a smaller font size */}
                <Text variant="title-xl">{formatToMinutes(session.duration!)} min</Text>
              </View>
            </View>
          ),
        }}
      />
      {/* Content */}
      <SafeAreaView className="flex-1 p-4">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <ExerciseDetailCard items={exercises} />
          <SongDetailCard items={songs} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
