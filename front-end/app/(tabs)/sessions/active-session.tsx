import { SessionItemCard } from '@/components/sessions/SessionItemCards';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useSessionsStore } from '@/stores/session-store';
import { useSongsStore } from '@/stores/song-store';
import { router } from 'expo-router';
import { Pause, Play, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActiveSessionPage() {
  const insets = useSafeAreaInsets();
  const { draftSession, updateDraftDetails } = useDraftSessionsStore();
  const { insertSession } = useSessionsStore();
  const songs = useSongsStore((state) => state.songs);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tempos, setTempos] = useState<Record<string, string>>({});

  // Initialize tempos from session items
  useEffect(() => {
    if (draftSession?.items) {
      const initialTempos = Object.fromEntries(
        draftSession.items.map((item) => [
          item.id,
          (item.tempo || 120).toString(),
        ])
      );
      setTempos(initialTempos);
    }
  }, [draftSession?.items]);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

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

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle tempo changes
  const handleTempoChange = (id: string, text: string) => {
    setTempos((prev) => ({ ...prev, [id]: text }));

    if (draftSession) {
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
    }
  };

  const handleEndSession = async () => {
    if (draftSession) {
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
    }
  };

  if (!draftSession) {
    router.replace('/sessions/make-session');
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header Timer */}
      <View
        className="w-full bg-slate-100 border-b border-slate-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-4 py-4 flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold">Practice Session</Text>
            <Text className="text-base text-slate-500">
              {draftSession.items.length} items
            </Text>
          </View>
          <View className="flex-row items-center space-x-4">
            <Text className="text-3xl font-mono">{formatTime(elapsedTime)}</Text>
            <Pressable
              className="p-3 bg-slate-200 rounded-full active:opacity-80"
              onPress={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Session Items */}
      <ScrollView className="flex-1 px-4 py-4 space-y-4">
        {draftSession.items.map((item) => {
          let name = '';
          let source = '';

          if (item.type === 'exercise' && item.exercise) {
            name = item.exercise.name || 'Untitled Exercise';
            source = item.exercise.section
              ? `${item.exercise.section.book?.name || ''} / ${item.exercise.section.name}`
              : 'Exercise';
          } else if (item.type === 'song' && item.song) {
            name = item.song.name || 'Untitled Song';
            source = item.song.artist?.name || 'Song';
          }

          return (
            <SessionItemCard
              key={item.id}
              id={item.id}
              name={name}
              source={source}
              tempo={tempos[item.id] || '120'}
              onTempoChange={(text) => handleTempoChange(item.id, text)}
            />
          );
        })}
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
          <XCircle size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">End Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
