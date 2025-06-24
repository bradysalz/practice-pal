import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

type ItemType = 'book' | 'section' | 'exercise' | 'artist' | 'song';

interface HighlightBarProps {
  type: ItemType;
  name: string;
  showRightArrow?: boolean; // this is only used in the artist highlight bar
  showEditIcon?: boolean;
  onPressEdit?: () => void;
}

type IconName = 'BookOpen' | 'Bookmark' | 'Dumbbell' | 'Music' | 'MicVocal';

const iconMap: Record<ItemType, IconName> = {
  book: 'BookOpen',
  section: 'Bookmark',
  exercise: 'Dumbbell',
  artist: 'MicVocal',
  song: 'Music',
};

export function HighlightBar({
  type,
  name,
  showRightArrow = false,
  showEditIcon = false,
  onPressEdit,
}: HighlightBarProps) {
  return (
    <View className="flex-row items-center justify-between bg-secondary p-2">
      <Pressable onPress={onPressEdit} className="flex-row items-center flex-1">
        <View className="flex-row items-center flex-1">
          <ThemedIcon name={iconMap[type]} size={28} color="black" />
          <Text variant="title-2xl" className="mx-2">
            {name}
          </Text>
        </View>
        {showRightArrow && <ThemedIcon name="ChevronRight" size={28} color="black" />}
        {showEditIcon && <ThemedIcon name="Edit" size={28} color="primary" />}
      </Pressable>
    </View>
  );
}
