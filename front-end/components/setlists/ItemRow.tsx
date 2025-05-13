import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SetlistItem } from '@/types/setlist';
import { ArrowDown, ArrowUp, Dumbbell, Music, Trash2 } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface ItemRowProps {
  item: SetlistItem;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ItemRow = ({ item, index, total, onMoveUp, onMoveDown, onRemove }: ItemRowProps) => {
  return (
    <Card className="mb-4 rounded-xl">
      <CardContent className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          {item.type === 'exercise' ? <Dumbbell size={20} /> : <Music size={20} />}
          <View>
            <Text className="font-medium">{item.name}</Text>
            {item.artist && <Text className="text-xs text-gray-500">{item.artist}</Text>}
          </View>
        </View>
        <View className="flex-row space-x-1">
          <Button
            size="icon"
            variant="ghost"
            onPress={() => onMoveUp(index)}
            disabled={index === 0}
          >
            <ArrowUp size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onPress={() => onMoveDown(index)}
            disabled={index === total - 1}
          >
            <ArrowDown size={20} />
          </Button>
          <Button size="icon" variant="ghost" onPress={() => onRemove(index)}>
            <Trash2 size={20} className="text-red-500" />
          </Button>
        </View>
      </CardContent>
    </Card>
  );
};
