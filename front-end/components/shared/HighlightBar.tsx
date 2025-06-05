import { ThemedIcon } from '@/components/icons/themed-icon';
import { Text, View } from 'react-native';

type ItemType = 'book' | 'section' | 'exercise' | 'artist' | 'song';

interface HighlightBarProps {
  type: ItemType;
  name: string;
  showRightArrow?: boolean; // this is only used in the artist highlight bar
}

type IconName = 'BookOpen' | 'Bookmark' | 'Dumbbell' | 'Music' | 'MicVocal';

const iconMap: Record<ItemType, IconName> = {
  book: 'BookOpen',
  section: 'Bookmark',
  exercise: 'Dumbbell',
  artist: 'MicVocal',
  song: 'Music',
};

export function HighlightBar({ type, name, showRightArrow = false }: HighlightBarProps) {
  return (
    <View className="flex-row items-center bg-orange-100 p-2">
      <View className="flex-row items-center flex-1">
        <ThemedIcon name={iconMap[type]} size={28} color="black" />
        <Text className="text-2xl font-bold ml-2">{name}</Text>
      </View>
      {showRightArrow && <ThemedIcon name="ChevronRight" size={28} color="black" />}
    </View>
  );
}
