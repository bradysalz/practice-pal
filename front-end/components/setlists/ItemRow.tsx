import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DraftSetlistItem } from '@/types/setlist';
import { GripVertical } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemedIcon } from '../icons/themed-icon';

interface ItemContentProps {
  item: DraftSetlistItem;
}

interface ItemRowProps {
  item: DraftSetlistItem;
  index: number;
  onRemove: (index: number) => void;
  drag: () => void; // Function to initiate drag
  isActive: boolean; // Indicates if the item is currently being dragged
}

const ItemContent = ({ item }: ItemContentProps) => {
  // TODO: de-dupe this with setlistcard
  const displayItem = (item: DraftSetlistItem): string => {
    if (item.type === 'song') {
      const artist_name = ' - ' + item.song?.artist?.name || '';
      return `${item.song?.name}${artist_name}`;
    }
    if (item.type === 'exercise') {
      return `${item.exercise?.section?.book?.name}: ${item.exercise?.section?.name}: ${item.exercise?.name}`;
    }
    // Safer checking
    return '';
  };

  return (
    <View className="flex-row items-center flex-1 min-w-0">
      {item.type === 'exercise' ? <ThemedIcon name="Dumbbell" size={20} /> : <ThemedIcon name="Music" size={20} />}
      <View className="flex-1 min-w-0 ml-2">
        <Text className="font-normal text-lg" numberOfLines={3}>{displayItem(item)}</Text>
      </View>
    </View>
  );
};

export const ItemRow = ({ item, index, onRemove, drag, isActive }: ItemRowProps) => {
  return (
    // Wrap the draggable part with a component that can handle gestures, e.g., TouchableOpacity
    // Use onLongPress to trigger dragging
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive} // Disable other interactions while dragging
      style={{ backgroundColor: isActive ? 'lightblue' : 'white', marginBottom: 10 }}
    >
      <Card className="rounded-xl">
        <CardContent className="flex-row justify-between items-center py-3">
          {/* Left Section */}
          <View className="-ml-4 flex-row items-center flex-1 min-w-0">
            <GripVertical size={20} />
            <ItemContent item={item} />
          </View>
          {/* Right Section */}
          <View className="flex-row items-center ml-2">
            <Button size="icon" variant="ghost" onPress={() => onRemove(index)}>
              <ThemedIcon name="Trash2" size={20} />
            </Button>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
