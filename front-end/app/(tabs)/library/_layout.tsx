// app/(tabs)/library/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function LibraryStackLayout() {
  return (
    <Stack>
      {/* Library Home screen */}
      <Stack.Screen
        name="index" // Corresponds to app/(tabs)/library/index.tsx
        options={{
          title: 'My Library',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
