import { Text, View } from 'react-native';

export function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View className="p-4 bg-orange-100 rounded-md items-center flex-1">
      <Text className="text-lg font-semibold">
        {value} {value === 1 ? label.slice(0, -1) : label}
      </Text>
    </View>
  );
}
