import { TextInputWithLabel } from '@/components/forms/TextInputWithLabel';
import { Pressable, View } from 'react-native';
import { ThemedIcon } from '../icons/ThemedIcon';

interface InputWithDeleteProps {
  name?: string;
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
}

export function InputWithDelete({ name, onNameChange, onDelete }: InputWithDeleteProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <TextInputWithLabel
          value={name}
          onChangeText={onNameChange}
          placeholder="Syncopation Work"
        />
      </View>
      <Pressable
        onPress={onDelete}
        className="ml-4 h-[40px] w-[40px] items-center justify-center bg-slate-100 rounded-xl"
      >
        <ThemedIcon name="Trash2" size={24} />
      </Pressable>
    </View>
  )
}
