import { Href, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ThemedIcon } from '../icons/themed-icon';

interface FloatingActionButtonProps {
  href?: Href;
  onPress?: () => void;
}

export function FloatingActionButton({ href, onPress }: FloatingActionButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="absolute bottom-6 right-6 bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
    >
      <ThemedIcon name='Plus' size={28} />
    </Pressable>
  );
}
