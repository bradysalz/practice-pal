import { HighlightBar } from '@/components/shared/HighlightBar';
import ItemDetailPage from '@/components/shared/ItemDetailPage';
import { useArtistsStore } from '@/stores/artist-store';
import { useSessionItemsStore } from '@/stores/session-item-store';
import { useSongsStore } from '@/stores/song-store';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function SongDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const songId = id;

  const fetchSessionItemBySongId = useSessionItemsStore(
    (state) => state.fetchSessionItemBySongId
  );

  useEffect(() => {
    fetchSessionItemBySongId(songId);
  }, [songId, fetchSessionItemBySongId]);

  // Stores
  const songs = useSongsStore((state) => state.songs);
  const updateSongLocal = useSongsStore((state) => state.updateSongLocal);
  const syncUpdateSong = useSongsStore((state) => state.syncUpdateSong);
  const artists = useArtistsStore((state) => state.artists);
  const sessionItemsBySong = useSessionItemsStore((state) => state.sessionItemsBySong);

  const song = songs.find((s) => s.id === id);
  const artist = artists.find((a) => a.id === song?.artist_id);
  const sessionItems = sessionItemsBySong[id] || [];

  // Handlers
  const handleBackToArtist = (artistId: string) => {
    router.push(`/library-detail/artist/${artistId}`);
  };

  const handleEditSong = () => {
    router.push(`/library-forms/edit-song/${id}`);
  };

  // Component Layout
  if (!song) return <Text> Song not found! </Text>;
  return (
    <ScrollView className="flex-1 p-4">
      <View className="gap-y-4 mb-4">
        <HighlightBar type="song" name={song.name} showEditIcon={true} onPressEdit={handleEditSong} />
        {artist && (
          <Pressable onPress={() => handleBackToArtist(artist.id)}>
            <HighlightBar type="artist" name={artist.name} showRightArrow={true} />
          </Pressable>
        )}
      </View>

      <ItemDetailPage
        sessionItems={sessionItems}
        itemId={songId}
        initialGoalTempo={song.goal_tempo ?? null}
        onUpdateLocal={updateSongLocal}
        onSyncUpdate={syncUpdateSong}
      />
    </ScrollView>
  );
}
