import { Pressable, Text } from 'react-native';

interface ChevronButtonProps {
  onPress: () => void;
}

export function ChevronButton({ onPress }: ChevronButtonProps) {
  return (
    <Pressable onPress={onPress} className="px-2">
      <Text className="text-lg text-slate-400">›</Text>
    </Pressable>
  );
}
