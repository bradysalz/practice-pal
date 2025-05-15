import { ThemedIcon } from '@/components/icons/themed-icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import React from 'react'; // Import React
import { View } from 'react-native';

// TODO: put icon in header
// function newTitleStyle() {
//   return (
//     <View>
//       <ThemedIcon name="ListMusic" color="red-500" size={24} />
//       <Text>Setlists</Text>
//     </View>
//   );
// }

function newSetlistButton() {
  return (
    <View className="px-4">
      <Button className="flex-row rounded-xl bg-white-500 border border-slate-300">
        <ThemedIcon name="Plus" color="gray-700" size={20} />
        <Text className="text-gray-700">New Setlist</Text>
      </Button>
    </View>
  );
}

export default function SetlistStack() {
  return (
    <Stack>
      {/* The index file is usually the initial screen in the stack */}
      <Stack.Screen
        name="index" // Corresponds to app/(tabs)/home/index.js (Your Sessions List)
        options={{
          title: '<Icon> Setlists', // Title for the header
          headerRight: () => newSetlistButton(),
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Edit Setlist',
        }}
      />
      <Stack.Screen
        name="add-item"
        // options
      />
    </Stack>
  );
}
