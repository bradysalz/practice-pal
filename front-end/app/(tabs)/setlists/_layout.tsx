import { Stack } from 'expo-router';
import React from 'react';

export default function SetlistStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Setlists',
          headerShown: false,
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
        options={{
          title: 'Add Item',
        }}
      />
    </Stack>
  );
}
