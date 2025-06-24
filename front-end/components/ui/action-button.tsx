import * as React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Text, type TextProps } from './text';
import { cn } from '@/utils/tailwind-utils';

interface ActionButtonProps extends PressableProps {
  text: string;
  icon?: React.ReactElement;
  textVariant?: TextProps['variant'];
}

export function ActionButton({
  text,
  icon,
  textVariant = 'body-semibold',
  className,
  ...props
}: ActionButtonProps) {
  const renderedIcon = React.useMemo(() => {
    if (!icon) return null;
    return React.cloneElement(icon, {
      className: cn(icon.props.className, 'mr-2'),
    });
  }, [icon]);

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-center bg-primary rounded-xl py-4 shadow-md active:opacity-80',
        className,
      )}
      {...props}
    >
      {renderedIcon}
      <Text variant={textVariant} className="text-white">
        {text}
      </Text>
    </Pressable>
  );
}
