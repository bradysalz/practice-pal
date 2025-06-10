import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { supabase } from '@/lib/supabase';
import { useArtistsStore, type ArtistRow } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
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
  const { artists, fetchArtists, addArtistLocal, syncAddArtist } = useArtistsStore();
  const { addSongLocal, syncAddSong, fetchSongs } = useSongsStore();

  // Initialize Fuse instance with options
  const fuse = new Fuse(artists, {
    keys: ['name'],
    threshold: 0.3, // Lower threshold = more strict matching
    distance: 100, // How far to search for matches
    minMatchCharLength: 1,
    shouldSort: true, // Sort by score
    includeScore: true
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  // Fuzzy search using Fuse.js
  const getFilteredArtists = useCallback(() => {
    if (!artistQuery) return [];
    const results = fuse.search(artistQuery);
    // Filter out low-quality matches (high scores mean less relevant)
    return results
      .filter(result => result.score && result.score < 0.6)
      .map(result => result.item);
  }, [artistQuery, fuse]);

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
    let needsArtistFetch = false;

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      let artistId = artists.find((artist) => artist.name === songArtist)?.id;

      // If we have an artist name but no ID, create a new artist
      if (songArtist && !artistId) {
        // Add artist locally first
        artistId = addArtistLocal({
          name: songArtist,
          created_by: userId
        });
        // Sync with backend
        await syncAddArtist(artistId);
        needsArtistFetch = true;
      }

      // Add song locally
      const songId = addSongLocal({
        name: songName,
        artist_id: artistId,
        goal_tempo: songGoalTempo ? parseInt(songGoalTempo) : null,
        created_by: userId
      });

      // Sync with backend
      await syncAddSong(songId);

      if (needsArtistFetch) {
        Promise.all([fetchArtists(), fetchSongs()]);
      }
      else {
        await fetchSongs();
      }

      // Navigate back to library
      router.push('/library');
    } catch (error) {
      console.error('Failed to save song:', error);
      // TODO: Show error feedback to user
    } finally {
      setIsSaving(false);
    }
  };

  const filteredArtists = getFilteredArtists();

  return (
    <SafeAreaView className="flex-1 bg-white p-4 mr-2">
      <Text className="text-2xl font-bold mb-4">Add New Song</Text>
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
                  {filteredArtists.map((artist: ArtistRow) => (
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
          <Pressable
            onPress={handleSaveSong}
            disabled={isSaving}
            className={`bg-primary rounded-xl py-3 items-center flex-row justify-center ${isSaving ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {isSaving ? (
              <>
                <ActivityIndicator color="white" className="mr-2" />
                <Text className="text-white text-xl font-medium">Saving...</Text>
              </>
            ) : (
              <Text className="text-white text-xl font-medium">Save Song</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
