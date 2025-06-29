import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { DeleteButton } from '@/components/shared/DeleteButton';
import { Text } from '@/components/ui/text';
import { deleteSong, updateSong } from '@/lib/supabase/song';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { LocalArtist } from '@/types/artist';
import { fuzzySearchArtists } from '@/utils/song-edit';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { ActionButton } from '@/components/ui/action-button';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditSongPage() {
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const router = useRouter();

  const songs = useSongsStore((state) => state.songs);
  const song = songs.find((song) => song.id === songId);
  const artists = useArtistsStore((state) => state.artists);
  const artist = artists.find((artist) => artist.id === song?.artist_id);

  const [songName, setSongName] = useState(song?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [artistQuery, setArtistQuery] = useState(artist?.name || '');
  const [songArtist, setSongArtist] = useState(artist?.name || '');
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);

  const fetchSongs = useSongsStore((state) => state.fetchSongs);
  const { fetchArtists, addArtist } = useArtistsStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Fuzzy search using utility function
  const getFilteredArtists = useCallback(() => {
    return fuzzySearchArtists(artists, artistQuery);
  }, [artistQuery, artists]);

  const handleSelectArtist = (artistName: string) => {
    setSongArtist(artistName);
    setArtistQuery(artistName);
    setShowArtistDropdown(false);
  };

  const handleArtistInputChange = (text: string) => {
    setArtistQuery(text);
    setSongArtist(text);

    if (text.length > 0) {
      setShowArtistDropdown(true);
    } else {
      setShowArtistDropdown(false);
    }
  };

  const handleSaveSong = async () => {
    setIsSaving(true);

    const artistId = artists.find((artist) => artist.name === songArtist)?.id;
    if (songArtist && !artistId) {
      await addArtist(songArtist);
    }

    await updateSong(songId, {
      name: songName,
      artist_id: artistId,
    });

    router.push(`/library-detail/song/${songId}`);
    setIsSaving(false);
  };

  const handleDeleteSong = async () => {
    Alert.alert('Delete', `Are you sure you want to delete this song?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSong(songId);
          await fetchSongs();
          router.push(`/library`);
        },
      },
    ]);
  };

  const filteredArtists = getFilteredArtists();

  if (!song) {
    return <Text>Song not found</Text>;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="">
        <View className="gap-y-4">
          <TextInputWithLabel
            label="Song Name"
            value={songName}
            onChangeText={setSongName}
            placeholder="Example Song"
          />
          <View className="relative">
            <TextInputWithLabel
              label="Artist"
              value={artistQuery}
              onChangeText={handleArtistInputChange}
              placeholder="e.g., Bruno Mars"
            />
            {showArtistDropdown && filteredArtists.length > 0 && (
              <View className="absolute top-[100%] left-0 right-1 bg-white border border-slate-300 rounded-xl mt-1 z-10 max-h-48">
                <ScrollView>
                  {filteredArtists.map((artist: LocalArtist) => (
                    <Pressable
                      key={artist.id}
                      onPress={() => handleSelectArtist(artist.name)}
                      className="px-3 py-2 border-b border-slate-200 active:bg-slate-100"
                    >
                      <Text className="text-lg">{artist.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <DeleteButton onPress={handleDeleteSong} label="Delete Song" />

          <ActionButton
            onPress={handleSaveSong}
            disabled={isSaving}
            className={isSaving ? 'bg-primary/70' : undefined}
            textVariant="body-bold"
            text={isSaving ? 'Saving...' : 'Save Song'}
            icon={isSaving ? <ActivityIndicator color="white" /> : undefined}
          />
        </View>
      </ScrollView>
    </View>
  );
}
