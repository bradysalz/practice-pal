import { View } from 'react-native';

interface SeparatorProps {
  color?: keyof typeof colorMap;
  className?: string;
}

const colorMap = {
  red: 'bg-red-200',
  orange: 'bg-orange-200',
  yellow: 'bg-yellow-200',
  green: 'bg-green-200',
  slate: 'bg-slate-200',
} as const;

export function Separator({ color = 'red', className }: SeparatorProps) {
  return <View className={`h-2 ${colorMap[color]} my-3 w-full rounded-xl ${className}`} />;
}
