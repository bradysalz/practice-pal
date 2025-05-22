import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { useArtistsStore } from '@/stores/artist-store';
import { useSetlistsStore } from '@/stores/setlist-store';
import { useSongsStore } from '@/stores/song-store';
import { InputLocalSetlist, InputLocalSetlistItem } from '@/types/setlist';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export function SongsTab() {
  const { setlistId } = useLocalSearchParams<{ setlistId: string }>();
  const { setlistDetailMap, draftSetlist, setDraftSetlist } = useSetlistsStore();
  const songs = useSongsStore((state) => state.songs);
  const fetchSongs = useSongsStore((state) => state.fetchSongs);
  const artists = useArtistsStore((state) => state.artists);
  const fetchArtists = useArtistsStore((state) => state.fetchArtists);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Initialize draft if not exists
  useEffect(() => {
    if (!setlistId) return;

    const setlist = setlistDetailMap[setlistId];
    if (!setlist || draftSetlist) return;

    const initialDraft: InputLocalSetlist = {
      name: setlist.name ?? '',
      description: setlist.description ?? '',
      created_by: setlist.created_by,
      setlistItems: setlist.setlist_items.map(item => ({
        song_id: item.song_id,
        exercise_id: item.exercise_id,
        setlist_id: item.setlist_id,
        position: item.position,
        tempo: item.tempo,
        type: item.type,
        created_by: item.created_by,
      }))
    };

    setDraftSetlist(initialDraft);
  }, [setlistId, setlistDetailMap, draftSetlist, setDraftSetlist]);

  const handleToggleSong = (songId: string) => {
    if (!setlistId || !draftSetlist) return;

    // Check if song is already in draft
    const isAdded = draftSetlist.setlistItems.some(item => item.song_id === songId);

    // Calculate the next position based on existing items
    const nextPosition = draftSetlist.setlistItems.length > 0
      ? Math.max(...draftSetlist.setlistItems.map(item => item.position)) + 1
      : 0;

    const updatedItems = isAdded
      ? draftSetlist.setlistItems.filter(item => item.song_id !== songId)
      : [
        ...draftSetlist.setlistItems,
        {
          song_id: songId,
          exercise_id: null,
          setlist_id: setlistId,
          position: nextPosition,
          tempo: 0,
          type: 'song'
        } as InputLocalSetlistItem
      ];

    setDraftSetlist({
      ...draftSetlist,
      setlistItems: updatedItems
    });
  };

  return (
    <View className="space-y-2 mt-4">
      {songs.map((song) => {
        const isAdded = draftSetlist?.setlistItems.some(
          (item) => item.song_id === song.id
        ) ?? false;

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
              isAdded={isAdded}
              onPress={() => handleToggleSong(song.id)}
            />
          </View>
        );
      })}
    </View>
  );
}
