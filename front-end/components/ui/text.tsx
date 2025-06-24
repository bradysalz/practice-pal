import { cn } from '@/utils/tailwind-utils';
import * as Slot from '@rn-primitives/slot';
import type { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';

const TextClassContext = React.createContext<string | undefined>(undefined);

interface TextProps extends SlottableTextProps {
  variant?:
    | 'body'
    | 'body-semibold'
    | 'body-bold'
    | 'title'
    | 'title-semibold'
    | 'title-bold'
    | 'title-xl'
    | 'title-2xl'
    | 'title-3xl';
}

const variantStyles = {
  body: 'font-text text-base text-lg',
  'body-semibold': 'font-text-semibold text-base text-lg',
  'body-bold': 'font-text-bold text-base text-lg',
  title: 'font-title text-lg',
  'title-semibold': 'font-title-semibold text-lg',
  'title-bold': 'font-title-bold text-lg',
  'title-xl': 'font-title-bold text-xl',
  'title-2xl': 'font-title-bold text-2xl',
  'title-3xl': 'font-title-bold text-3xl',
} as const;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ className, asChild = false, variant = 'body', ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn('text-black web:select-text', textClass, variantStyles[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
