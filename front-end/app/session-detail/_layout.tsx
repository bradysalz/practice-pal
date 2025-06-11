import { Stack } from 'expo-router';
import React from 'react'; // Import React

export default function SessionDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
      />
      <Stack.Screen
        name="active-session"
        options={{
          title: 'Active Session',
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
