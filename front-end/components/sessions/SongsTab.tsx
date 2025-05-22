import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { useArtistsStore } from '@/stores/artist-store';
import { useSessionsStore } from '@/stores/session-store';
import { useSongsStore } from '@/stores/song-store';
import { Text, View } from 'react-native';
export function SongsTab() {
  const { currentSession, updateLocalSession } = useSessionsStore();
  const songs = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  const handleToggleSong = (songId: string) => {
    if (!currentSession) return;

    // Check if song already exists in session items
    const isDuplicate = currentSession.session_items.some(
      (item) => item.song_id === songId
    );

    if (!isDuplicate) { return; }

    updateLocalSession({
      session_items: [
        ...currentSession.session_items,
        {
          song_id: songId,
          exercise_id: null,
          notes: null,
          tempo: null,
        },
      ],
    });

  };

  return (
    <View className="space-y-2 mt-4">
      {songs.map((song) => {
        const isAdded = currentSession?.session_items.some(
          (item) => item.song_id === song.id
        );

        const artist = artists.find((a) => a.id === song.artist_id);

        return (
          <View
            key={song.id}
            className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md"
          >
            <View>
              <Text className="font-medium">{song.name}</Text>
              {artist && <Text className="text-sm text-slate-500">{artist.name}</Text>}
            </View>
            <AddRemoveButton
              isAdded={!!isAdded}
              onPress={() => handleToggleSong(song.id)}
            />
          </View>
        );
      })}
    </View>
  );
}
