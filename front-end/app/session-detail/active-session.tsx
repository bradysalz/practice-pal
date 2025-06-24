import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { ActiveSessionItemCard } from '@/components/sessions/ActiveSessionItemCard';
import { AddItemButton } from '@/components/shared/AddItemButton';
import { ActionButton } from '@/components/ui/action-button';
import { Text } from '@/components/ui/text';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSessionsStore } from '@/stores/session-store';
import {
  applyTemposToDraft,
  formatTime,
  initializeTempos,
  updateDraftItemTempo,
} from '@/utils/session-detail';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActiveSessionPage() {
  const { draftSession, updateDraftDetails } = useDraftSessionsStore();
  const { addSession } = useSessionsStore();
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tempos, setTempos] = useState<Record<string, string>>({});

  // Get the fetch functions from the store using the hook to ensure re-renders
  const fetchSessionItemBySongId = useSessionItemsStore((state) => state.fetchSessionItemBySongId);
  const fetchSessionItemByExerciseId = useSessionItemsStore(
    (state) => state.fetchSessionItemByExerciseId
  );

  // Fetch session items for each item in the draft session
  useEffect(() => {
    if (!draftSession) return;

    draftSession.items.forEach((item) => {
      if (item.type === 'song' && item.song?.id) {
        fetchSessionItemBySongId(item.song.id);
      } else if (item.type === 'exercise' && item.exercise?.id) {
        fetchSessionItemByExerciseId(item.exercise.id);
      }
    });
  }, [draftSession, fetchSessionItemBySongId, fetchSessionItemByExerciseId]);

  // Initialize tempos from session items
  useEffect(() => {
    if (!draftSession) return;
    setTempos(initializeTempos(draftSession.items));
  }, [draftSession]);

  // Timer logic
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (!isPaused) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPaused]);

  if (!draftSession) {
    router.replace('/sessions/make-session');
    return null;
  }

  // Handle tempo changes
  const handleTempoChange = (id: string, text: string) => {
    setTempos((prev) => ({ ...prev, [id]: text }));
    const updatedItems = updateDraftItemTempo(draftSession.items, id, text);
    updateDraftDetails({ items: updatedItems });
  };

  const handleEndSession = async () => {
    const finalDraft = applyTemposToDraft(draftSession, tempos, elapsedTime);

    try {
      await addSession(finalDraft);
      router.push('/sessions');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Timer */}
      <View className="w-full border-b border-slate-200">
        <View className="px-4 py-4 flex-row justify-between items-center">
          <View>
            <Text variant="title-2xl" className="font-bold">
              Let&apos;s Play!
            </Text>
            <Text variant="body" className="text-slate-700">
              {draftSession.items.length} items
            </Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <Text variant="title-3xl" className="font-mono">
              {formatTime(elapsedTime)}
            </Text>
            <Pressable
              className="p-3 bg-slate-200 rounded-full active:opacity-80"
              onPress={() => setIsPaused(!isPaused)}
            >
              {isPaused ? (
                <ThemedIcon name="Play" size={24} />
              ) : (
                <ThemedIcon name="Pause" size={24} />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Session Items */}
      <View className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 320 }}>
          {draftSession.items.map((item) => (
            <ActiveSessionItemCard key={item.id} item={item} onTempoChange={handleTempoChange} />
          ))}
        </ScrollView>
      </View>

      {/* End Session Button */}
      <View className="bg-white border-t border-slate-200 flex-row justify-between ">
        <AddItemButton
          className="mx-4 my-4 flex-1 flex-row items-center justify-center bg-slate-100 rounded-xl py-4 active:opacity-80"
          iconSize={20}
          iconColor="black"
          onPress={() => router.push('/session-detail/add-item-to-session')}
          label="Add Item"
        />
        <ActionButton
          text="End Session"
          icon={<ThemedIcon name="Check" size={20} color="white" />}
          onPress={handleEndSession}
          className="mx-4 my-4 flex-1"
          textVariant="body-semibold"
        />
      </View>
    </SafeAreaView>
  );
}
