import { ThemedIcon, type ThemedIconProps } from '@/components/icons/ThemedIcon';
import { Text, type TextProps } from '@/components/ui/text';
import { cn } from '@/utils/tailwind-utils';
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
  className,
}: AddItemButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'bg-slate-100 rounded-xl py-2 px-4 border border-slate-300 flex-row justify-center items-center gap-x-1.5',
        className
      )}
    >
      <ThemedIcon name={iconName} size={iconSize} color={iconColor} />
      <Text variant={textVariant}>{label}</Text>
    </Pressable>
  );
}
