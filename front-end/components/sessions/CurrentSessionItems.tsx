import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { DraftSessionItem } from '@/types/session';
import { Pressable, Text, View } from 'react-native';
import { ThemedIcon } from '../icons/themed-icon';

interface CurrentSessionItemsProps {
  sessionItems: DraftSessionItem[];
  onRemoveItem: (itemId: string) => void;
}

export function CurrentSessionItems({ sessionItems, onRemoveItem }: CurrentSessionItemsProps) {
  const songs = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  function renderEmptyState() {
    return (
      <View className="p-4 bg-slate-2000 rounded-xl">
        <Text className="text-slate-500">No items selected yet. Add items from below.</Text>
      </View>
    );
  }

  function renderSessionItem(item: DraftSessionItem) {
    // Handle song items
    if (item.type === 'song' && item.song) {
      const song = songs.find((s) => s.id === item.song?.id);
      if (!song) return null;

      const artist = artists.find((a) => a.id === song.artist_id);

      return (
        <View
          key={item.id}
          className="flex-row items-center justify-between p-4 bg-slate-100 rounded-xl gap-x-4 border border-slate-300 border-2"
        >
          <View className="flex-row items-center gap-x-2">
            <ThemedIcon name="Music" size={24} />
          </View>
          <View className="flex-1 mr-2">
            <Text className="font-bold text-lg">{song.name}</Text>
            {artist && <Text className="  ">{artist.name}</Text>}
          </View>
          <Pressable onPress={() => onRemoveItem(item.id)}>
            <ThemedIcon name="X" size={20} />
          </Pressable>
        </View>
      );
    }

    // Handle exercise items
    if (item.type === 'exercise' && item.exercise) {
      return (
        <View
          key={item.id}
          className="flex-row items-center justify-between p-4 bg-slate-100 rounded-xl gap-x-4 border border-slate-300 border-2"
        >
          <View className="flex-row items-center gap-x-2">
            <ThemedIcon name="Dumbbell" size={24} />
          </View>

          <View className="flex-1 mr-2">
            <Text className="font-bold text-lg">Exercise {item.exercise.name}</Text>
            {item.exercise.section?.book && (
              <Text className="">{item.exercise.section.book.name}</Text>
            )}
            {item.exercise.section && (
              <Text className="">{item.exercise.section.name}</Text>
            )}
            {item.tempo && (
              <Text className="">Goal: {item.tempo} BPM</Text>
            )}
          </View>
          <Pressable onPress={() => onRemoveItem(item.id)}>
            <ThemedIcon name="X" size={20} />
          </Pressable>
        </View>
      );
    }

    return null;
  }

  return (
    <View>
      <Text className="text-2xl font-heading-bold mb-2">Session Items</Text>
      <View className="flex-1 px-4 mb-60 gap-y-4">
        {sessionItems.length === 0 ? renderEmptyState() : sessionItems.map(renderSessionItem)}
      </View>
    </View>
  );
}
