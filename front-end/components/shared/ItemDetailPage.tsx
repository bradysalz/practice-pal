import { ThemedIcon } from "@/components/icons/themed-icon";
import { ListItemCard } from "@/components/shared/ListItemCard";
import ItemTempoGraph from "@/components/stats/ItemTempoGraph";
import { useSessionsStore } from "@/stores/session-store";
import { SessionItemRow } from "@/types/session";
import { formatTimestampToDate } from "@/utils/date-time";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface ItemDetailPageProps {
  sessionItems: SessionItemRow[];
}

export default function ItemDetailPage({ sessionItems }: ItemDetailPageProps) {
  const allSessions = useSessionsStore((state) => state.sessions);
  const sessionMap = new Map(allSessions.map((s) => [s.id, s]));

  const handleSessionPress = (sessionId: string) => {
    router.navigate(`/sessions/${sessionId}`);
  };

  return (
    <View>
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
