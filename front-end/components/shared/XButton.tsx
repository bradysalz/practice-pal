import { X } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

interface XButtonProps {
  onPress: () => void;
}

export function XButton({ onPress }: XButtonProps) {
  return (
    <Pressable
      className="p-2 rounded-md active:opacity-80 flex-row items-center justify-center"
      onPress={onPress}
    >
      <X size={16} color="#ef4444" />
    </Pressable>
  );
}
