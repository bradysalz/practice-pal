import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Text } from '@/components/ui/text';
import { deleteArtist, updateArtist } from '@/lib/supabase/artist';
import { useArtistsStore } from '@/stores/artist-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditArtistPage() {
  const { artistId } = useLocalSearchParams<{ artistId: string }>();
  const router = useRouter();

  const artists = useArtistsStore((state) => state.artists);
  const artist = artists.find((artist) => artist.id === artistId);

  const [artistName, setArtistName] = useState(artist?.name || '');

  const [isSaving, setIsSaving] = useState(false);

  const fetchArtists = useArtistsStore((state) => state.fetchArtists);

  useEffect(() => {
    fetchArtists();
    // only run on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveArtist = async () => {
    setIsSaving(true);

    if (artistName !== artist?.name) {
      await updateArtist(artistId, { name: artistName });
    }

    await fetchArtists();
    setIsSaving(false);
    router.navigate(`/library-detail/artist/${artistId}`);
  };

  const handleDeleteArtist = async () => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete this artist? This will remove this artist, but not delete any songs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteArtist(artistId);
            await fetchArtists();
            router.navigate(`/library`);
          },
        },
      ]
    );
  };

  if (!artist) {
    return <Text>Artist not found</Text>;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 320 }} className="">
        <View className="gap-y-4">
          <TextInputWithLabel
            label="Artist Name"
            value={artistName}
            onChangeText={setArtistName}
            placeholder="Example Artist"
          />
          <Pressable onPress={handleDeleteArtist} className="self-start">
            <View className="flex-row items-center gap-x-2 bg-red-100 rounded-xl py-2 px-4 border border-red-500">
              <ThemedIcon name="TriangleAlert" size={24} color="red-500" />
              <Text variant="body-semibold" className="text-red-500">
                Delete Artist
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleSaveArtist}
            disabled={isSaving}
            className={`rounded-xl py-3 items-center flex-row justify-center ${isSaving ? 'bg-primary/70' : 'bg-primary'}`}
          >
            {isSaving ? (
              <>
                <ActivityIndicator color="white" className="mr-2" />
                <Text variant="body-bold" className="text-white">
                  Saving...
                </Text>
              </>
            ) : (
              <Text variant="body-bold" className="text-white">
                Save Artist
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
