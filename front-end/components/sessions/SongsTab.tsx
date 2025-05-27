import { songRowToDraftSessionItem } from '@/lib/utils/draft-session';
import { useArtistsStore } from '@/stores/artist-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { SongRow, useSongsStore } from '@/stores/song-store';
import { Text, View } from 'react-native';
import { SongActionButtons } from '../shared/SongActionButtons';

export function SongsTab() {
  const { draftSession, addItemToDraft, removeItemFromDraft } = useDraftSessionsStore();
  const songs: SongRow[] = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  if (!draftSession) return null;

  const handleAddSong = (song: SongRow) => {
    if (!song) return;
    const artist = artists.find((a) => a.id === song.artist_id);
    const draftItem = songRowToDraftSessionItem(song, artist);
    addItemToDraft(draftItem);
  };

  const handleRemoveSong = (song: SongRow) => {
    const itemToRemove = draftSession.items.find(
      (item) => item.type === 'song' && item.song?.id === song.id
    );
    if (itemToRemove) {
      removeItemFromDraft(itemToRemove.id);
    }
  };

  return (
    <View className="space-y-2 mt-4">
      {songs.map((song) => {
        const isAdded = draftSession.items.some(
          (item) => item.type === 'song' && item.song?.id === song.id
        );

        const artist = artists.find((a) => a.id === song.artist_id);

        return (
          <View
            key={song.id}
            className="flex-row items-center p-4 bg-slate-100 rounded-md"
          >
            <SongActionButtons
              isAdded={isAdded}
              onAddPress={() => handleAddSong(song)}
              onRemovePress={() => handleRemoveSong(song)}
            />
            <View className="ml-1">
              <Text className="font-medium">{song.name}</Text>
              {artist && <Text className="text-sm text-slate-500">{artist.name}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}
