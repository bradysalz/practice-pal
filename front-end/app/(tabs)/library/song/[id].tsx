import ItemDetailPage from '@/components/shared/ItemDetailPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useArtistsStore } from '@/stores/artist-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSongsStore } from '@/stores/song-store';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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
  const sessionItems = sessionItemsBySong[id] || [];

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
    <ScrollView className="flex-1 bg-white p-4 space-y-6">
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
          <Button onPress={handleUpdateGoal}><Text>Update Goal Tempo</Text></Button>
        </CardContent>
      </Card>

      <Text className="text-xl font-semibold">Practice Sessions</Text>

      <ItemDetailPage sessionItems={sessionItems} />

    </ScrollView>
  );
}
