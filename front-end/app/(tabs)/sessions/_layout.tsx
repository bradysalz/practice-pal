import { Stack } from 'expo-router';
import React from 'react'; // Import React

export default function SessionsStack() {
  return (
    <Stack>
      {/* The index file is usually the initial screen in the stack */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Recent Sessions', // Title for the header
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="make-session"
        options={{
          title: 'Create Session',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-item-to-session"
        options={{
          title: 'Add Item',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
