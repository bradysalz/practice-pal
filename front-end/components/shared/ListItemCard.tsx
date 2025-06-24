import { Checkbox } from '@/components/icons/Checkbox';
import { Text } from '@/components/ui/text';
import { ReactNode } from 'react';
import { Pressable, View, ViewProps } from 'react-native';

interface ListIemCardProps extends ViewProps {
  title: string;
  subtitle?: string;
  subtitleIcon?: ReactNode;
  description?: string;
  descriptionIcon?: ReactNode;
  stats?: string;
  statsIcon?: ReactNode;
  isAdded?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onPress?: () => void;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export function ListItemCard({
  title,
  subtitle,
  subtitleIcon,
  description,
  descriptionIcon,
  stats,
  statsIcon,
  isAdded,
  onAdd,
  onRemove,
  onPress,
  leftElement,
  rightElement,
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
      className={isClickable ? 'active:opacity-80' : undefined}
      {...viewProps}
    >
      <View className="flex-row items-center justify-between p-4 bg-slate-100 rounded-xl border-2 border-slate-300">
        {leftElement && <View className="mr-3">{leftElement}</View>}
        <View className="flex-1">
          <Text variant="title-xl">{title}</Text>
          {subtitle && (
            <View className="flex-row items-center gap-x-1">
              {subtitleIcon}
              <Text variant="body-semibold">{subtitle}</Text>
            </View>
          )}
          {description && (
            <View className="flex-row items-center gap-x-1">
              {descriptionIcon}
              <Text variant="body" className="">
                {description}
              </Text>
            </View>
          )}
          {stats && (
            <View className="flex-row items-center gap-x-1 mt-1">
              {statsIcon}
              <Text variant="body" className="italic">
                {stats}
              </Text>
            </View>
          )}
        </View>
        {rightElement && <View className="ml-3">{rightElement}</View>}
        {showCheckbox && (
          <Checkbox isChecked={isAdded ?? false} onCheck={onAdd} onUncheck={onRemove} />
        )}
      </View>
    </Pressable>
  );
}
