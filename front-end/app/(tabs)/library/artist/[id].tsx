import { Card, CardHeader } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { ChevronRight, Music } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

// Mock Data
const mockArtist = {
  id: '1',
  name: 'John Doe Trio',
  songs: [
    { id: 's1', name: 'Blue Bossa' },
    { id: 's2', name: 'All The Things You Are' },
  ],
};

export default function ArtistDetailPage() {
  const router = useRouter();
  // const { id } = useLocalSearchParams<{ id: string }>();

  const handleSongPress = (songId: string) => {
    router.push(`library/songs/${songId}`);
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-6">
      <Text className="text-2xl font-bold">{mockArtist.name}</Text>

      {mockArtist.songs.map((song) => (
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
