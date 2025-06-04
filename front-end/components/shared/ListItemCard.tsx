import { Checkbox } from '@/components/icons/Checkbox';
import { ReactNode } from 'react';
import { Pressable, Text, View, ViewProps } from 'react-native';

interface ListIemCardProps extends ViewProps {
  title: string;
  subtitle?: string;
  description?: string;
  isAdded: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onPress?: () => void;
  rightElement?: ReactNode;
  stats?: string;
}

export function ListItemCard({
  title,
  subtitle,
  description,
  isAdded,
  onAdd,
  onRemove,
  onPress: onPress,
  rightElement,
  stats,
  ...viewProps
}: ListIemCardProps) {
  const showCheckbox = onAdd && onRemove;
  const isClickable = onPress || showCheckbox;

  return (
    <Pressable
      onPress={() => {
        if (showCheckbox) {
          if (isAdded) {
            onRemove?.();
          } else {
            onAdd?.();
          }
        } else {
          onPress?.();
        }
      }}
      className={isClickable ? "active:opacity-80" : undefined}
      {...viewProps}
    >
      <View className="flex-row items-center justify-between p-4 bg-slate-100 rounded-xl">
        <View className="flex-1 mr-4">
          <Text className="font-medium text-xl">{title}</Text>
          {subtitle && <Text className="text-slate-500 text-lg">{subtitle}</Text>}
          {description && <Text className="text-slate-500 text-lg ">{description}</Text>}
          {stats && <Text className="text-sm text-slate-400 mt-1 text-lg">{stats}</Text>}
        </View>
        {rightElement || (showCheckbox && (
          <Checkbox
            isChecked={isAdded}
            onCheck={onAdd}
            onUncheck={onRemove}
          />
        ))}
      </View>
    </Pressable>
  );
}
