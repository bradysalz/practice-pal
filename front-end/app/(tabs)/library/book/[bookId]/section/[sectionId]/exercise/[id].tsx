import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useBooksStore } from '@/stores/book-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSessionsStore } from '@/stores/session-store';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

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
  const exercise = exercises.find((e) => e.id === exerciseId);

  const sessionItems = sessionItemsByExercise[exerciseId || ''] || [];
  const sessionMap = new Map(allSessions.map((s) => [s.id, s]));

  const [goalTempo, setGoalTempo] = useState<string>(String(exercise?.goal_tempo) || '');

  const handleUpdateGoal = () => {
    const parsed = Number(goalTempo);

    // TODO add text that it's bad
    if (!exerciseId || isNaN(parsed) || parsed <= 0) return;

    updateExerciseLocal(exerciseId, { goal_tempo: parsed });
    syncUpdateExercise(exerciseId); // fire-and-forget — optional: await if you want feedback
  };

  const handleSessionPress = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  if (!book) return <Text>Book not found</Text>;
  if (!section) return <Text>Section not found</Text>;
  if (!exercise) return <Text>Exercise not found</Text>;

  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold mb-4">{book.name}</Text>
      <Text className="text-2xl font-bold mb-4">{section.name}</Text>
      <Text className="text-2xl font-bold">{exercise.name}</Text>
      <Card>
        <CardHeader>
          <Text className="text-lg font-medium">Goal Tempo (BPM)</Text>
        </CardHeader>
        <CardContent className="space-y-3">
          <TextInput
            value={goalTempo}
            onChangeText={setGoalTempo}
            keyboardType="numeric"
            className="border border-gray-300 rounded-md p-3 text-base"
          />
          <Button onPress={handleUpdateGoal}>
            <Text>Update Goal Tempo</Text>
          </Button>
        </CardContent>
      </Card>

      <Text className="text-xl font-semibold">Practice Sessions</Text>

      {sessionItems.length === 0 ? (
        <Text className="text-gray-500 italic">No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={sessionItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const sessionId = item.session_id;
            if (!sessionId) return null;

            const session = sessionMap.get(sessionId);
            if (!session) return null;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSessionPress(sessionId)}
                className="active:opacity-70"
              >
                <Card className="mb-3">
                  <CardHeader className="flex-row justify-between items-center">
                    <Text className="font-medium">{item.tempo} BPM</Text>
                  </CardHeader>
                  <CardContent>
                    <Text className="text-sm text-gray-400">{item.created_at}</Text>
                  </CardContent>
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
