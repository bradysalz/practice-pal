import { SessionItemCard } from '@/components/sessions/SessionItemCards';
import { useSessionsStore } from '@/stores/session-store';
import { useSongsStore } from '@/stores/song-store';
import { InputLocalSessionItem } from '@/types/session';
import { router } from 'expo-router';
import { Pause, Play, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActiveSessionPage() {
  const insets = useSafeAreaInsets();
  const { currentSession, updateLocalSession, clearLocalSession } = useSessionsStore();
  const songs = useSongsStore((state) => state.songs);
  const fetchSongs = useSongsStore((state) => state.fetchSongs);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tempos, setTempos] = useState<Record<string, string>>({});

  // Fetch songs if needed
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Initialize tempos from session items
  useEffect(() => {
    if (currentSession?.session_items) {
      // Log any duplicate IDs
      const idCounts = new Map<string, number>();
      currentSession.session_items.forEach((item) => {
        const id = item.exercise_id || item.song_id || '';
        idCounts.set(id, (idCounts.get(id) || 0) + 1);
      });

      const duplicates = Array.from(idCounts.entries())
        .filter(([_, count]) => count > 1)
        .map(([id]) => id);

      if (duplicates.length > 0) {
        console.warn('Found duplicate IDs in session items:', duplicates);
      }

      const initialTempos = Object.fromEntries(
        currentSession.session_items.map((item) => [
          item.exercise_id || item.song_id || '',
          (item.tempo || '120').toString(),
        ])
      );
      setTempos(initialTempos);
    }
  }, [currentSession?.session_items]);

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

    // Update the session items with new tempo
    if (currentSession) {
      // Check for duplicate IDs before updating
      const matchingItems = currentSession.session_items.filter(item =>
        (item.exercise_id || item.song_id || '') === id
      );

      if (matchingItems.length > 1) {
        console.warn(`Skipping tempo update for ID ${id} - found ${matchingItems.length} matching items`);
        return;
      }

      const updatedItems = currentSession.session_items.map((item): InputLocalSessionItem => {
        const itemId = item.exercise_id || item.song_id || '';
        if (itemId === id) {
          return {
            ...item,
            tempo: text ? parseInt(text, 10) || null : null,
          };
        }
        return item;
      });

      updateLocalSession({
        session_items: updatedItems,
      });
    }
  };

  const handleEndSession = () => {
    if (currentSession) {
      // Check for duplicate IDs before final update
      const idCounts = new Map<string, number>();
      currentSession.session_items.forEach((item) => {
        const id = item.exercise_id || item.song_id || '';
        idCounts.set(id, (idCounts.get(id) || 0) + 1);
      });

      const duplicates = Array.from(idCounts.entries())
        .filter(([_, count]) => count > 1)
        .map(([id]) => id);

      if (duplicates.length > 0) {
        console.warn('Found duplicate IDs when ending session:', duplicates);
      }

      // Update all tempos one final time before ending
      const finalItems = currentSession.session_items.map((item): InputLocalSessionItem => {
        const id = item.exercise_id || item.song_id || '';
        const currentTempo = tempos[id];
        return {
          ...item,
          tempo: currentTempo ? parseInt(currentTempo, 10) || null : null,
        };
      });

      updateLocalSession({
        duration: elapsedTime,
        session_items: finalItems,
      });
    }
    router.push('/sessions');
    clearLocalSession();
  };

  if (!currentSession) {
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
              {currentSession.session_items.length} items
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
        {currentSession.session_items.map((item, index) => {
          const id = item.exercise_id || item.song_id || '';
          let name = '';
          let source = '';

          if (item.exercise_id && item.exercise) {
            name = item.exercise.name;
            source = `${item.exercise.section.book.name} / ${item.exercise.section.name}`;
          } else if (item.song_id) {
            const song = songs.find(s => s.id === item.song_id);
            if (song) {
              name = song.name;
              source = 'Song'; // We could fetch artist details here too if needed
            }
          }

          // Use index as part of key to ensure uniqueness
          return (
            <SessionItemCard
              key={`${id}-${index}`}
              id={id}
              name={name}
              source={source}
              tempo={tempos[id] || '120'}
              onTempoChange={(text) => handleTempoChange(id, text)}
            />
          );
        })}
      </ScrollView>

      {/* End Session Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          className="mx-4 my-4 py-4 bg-red-500 rounded-xl active:opacity-80 flex-row justify-center items-center space-x-2"
          onPress={handleEndSession}
        >
          <XCircle color="white" size={24} />
          <Text className="text-white text-lg font-semibold">End Session</Text>
        </Pressable>
      </View>
    </View>
  );
}
