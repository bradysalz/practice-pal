import { Stack } from 'expo-router';
import React from 'react'; // Import React

export default function SessionsStack() {
  return (
    <Stack>
      {/* The index file is usually the initial screen in the stack */}
      <Stack.Screen
        name="index" // Corresponds to app/(tabs)/home/index.js (Your Sessions List)
        options={{
          title: 'Recent Sessions', // Title for the header
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]" // Corresponds to app/(tabs)/home/[id].js (Your Session Detail)
        options={{
          title: 'Session Details', // Title for the header when viewing details
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="make-session"
        options={{
          title: 'Create Session', // Title for the header when viewing details
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="add-item-to-session"
        options={{
          title: 'Add Item',
          headerShown: true,
        }}
      />

    </Stack>
  );
}
