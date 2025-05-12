import { Card } from '@/components/ui/card';
import { View, ViewProps } from 'react-native';

interface CardWithAccentProps extends ViewProps {
  accentColor?: string; // Accepts 'red-500', 'slate-300', or hex
}

export const CardWithAccent = ({
  accentColor: accentColor = 'red-500',
  children,
  className,
  ...props
}: CardWithAccentProps) => {
  const borderClassName = `border-l-4 border-l-${accentColor} rounded-xl overflow-hidden ${className || ''}`;

  return (
    <View className={`mb-6 ${borderClassName}`} {...props}>
      <Card className="bg-white">{children}</Card>
    </View>
  );
};
