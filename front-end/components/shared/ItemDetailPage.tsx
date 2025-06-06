import { ThemedIcon } from "@/components/icons/themed-icon";
import { ListItemCard } from "@/components/shared/ListItemCard";
import { Separator } from "@/components/shared/Separator";
import ItemTempoGraph from "@/components/stats/ItemTempoGraph";
import { useSessionsStore } from "@/stores/session-store";
import { SessionItemRow } from "@/types/session";
import { formatTimestampToDate } from "@/utils/date-time";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface ItemDetailPageProps {
  sessionItems: SessionItemRow[];
  itemId: string;
  initialGoalTempo: number | null;
  onUpdateLocal: (id: string, updates: { goal_tempo: number }) => void;
  onSyncUpdate: (id: string) => Promise<{ error: any | null }>;
}

export default function ItemDetailPage({
  sessionItems,
  itemId,
  initialGoalTempo,
  onUpdateLocal,
  onSyncUpdate
}: ItemDetailPageProps) {
  const allSessions = useSessionsStore((state) => state.sessions);
  const sessionMap = new Map(allSessions.map((s) => [s.id, s]));

  // Local state
  const [goalTempo, setGoalTempo] = useState<string>(String(initialGoalTempo || ''));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'bad'>('idle');

  const handleSessionPress = (sessionId: string) => {
    router.navigate(`/sessions/${sessionId}`);
  };

  const handleUpdateGoal = async () => {
    const parsed = parseInt(goalTempo, 10);
    if (isNaN(parsed)) {
      setStatus('bad');
      return;
    }
    setStatus('saving');
    onUpdateLocal(itemId, { goal_tempo: parsed });
    const { error } = await onSyncUpdate(itemId);
    if (error) {
      setStatus('error');
    } else {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500); // Reset after brief display
    }
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
        <View>
          <Separator color="red" />

          {/* Graph */}
          <ItemTempoGraph data={sessionItems
            .filter(item => item.tempo !== null)
            .map((item) => ({
              timestamp: item.created_at,
              tempo: item.tempo!, // already filtered out nulls
            }))} />

          <Separator color="red" />

          {/* Session List */}
          <Text className="text-2xl font-semibold my-4">Sessions</Text>
          {sessionItems.map((item) => {
            const session = sessionMap.get(item.session_id);
            if (!session) {
              console.log('session not found', item.session_id);
              return null;
            }

            return (
              <ListItemCard
                key={item.id}
                title={`${item.tempo} BPM`}
                subtitle={formatTimestampToDate(item.created_at)}
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
