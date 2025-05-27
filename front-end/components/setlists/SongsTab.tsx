import { songRowToDraftSetlistItem } from '@/lib/utils/draft-setlist';
import { useArtistsStore } from '@/stores/artist-store';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { SongRow, useSongsStore } from '@/stores/song-store';
import { Text, View } from 'react-native';
import { SongActionButtons } from '../shared/Checkbox';

export function SongsTab() {
  const songs: SongRow[] = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);
  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const addItemToDraft = useDraftSetlistsStore((state) => state.addItemToDraft);
  const removeItemFromDraft = useDraftSetlistsStore((state) => state.removeItemFromDraft);

  if (!draftSetlist) return null;

  const handleAddSong = (song: SongRow) => {
    if (!song) return;
    const artist = artists.find(a => a.id === song.artist_id);
    const draftItem = songRowToDraftSetlistItem(song, artist);
    addItemToDraft(draftItem);
  };

  const handleRemoveSong = (song: SongRow) => {
    const itemToRemove = draftSetlist.items.find(
      item => item.type === 'song' && item.song?.id === song.id
    );
    if (itemToRemove) {
      removeItemFromDraft(itemToRemove.id);
    }
  };

  return (
    <View className="space-y-2 mt-4">
      {songs.map((song) => {
        const isAdded = draftSetlist.items.some(
          (item) => item.type === 'song' && item.song?.id === song.id
        );

        const artist = artists.find((a) => a.id === song.artist_id);

        return (
          <View
            key={song.id}
            className="flex-row items-center justify-start p-4 bg-slate-100 rounded-md"
          >
            <View className="flex-row items-center flex-1">
              <SongActionButtons
                isAdded={isAdded}
                onAddPress={() => handleAddSong(song)}
                onRemovePress={() => handleRemoveSong(song)}
              />
              <View className="ml-2 flex-1">
                <Text className="font-medium">{song.name}</Text>
                {artist && <Text className="text-sm text-slate-500">{artist.name}</Text>}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
