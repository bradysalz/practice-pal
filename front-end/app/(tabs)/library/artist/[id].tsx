import { Card, CardHeader } from '@/components/ui/card';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight, Music } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function ArtistDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Zustand stores
  const artists = useArtistsStore((state) => state.artists);
  const songs = useSongsStore((state) => state.songs);
  // Loads already done on the library

  const artist = artists.find((a) => a.id === id);
  const filteredSongs = songs.filter((s) => s.artist_id === id);

  const handleSongPress = (songId: string) => {
    router.push(`library/song/${songId}`);
  };

  if (!artist) return <Text>Artist not found!</Text>;
  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold">{artist.name}</Text>

      {filteredSongs.map((song) => (
        <Pressable
          key={song.id}
          onPress={() => handleSongPress(song.id)}
          className="active:opacity-70"
        >
          <Card className="hover:shadow-sm">
            <CardHeader className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2">
                <Music size={20} />
                <Text className="text-lg font-medium">{song.name}</Text>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </CardHeader>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
