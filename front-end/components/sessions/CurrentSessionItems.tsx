import { XButton } from '@/components/shared/XButton';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { InputLocalSessionItem } from '@/types/session';
import { Text, View } from 'react-native';

interface CurrentSessionItemsProps {
  sessionItems: InputLocalSessionItem[];
  onRemoveItem: (itemId: string, type: 'song' | 'exercise') => void;
}

export function CurrentSessionItems({ sessionItems, onRemoveItem }: CurrentSessionItemsProps) {
  const songs = useSongsStore((state) => state.songs);
  const artists = useArtistsStore((state) => state.artists);

  return (
    <View>
      <Text className="text-xl font-bold mb-2">Selected Items</Text>
      <View>
        {!sessionItems.length ? (
          <View className="p-4 bg-slate-100 rounded-md">
            <Text className="text-slate-500">No items selected yet. Add items from below.</Text>
          </View>
        ) : (
          sessionItems.map((item) => {
            // Handle song items
            if (item.song_id) {
              const song = songs.find((s) => s.id === item.song_id);
              if (!song) return null;

              const artist = artists.find((a) => a.id === song.artist_id);

              return (
                <View
                  key={item.song_id}
                  className="flex-row items-start justify-between p-4 bg-slate-100 rounded-md mb-3"
                >
                  <View className="flex-1 mr-2">
                    <Text className="font-medium">{song.name}</Text>
                    {artist && <Text className="text-sm text-slate-500">{artist.name}</Text>}
                  </View>
                  <XButton onPress={() => onRemoveItem(song.id, 'song')} />
                </View>
              );
            }

            // Handle exercise items
            const exerciseId = item.exercise_id;
            if (exerciseId && item.exercise) {
              const exercise = item.exercise;

              return (
                <View
                  key={exerciseId}
                  className="flex-row items-start justify-between p-4 bg-slate-100 rounded-md mb-3"
                >
                  <View className="flex-1 mr-2">
                    <Text className="font-medium">{exercise.name}</Text>
                    <Text className="text-sm text-slate-500">{exercise.section.book.name}</Text>
                    <Text className="text-sm text-slate-500">{exercise.section.name}</Text>
                    {item.tempo && (
                      <Text className="text-sm text-slate-500">Goal: {item.tempo} BPM</Text>
                    )}
                  </View>
                  <XButton onPress={() => onRemoveItem(exerciseId, 'exercise')} />
                </View>
              );
            }

            return null;
          })
        )}
      </View>
    </View>
  );
}
