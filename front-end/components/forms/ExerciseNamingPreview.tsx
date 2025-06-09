import { ExerciseNamingType } from '@/types/book';
import { Text, View } from 'react-native';

interface ExerciseNamingPreviewProps {
  type: ExerciseNamingType;
  count: number;
  customNames?: string[];
}

export function ExerciseNamingPreview({ type, count, customNames }: ExerciseNamingPreviewProps) {
  const getPreviewNames = () => {
    const previewCount = Math.min(count, 3);
    const names: string[] = [];

    if (type === 'alpha') {
      for (let i = 0; i < previewCount; i++) {
        names.push(`Exercise ${String.fromCharCode(65 + i)}`);
      }
    } else if (type === 'numeric') {
      for (let i = 0; i < previewCount; i++) {
        names.push(`Exercise ${i + 1}`);
      }
    } else if (type === 'custom' && customNames?.length) {
      return customNames.slice(0, previewCount);
    }

    if (count > previewCount) {
      names.push('...');
      if (type === 'alpha') {
        names.push(`Exercise ${String.fromCharCode(65 + count - 1)}`);
      } else if (type === 'numeric') {
        names.push(`Exercise ${count}`);
      }
    }

    return names;
  };

  const previewNames = getPreviewNames();

  if (!previewNames.length) return null;

  return (
    <View className="mt-1">
      <Text className="text-slate-500 italic">{previewNames.join(', ')}</Text>
    </View>
  );
}
