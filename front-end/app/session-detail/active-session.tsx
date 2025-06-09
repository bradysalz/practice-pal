import { ThemedIcon } from '@/components/icons/themed-icon';
import { ActiveSessionItemCard } from '@/components/sessions/ActiveSessionItemCard';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSessionsStore } from '@/stores/session-store';
import { DraftSessionItem } from '@/types/session';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActiveSessionPage() {
  const insets = useSafeAreaInsets();
  const { draftSession, updateDraftDetails } = useDraftSessionsStore();
  const { insertSession } = useSessionsStore();
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tempos, setTempos] = useState<Record<string, string>>({});

  // Get the fetch functions from the store using the hook to ensure re-renders
  const fetchSessionItemBySongId = useSessionItemsStore((state) => state.fetchSessionItemBySongId);
  const fetchSessionItemByExerciseId = useSessionItemsStore((state) => state.fetchSessionItemByExerciseId);

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
    const initialTempos = Object.fromEntries(
      draftSession.items.map((item) => [
        item.id,
        item.tempo?.toString() || ''
      ])
    );
    setTempos(initialTempos);
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

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle tempo changes
  const handleTempoChange = (id: string, text: string) => {
    setTempos((prev) => ({ ...prev, [id]: text }));

    const updatedItems = draftSession.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          tempo: text ? parseInt(text, 10) || null : null,
        };
      }
      return item;
    });

    updateDraftDetails({
      items: updatedItems,
    });
  };

  const handleEndSession = async () => {
    console.log('handleEndSession', draftSession);
    // Update all tempos one final time before ending
    const finalItems = draftSession.items.map((item) => {
      const currentTempo = tempos[item.id];
      return {
        ...item,
        tempo: currentTempo ? parseInt(currentTempo, 10) || null : null,
      };
    });

    const finalDraft = {
      ...draftSession,
      duration: elapsedTime,
      items: finalItems,
    };

    try {
      await insertSession(finalDraft);
      router.push('/sessions');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const getItemId = (item: DraftSessionItem): string => {
    if (item.type === 'exercise' && item.exercise) {
      return item.exercise.id;
    } else if (item.type === 'song' && item.song) {
      return item.song.id;
    }
    return '';
  };

  const getItemName = (item: DraftSessionItem) => {
    if (item.type === 'exercise' && item.exercise) {
      return item.exercise.name || 'Untitled Exercise';
    } else if (item.type === 'song' && item.song) {
      return item.song.name || 'Untitled Song';
    }
    return '';
  };

  const getItemSource = (item: DraftSessionItem) => {
    if (item.type === 'exercise' && item.exercise) {
      return item.exercise.section
        ? `${item.exercise.section.book?.name || ''} / ${item.exercise.section.name}`
        : 'Exercise';
    } else if (item.type === 'song' && item.song) {
      return item.song.artist?.name || 'Song';
    }
    return '';
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Timer */}
      <View
        className="w-full border-b border-slate-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-4 py-4 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold">Let&apos;s Play!</Text>
            <Text className="text-base text-slate-500">
              {draftSession.items.length} items
            </Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <Text className="text-3xl font-mono">{formatTime(elapsedTime)}</Text>
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

      <ScrollView
        className="flex-1 px-4 pt-4 pb-60 space-y-4"
      >
        {draftSession.items.map((item) => (
          <ActiveSessionItemCard
            key={item.id}
            name={getItemName(item)}
            source={getItemSource(item)}
            tempo={tempos[item.id] || ''}
            onTempoChange={(text) => handleTempoChange(item.id, text)}
            itemId={getItemId(item)}
            itemType={item.type}
            exerciseDetails={
              item.type === 'exercise' && item.exercise?.section
                ? {
                  bookId: item.exercise.section.book.id,
                  sectionId: item.exercise.section.id,
                }
                : undefined
            }
          />
        ))}
      </ScrollView>

      {/* End Session Button */}
      <View
        className="bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          className="mx-4 my-4 flex-row items-center justify-center bg-red-500 rounded-xl py-4 active:opacity-80"
          onPress={handleEndSession}
        >
          <ThemedIcon name="Check" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">End Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
