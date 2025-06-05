import { ThemedIcon } from '@/components/icons/themed-icon';
import { ListItemCard } from '@/components/shared/ListItemCard';
import ItemTempoGraph from '@/components/stats/ItemTempoGraph';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSessionsStore } from '@/stores/session-store';
import { formatTimestampToDate } from '@/utils/date-time';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ExerciseDetailPage() {
  const { bookId, sectionId, id } = useLocalSearchParams<{
    bookId: string;
    sectionId: string;
    id: string;
  }>();
  const exerciseId = id; // Easier if we re-define it

  // Stores
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercises = useExercisesStore((state) => state.exercises);
  const sessionItemsByExercise = useSessionItemsStore((state) => state.sessionItemsByExercise);
  const allSessions = useSessionsStore((state) => state.sessions);

  // Fetch
  const fetchExercisesBySection = useExercisesStore((state) => state.fetchExercisesBySection);
  const fetchSessions = useSessionsStore((state) => state.fetchSessions);
  const fetchSessionItemByExerciseId = useSessionItemsStore(
    (state) => state.fetchSessionItemByExerciseId
  );

  // Update
  const updateExerciseLocal = useExercisesStore((state) => state.updateExerciseLocal);
  const syncUpdateExercise = useExercisesStore((state) => state.syncUpdateExercise);

  useEffect(() => {
    fetchSessions();
    fetchExercisesBySection(sectionId);
    fetchSessionItemByExerciseId(exerciseId);
  }, [fetchSessions, fetchExercisesBySection, sectionId, fetchSessionItemByExerciseId, exerciseId]);

  const book = books.find((b) => b.id === bookId);
  const section = sections.find((s) => s.id === sectionId);
  const exercise = exercises[sectionId].find((e) => e.id === exerciseId);

  const sessionItems = sessionItemsByExercise[exerciseId || ''] || [];
  const sessionMap = new Map(allSessions.map((s) => [s.id, s]));

  const [goalTempo, setGoalTempo] = useState<string>(String(exercise?.goal_tempo) || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'bad'>('idle');


  const handleUpdateGoal = async () => {
    const parsed = parseInt(goalTempo, 10);
    if (isNaN(parsed)) {
      setStatus('bad');
      return;
    }

    setStatus('saving');
    updateExerciseLocal(exerciseId, { goal_tempo: parsed });
    const { error } = await syncUpdateExercise(exerciseId);
    if (error) {
      setStatus('error');
    } else {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500); // Reset after brief display
    }
  };

  const handleSessionPress = (sessionId: string) => {
    router.navigate(`/sessions/${sessionId}`);
  };

  if (!book) return <Text>Book not found</Text>;
  if (!section) return <Text>Section not found</Text>;
  if (!exercise) return <Text>Exercise not found</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-4 space-y-6">
      <View className="gap-y-4 mb-4">
        <View className="flex-row items-center justify-left bg-orange-100 p-2">
          <ThemedIcon name="BookOpen" size={28} color="black" />
          <Text className="text-2xl font-bold ml-2">{book.name}</Text>
        </View>

        <View className="flex-row items-center justify-left bg-orange-100 p-2">
          <ThemedIcon name="Bookmark" size={28} color="black" />
          <Text className="text-2xl font-bold ml-2">{section.name}</Text>
        </View>

        <View className="flex-row items-center justify-left bg-orange-100 p-2">
          <ThemedIcon name="Dumbbell" size={28} color="black" />
          <Text className="text-2xl font-bold ml-2">{exercise.name}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-left gap-x-4">
        <Text className="text-lg font-medium">Goal Tempo (BPM)</Text>
        <TextInput
          value={goalTempo}
          onChangeText={setGoalTempo}
          onBlur={handleUpdateGoal}
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl p-3 text-base text-lg"
        />
        {status === 'bad' && <Text className="text-sm text-red-600">Invalid tempo</Text>}
        {status === 'saving' && <Text className="text-sm text-slate-700">Saving...</Text>}
        {status === 'saved' && <Text className="text-sm text-slate-700">Saved!</Text>}
        {status === 'error' && <Text className="text-sm text-red-600">Save failed</Text>}
      </View>



      {sessionItems.length > 0 ? (
        <View>
          {/* Separator */}
          <View className="h-2 bg-red-200 my-3 w-full rounded-xl" />

          {/* Graph */}
          <ItemTempoGraph data={sessionItems
            .filter(item => item.tempo !== null)
            .map((item) => ({
              timestamp: item.created_at,
              tempo: item.tempo!, // already filtered out nulls
            }))} />

          {/* Separator */}
          <View className="h-2 bg-red-200 my-3 w-full rounded-xl" />
          <Text className="text-2xl font-semibold my-4">Sessions</Text>
          {sessionItems.map((item) => {
            const sessionId = item.session_id;
            if (!sessionId) return null;

            const session = sessionMap.get(sessionId);
            if (!session) return null;

            return (
              <ListItemCard
                key={item.id}
                title={`${item.tempo} BPM`}
                subtitle={formatTimestampToDate(item.created_at)}
                onPress={() => handleSessionPress(sessionId)}
                className="mb-4"
                isAdded={false}
                rightElement={<ThemedIcon name="ChevronRight" size={20} color="slate-500" />}
              />
            );
          })}
        </View>

      ) : (
        <View>
          <Text className="text-2xl font-semibold my-4">Sessions</Text>
          <Text className="text-gray-500 italic">No sessions logged yet.</Text>
        </View>
      )}
    </ScrollView >
  );
}
