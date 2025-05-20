import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SetlistItemWithNested, SetlistWithItems } from '@/types/setlist';
import { Text, View } from 'react-native';
import { ThemedIcon } from '../icons/themed-icon';

interface Props {
  setlist: SetlistWithItems;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SetlistCard = ({ setlist, onEdit, onDelete }: Props) => {
  // TODO: de-dupe this in item-row
  const displayItem = (item: SetlistItemWithNested): string => {
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
    <View className="rounded-xl mb-3 overflow-hidden px-2">
      <View className="border-1 border-slate-300">
        <Card className="rounded-xl">
          <CardHeader className="flex-row justify-between items-center">
            <View className="flex-1 min-w-0">
              <Text className="font-bold text-xl">{setlist.name}</Text>
              <Text className="text-md text-gray-700">{setlist.description}</Text>
            </View>
            <Badge variant="outline" className="flex-shrink-0 ml-2">
              <Text>{setlist.setlist_items.length} items</Text>
            </Badge>
          </CardHeader>
          <CardContent>
            <View className="mb-3 space-y-1">
              {setlist.setlist_items.slice(0, 4).map((item, index) => (
                <Text key={index} className="text-gray-700 text-md">
                  • {displayItem(item)}
                </Text>
              ))}
              {setlist.setlist_items.length > 3 && (
                <Text className="text-gray-700 text-md">
                  • {setlist.setlist_items.length - 3} more...
                </Text>
              )}
            </View>
            <View className="flex-row justify-end items-center">
              <View className="flex-row space-x-2">
                <Button variant="ghost" size="icon" onPress={() => onDelete(setlist.id)}>
                  <ThemedIcon name="Trash2" size={24} color="red-500" className="text-red-500" />
                </Button>
                <Button variant="ghost" size="icon" onPress={() => onEdit(setlist.id)}>
                  <ThemedIcon name="Edit" size={24} color="red-500" className="text-red-500" />
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  );
};
