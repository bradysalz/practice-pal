import { songRowToDraftSessionItem } from '@/lib/utils/draft-session';
import { songRowToDraftSetlistItem } from '@/lib/utils/draft-setlist';
import { useArtistsStore } from '@/stores/artist-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { SongRow, useSongsStore } from '@/stores/song-store';
import { View } from 'react-native';
import { ListItemCard } from './ListItemCard';

interface SongsTabProps {
  mode: 'session' | 'setlist';
  searchQuery?: string;
}

export function SongsTab({ mode, searchQuery = '' }: SongsTabProps) {
  // Store hooks
  const songs: SongRow[] = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  // Session/Setlist store hooks
  const draftSession = useDraftSessionsStore((state) => state.draftSession);
  const addSessionItem = useDraftSessionsStore((state) => state.addItemToDraft);
  const removeSessionItem = useDraftSessionsStore((state) => state.removeItemFromDraft);

  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const addSetlistItem = useDraftSetlistsStore((state) => state.addItemToDraft);
  const removeSetlistItem = useDraftSetlistsStore((state) => state.removeItemFromDraft);

  // Return early if no draft is available
  if ((mode === 'session' && !draftSession) || (mode === 'setlist' && !draftSetlist)) {
    return null;
  }

  const handleAddSong = (song: SongRow) => {
    const artist = artists.find((a) => a.id === song.artist_id);

    if (mode === 'session' && draftSession) {
      const draftItem = songRowToDraftSessionItem(song, artist);
      addSessionItem(draftItem);
    } else if (mode === 'setlist' && draftSetlist) {
      const draftItem = songRowToDraftSetlistItem(song, artist);
      addSetlistItem(draftItem);
    }
  };

  const handleRemoveSong = (song: SongRow) => {
    if (mode === 'session' && draftSession) {
      const itemToRemove = draftSession.items.find(
        (item) => item.type === 'song' && item.song?.id === song.id
      );
      if (itemToRemove) {
        removeSessionItem(itemToRemove.id);
      }
    } else if (mode === 'setlist' && draftSetlist) {
      const itemToRemove = draftSetlist.items.find(
        (item) => item.type === 'song' && item.song?.id === song.id
      );
      if (itemToRemove) {
        removeSetlistItem(itemToRemove.id);
      }
    }
  };

  const isSongAdded = (song: SongRow) => {
    if (mode === 'session' && draftSession) {
      return draftSession.items.some(
        (item) => item.type === 'song' && item.song?.id === song.id
      );
    } else if (mode === 'setlist' && draftSetlist) {
      return draftSetlist.items.some(
        (item) => item.type === 'song' && item.song?.id === song.id
      );
    }
    return false;
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
        const artist = artists.find((a) => a.id === song.artist_id);

        return (
          <ListItemCard
            key={song.id}
            title={song.name || 'Untitled Song'}
            subtitle={artist?.name}
            isAdded={isSongAdded(song)}
            onAdd={() => handleAddSong(song)}
            onRemove={() => handleRemoveSong(song)}
          />
        );
      })}
    </View>
  );
}
