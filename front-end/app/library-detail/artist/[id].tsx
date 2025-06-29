import { HighlightBar } from '@/components/shared/HighlightBar';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { StatBox } from '@/components/shared/StatBox';
import { Text } from '@/components/ui/text';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

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
    router.push(`/library-detail/song/${songId}`);
  };

  const handleEditArtist = () => {
    router.push(`/library-forms/edit-artist/${id}`);
  };

  if (!artist)
    return (
      <Text variant="body" className="text-center text-slate-500 py-8">
        Artist not found!
      </Text>
    );
  return (
    <View className="flex-1 p-4">
      <View className="gap-y-4 mb-4">
        <HighlightBar
          type="artist"
          name={artist.name}
          showEditIcon={true}
          onPressEdit={handleEditArtist}
        />
      </View>
      <View className="flex-row gap-x-4 mb-4">
        <StatBox label="Songs" value={filteredSongs.length} />
      </View>
      <ScrollView className="rounded-lg">
        {filteredSongs.map((song) => (
          <ListItemCard
            key={song.id}
            title={`${song.name}`}
            isAdded={false}
            onPress={() => handleSongPress(song.id)}
            className="mb-4"
            rightElement={<ChevronRight size={20} className="text-slate-500" />}
          />
        ))}
      </ScrollView>
    </View>
  );
}
