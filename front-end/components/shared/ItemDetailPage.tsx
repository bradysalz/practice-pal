import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { Separator } from '@/components/shared/Separator';
import ItemTempoGraph from '@/components/stats/ItemTempoGraph';
import { useSessionsStore } from '@/stores/session-store';
import { LocalSessionItem } from '@/types/session';
import { formatTimestampToDate } from '@/utils/date-time';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

interface ItemDetailPageProps {
  sessionItems: LocalSessionItem[];
  itemId: string;
  initialGoalTempo: number | null;
  onUpdate: (id: string, updates: { goal_tempo: number }) => void;
}

export default function ItemDetailPage({
  sessionItems,
  itemId,
  initialGoalTempo,
  onUpdate,
}: ItemDetailPageProps) {
  const allSessions = useSessionsStore((state) => state.sessions);
  const sessionMap = new Map(allSessions.map((s) => [s.id, s]));

  // Local state
  const [goalTempo, setGoalTempo] = useState<string>(String(initialGoalTempo || ''));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'bad'>('idle');

  const handleSessionPress = (sessionId: string) => {
    router.navigate(`/session-detail/${sessionId}`);
  };

  const handleUpdateGoal = async () => {
    const parsed = parseInt(goalTempo, 10);
    if (isNaN(parsed)) {
      setStatus('bad');
      return;
    }
    setStatus('saving');
    onUpdate(itemId, { goal_tempo: parsed });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 1500); // Reset after brief display
  };

  return (
    <View>
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
        <View className="mb-40">
          <Separator color="red" />

          {/* Graph */}
          <ItemTempoGraph
            data={sessionItems
              .filter((item) => item.tempo !== null)
              .map((item) => ({
                timestamp: item.created_at ? new Date(item.created_at).getTime() : 0,
                tempo: item.tempo!, // already filtered out nulls
                goal_tempo: Number(goalTempo),
              }))}
          />

          <Separator color="red" />

          {/* Session List */}
          <Text className="text-2xl font-semibold mb-4">Sessions</Text>
          {sessionItems.map((item) => {
            const session = sessionMap.get(item.session_id);
            if (!session) {
              console.log('session not found', item.session_id);
              return null;
            }

            return (
              <ListItemCard
                key={item.id}
                title={`${formatTimestampToDate(item.created_at)} – ${item.tempo} BPM`}
                subtitle={item.notes ?? undefined}
                onPress={() => handleSessionPress(item.session_id)}
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
    </View>
  );
}
