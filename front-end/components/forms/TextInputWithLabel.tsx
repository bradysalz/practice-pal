import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextInputWithLabelProps extends TextInputProps {
  label: string;
}

export function TextInputWithLabel({ label, ...inputProps }: TextInputWithLabelProps) {
  return (
    <View>
      <Text className="mb-1 font-medium text-xl">{label}</Text>
      <TextInput
        className="border border-slate-300 text-lg rounded-xl px-3 py-2 bg-slate-50 mr-1"
        {...inputProps}
      />
    </View>
  );
}
