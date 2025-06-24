import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { Text } from '@/components/ui/text';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { LocalArtist } from '@/types/artist';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { ActionButton } from '@/components/ui/action-button';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddSongPage() {
  const router = useRouter();
  const [songName, setSongName] = useState('');
  const [artistQuery, setArtistQuery] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songGoalTempo, setSongGoalTempo] = useState('');
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get store hooks
  const { artists, fetchArtists, addArtist } = useArtistsStore();
  const { addSong } = useSongsStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Fuzzy search using Fuse.js
  const getFilteredArtists = useCallback(() => {
    if (!artistQuery) return [];

    // Initialize Fuse instance with options
    const fuse = new Fuse(artists, {
      keys: ['name'],
      threshold: 0.3, // Lower threshold = more strict matching
      distance: 100, // How far to search for matches
      minMatchCharLength: 1,
      shouldSort: true, // Sort by score
      includeScore: true,
    });

    const results = fuse.search(artistQuery);
    // Filter out low-quality matches (high scores mean less relevant)
    return results
      .filter((result) => result.score && result.score < 0.6)
      .map((result) => result.item);
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
    if (isSaving) return;
    setIsSaving(true);

    const artistId = artists.find((artist) => artist.name === songArtist)?.id;
    if (songArtist && !artistId) {
      await addArtist(songArtist);
    }

    await addSong({
      name: songName,
      artist_id: artistId!,
      goal_tempo: songGoalTempo ? parseInt(songGoalTempo) : undefined,
    });

    router.push('/library');
    setIsSaving(false);
  };

  const filteredArtists = getFilteredArtists();

  return (
    <SafeAreaView className="flex-1 bg-white p-4 mr-2">
      <Text variant="title-2xl" className="mb-4">
        Add New Song
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="mr-1">
        <View className="gap-y-4">
          <TextInputWithLabel
            label="Song Name"
            value={songName}
            onChangeText={setSongName}
            placeholder="e.g., Uptown Funk"
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
          <TextInputWithLabel
            label="Goal Tempo (BPM)"
            value={songGoalTempo}
            onChangeText={setSongGoalTempo}
            placeholder="e.g., 120"
            keyboardType="numeric"
          />
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
    </SafeAreaView>
  );
}
