import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { DraftSetlistItem } from '@/types/setlist';
import { maybeTrimString } from '@/utils/string';
import { GripVertical } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemedIcon } from '../icons/ThemedIcon';

interface ItemContentProps {
  item: DraftSetlistItem;
  isExpanded: boolean;
}

interface ItemRowProps {
  item: DraftSetlistItem;
  index: number;
  onRemove: (index: number) => void;
  drag: () => void; // Function to initiate drag
  isActive: boolean; // Indicates if the item is currently being dragged
}

const ItemContent = ({ item, isExpanded }: ItemContentProps) => {
  return (
    <View className="flex-row items-center flex-1 min-w-0">
      <View className="flex-1 min-w-0 ml-2">
        {item.type === 'exercise' ? (
          <View>
            <View className="flex-row items-center">
              <ThemedIcon name="BookOpen" size={18} color="orange-500" />
              <Text variant="body-semibold" className="ml-2">
                {isExpanded
                  ? item.exercise?.section?.book?.name || 'Unknown Book'
                  : maybeTrimString(item.exercise?.section?.book?.name, 25) || 'Unknown Book'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ThemedIcon name="Bookmark" size={18} color="orange-500" />
              <Text variant="body-semibold" className="ml-2">
                {isExpanded
                  ? item.exercise?.section?.name || 'Unknown Section'
                  : maybeTrimString(item.exercise?.section?.name, 25) || 'Unknown Section'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ThemedIcon name="Dumbbell" size={18} color="orange-500" />
              <Text variant="body-semibold" className="ml-2">
                {isExpanded
                  ? item.exercise?.name || 'Unknown Exercise'
                  : maybeTrimString(item.exercise?.name, 25) || 'Unknown Exercise'}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View className="flex-row items-center">
              <ThemedIcon name="MicVocal" size={18} color="orange-500" />
              <Text variant="body-semibold" className="ml-2">
                {isExpanded
                  ? item.song?.artist?.name || 'Unknown Artist'
                  : maybeTrimString(item.song?.artist?.name, 25) || 'Unknown Artist'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ThemedIcon name="Music" size={18} color="orange-500" />
              <Text variant="body-semibold" className="ml-2">
                {isExpanded
                  ? item.song?.name || 'Unknown Song'
                  : maybeTrimString(item.song?.name, 25) || 'Unknown Song'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const ItemRow = ({ item, index, onRemove, drag, isActive }: ItemRowProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    // Wrap the draggable part with a component that can handle gestures, e.g., TouchableOpacity
    // Use onLongPress to trigger dragging
    <Pressable
      onLongPress={drag}
      onPress={handlePress}
      disabled={isActive} // Disable other interactions while dragging
      style={{ backgroundColor: isActive ? 'lightblue' : 'white', marginBottom: 10 }}
    >
      <Card className="rounded-xl bg-slate-100 border-2 border-slate-300">
        <CardContent className="flex-row justify-between items-center py-3">
          {/* Left Section */}
          <View className="-ml-4 flex-row items-center flex-1 min-w-0">
            <GripVertical size={20} />
            <ItemContent item={item} isExpanded={isExpanded} />
          </View>
          {/* Right Section */}
          <View className="flex-row items-center ml-2">
            <Button size="icon" variant="ghost" onPress={() => onRemove(index)}>
              <ThemedIcon name="Trash2" size={20} />
            </Button>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
};
