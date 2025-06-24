import { ThemedIcon } from '@/components/icons/ThemedIcon';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

interface DeleteButtonProps {
  label: string;
  onPress?: () => void;
  iconName?: Parameters<typeof ThemedIcon>[0]['name'];
  iconSize?: number;
  textVariant?: Parameters<typeof Text>[0]['variant'];
}

export function DeleteButton({
  label,
  onPress,
  iconName = 'TriangleAlert',
  iconSize = 24,
  textVariant = 'body-semibold',
}: DeleteButtonProps) {
  return (
    <Pressable onPress={onPress} className="self-start">
      <View className="flex-row items-center gap-x-2 bg-red-100 rounded-xl py-2 px-4">
        <ThemedIcon name={iconName} size={iconSize} color="red-500" />
        <Text variant={textVariant} className="text-red-500">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
