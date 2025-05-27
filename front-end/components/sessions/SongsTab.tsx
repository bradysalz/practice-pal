import { songRowToDraftSessionItem } from '@/lib/utils/draft-session';
import { useArtistsStore } from '@/stores/artist-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { SongRow, useSongsStore } from '@/stores/song-store';
import { View } from 'react-native';
import { SessionItemCard } from '../shared/SessionItemCard';

interface SongsTabProps {
  searchQuery: string;
}

export function SongsTab({ searchQuery }: SongsTabProps) {
  const { draftSession, addItemToDraft, removeItemFromDraft } = useDraftSessionsStore();
  const songs: SongRow[] = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  if (!draftSession) return null;

  const handleAddSong = (song: SongRow) => {
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

  const filteredSongs = songs.filter(song => {
    const artist = artists.find((a) => a.id === song.artist_id);
    const songName = song.name?.toLowerCase() || '';
    const artistName = artist?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return songName.includes(query) || artistName.includes(query);
  });

  return (
    <View className="gap-y-4 mt-4">
      {filteredSongs.map((song) => {
        const isAdded = draftSession.items.some(
          (item) => item.type === 'song' && item.song?.id === song.id
        );

        const artist = artists.find((a) => a.id === song.artist_id);

        return (
          <SessionItemCard
            key={song.id}
            title={song.name || 'Untitled Song'}
            subtitle={artist?.name}
            isAdded={isAdded}
            onAdd={() => handleAddSong(song)}
            onRemove={() => handleRemoveSong(song)}
          />
        );
      })}
    </View>
  );
}
