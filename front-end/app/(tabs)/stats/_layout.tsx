import { Stack } from 'expo-router';
import React from 'react'; // Import React

export default function HomeStack() {
  return (
    <Stack>
      {/* The index file is usually the initial screen in the stack */}
      <Stack.Screen
        name="index" // Corresponds to app/(tabs)/home/index.js (Your Sessions List)
        options={{
          title: 'Stats', // Title for the header
        }}
      />
    </Stack>
  );
}
