import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatTimestampToDate } from '@/lib/utils/date-time';
import { useArtistsStore } from '@/stores/artist-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSongsStore } from '@/stores/song-store';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

export default function SongDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goalTempo, setGoalTempo] = useState('');

  // Stores
  const songs = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);
  const sessionItemsBySong = useSessionItemsStore((state) => state.sessionItemsBySong);
  const fetchSessionItemBySongId = useSessionItemsStore((state) => state.fetchSessionItemBySongId);

  useEffect(() => {
    fetchSessionItemBySongId(id);
  }, [fetchSessionItemBySongId, id]);

  const song = songs.find((s) => s.id === id);
  const artist = artists.find((a) => a.id === song?.artist_id);
  const sessions = sessionItemsBySong[id];

  // Handlers
  const handleBackToArtist = (artistId: string) => {
    router.push(`/library/artist/${artistId}`);
  };

  const handleUpdateGoal = () => {
    // TODO: Save goalTempo to backend
    console.log(`Update song goal tempo to ${goalTempo}`);
  };

  // Component Layout
  if (!song) return <Text> Song not found! </Text>;
  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold">{song.name}</Text>

      {artist && (
        <Pressable
          onPress={() => handleBackToArtist(artist.id)}
          className="self-start px-4 py-2 bg-slate-100 rounded-md border border-slate-200 active:opacity-70 flex-row items-center space-x-2"
        >
          <Text className="text-slate-600 text-sm">View Artist: {artist.name}</Text>
        </Pressable>
      )}

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
          <Button onPress={handleUpdateGoal}>Update Goal Tempo</Button>
        </CardContent>
      </Card>

      <Text className="text-xl font-semibold">Practice Sessions</Text>

      {sessions && sessions.length === 0 ? (
        <Text className="text-gray-500 italic">No sessions logged yet.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card className="mb-3">
              <CardHeader className="flex-row justify-between items-center">
                <Text className="font-medium">{item.tempo} BPM</Text>
                {/* <View className="flex-row items-center space-x-1">
                  <Clock size={16} className="text-gray-500" />
                  <Text className="text-gray-500 text-sm">{item.duration} min</Text>
                </View> */}
              </CardHeader>
              <CardContent>
                <Text className="text-sm text-gray-400">
                  {formatTimestampToDate(item.created_at)}
                </Text>
              </CardContent>
            </Card>
          )}
        />
      )}
    </View>
  );
}
