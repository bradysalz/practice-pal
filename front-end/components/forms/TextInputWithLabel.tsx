import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type TextSize = 'sm' | 'md' | 'lg' | 'xl';

const TEXT_SIZE_PAIRS: Record<TextSize, { label: string; input: string }> = {
  'sm': { label: 'text-md', input: 'text-sm' },
  'md': { label: 'text-lg', input: 'text-md' },
  'lg': { label: 'text-xl', input: 'text-lg' },
  'xl': { label: 'text-2xl', input: 'text-xl' },
};

interface TextInputWithLabelProps extends TextInputProps {
  label?: string;
  textSize?: TextSize;
}

export function TextInputWithLabel({ label, textSize = 'xl', ...inputProps }: TextInputWithLabelProps) {
  const sizes = TEXT_SIZE_PAIRS[textSize];

  return (
    <View>
      {label && <Text className={`mb-1 font-medium ${sizes.label}`}>{label}</Text>}
      <TextInput
        className={`border border-slate-300 ${sizes.input} rounded-xl px-3 py-2 bg-slate-50 mr-1`}
        {...inputProps}
      />
    </View>
  );
}
