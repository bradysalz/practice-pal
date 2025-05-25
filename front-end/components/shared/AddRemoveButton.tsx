import { Plus, X } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

interface AddRemoveButtonProps {
  isAdded: boolean;
  onPress: () => void;
}

export function AddRemoveButton({ isAdded, onPress }: AddRemoveButtonProps) {
  return (
    <Pressable
      className={`rounded-md active:opacity-80 flex-row items-center justify-center ${
        isAdded ? 'p-2' : 'px-3 py-1 bg-primary'
      }`}
      onPress={onPress}
    >
      {isAdded ? (
        <X size={16} color="#ef4444" />
      ) : (
        <>
          <Plus size={16} color="white" />
          <Text className="text-white text-sm ml-1">Add</Text>
        </>
      )}
    </Pressable>
  );
}
