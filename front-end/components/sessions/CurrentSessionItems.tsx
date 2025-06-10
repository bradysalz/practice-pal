import { ThemedIcon } from '@/components/icons/themed-icon';
import { ListItemCard } from '@/components/shared/ListItemCard';
import { useArtistsStore } from '@/stores/artist-store';
import { useSongsStore } from '@/stores/song-store';
import { DraftSessionItem } from '@/types/session';
import { Text, View } from 'react-native';

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
        <ListItemCard
          key={item.id}
          title={song.name}
          subtitle={artist?.name}
          subtitleIcon={<ThemedIcon name="MicVocal" size={16} color="black" />}
          leftElement={<ThemedIcon name="Music" size={24} />}
          rightElement={<ThemedIcon name="X" size={28} />}
          onRemove={() => onRemoveItem(item.id)}
          isAdded={true}
        />
      );
    }

    // Handle exercise items
    if (item.type === 'exercise' && item.exercise) {
      const bookName = item.exercise.section?.book?.name?.length > 28
        ? item.exercise.section.book.name.slice(0, 28) + '...'
        : item.exercise.section?.book?.name;
      const sectionName = item.exercise.section?.name?.length > 28
        ? item.exercise.section.name.slice(0, 28) + '...'
        : item.exercise.section?.name;

      return (
        <ListItemCard
          key={item.id}
          title={`Exercise ${item.exercise.name}`}
          subtitle={bookName}
          subtitleIcon={bookName ? <ThemedIcon name="BookOpen" size={16} color="black" /> : undefined}
          description={sectionName}
          descriptionIcon={sectionName ? <ThemedIcon name="Bookmark" size={16} color="black" /> : undefined}
          leftElement={<ThemedIcon name="Dumbbell" size={24} />}
          rightElement={<ThemedIcon name="X" size={28} />}
          onRemove={() => onRemoveItem(item.id)}
          isAdded={true}
        />
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
