import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SetlistItem } from '@/types/setlist';
import { Dumbbell, GripVertical, Music, Trash2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface ItemRowProps {
  item: SetlistItem;
  index: number;
  onRemove: (index: number) => void;
  drag: () => void; // Function to initiate drag
  isActive: boolean; // Indicates if the item is currently being dragged
}

export const ItemRow = ({ item, index, onRemove, drag, isActive }: ItemRowProps) => {
  return (
    // Wrap the draggable part with a component that can handle gestures, e.g., TouchableOpacity
    // Use onLongPress to trigger dragging
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive} // Disable other interactions while dragging
      style={{ backgroundColor: isActive ? 'lightblue' : 'white', marginBottom: 20 }} // Example styling
    >
      <Card className="rounded-xl">
        <CardContent className="flex-row justify-between items-center py-3">
          {/* Left Section */}
          <View className="-ml-4 flex-row items-center space-x-2">
            <GripVertical size={20} />
            <View className="ml-2 flex-row items-center">
              {item.type === 'exercise' ? <Dumbbell size={20} /> : <Music size={20} />}
              <View className="justify-center items-center">
                <Text className="font-medium">{item.name}</Text>
                {item.artist && <Text className="text-xs text-gray-500">{item.artist}</Text>}
              </View>
            </View>
          </View>
          {/* Right Section */}
          <View className="flex-row place-items-end space-x-1">
            <Button size="icon" variant="ghost" onPress={() => onRemove(index)}>
              <Trash2 size={20} className="red-500" />
            </Button>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
