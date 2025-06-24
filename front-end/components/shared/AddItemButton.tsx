import { ThemedIcon, type ThemedIconProps } from '@/components/icons/ThemedIcon';
import { Text, type TextProps } from '@/components/ui/text';
import { Pressable } from 'react-native';

interface AddItemButtonProps {
  label: string;
  onPress?: () => void;
  iconName?: ThemedIconProps['name'];
  iconSize?: number;
  textVariant?: TextProps['variant'];
  iconColor?: string;
  className?: string;
}

export function AddItemButton({
  label,
  onPress,
  iconName = 'Plus',
  iconSize = 16,
  textVariant = 'body-semibold',
  iconColor = 'slate-500',
  className = 'bg-slate-100 rounded-xl py-2 px-4 border border-slate-300 flex-row items-center gap-x-1.5',
}: AddItemButtonProps) {
  return (
    <Pressable onPress={onPress} className={className}>
      <ThemedIcon name={iconName} size={iconSize} color={iconColor} />
      <Text variant={textVariant}>{label}</Text>
    </Pressable>
  );
}
