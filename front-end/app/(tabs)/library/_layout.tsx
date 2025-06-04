// app/(tabs)/library/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

// This layout defines the stack navigator for the Library tab.
// All screens defined within the app/(tabs)/library directory
// will be part of this stack, allowing for nested navigation
// with headers and back buttons.
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
      <Stack.Screen
        name="add-item"
        options={{
          title: 'Add Item',
          headerShown: false,
        }}
      />
      {/* Book Detail screen */}
      <Stack.Screen
        name="book/[bookId]/index" // Corresponds to app/(tabs)/library/book/[bookId]/index.tsx
        options={{
          title: 'Book Details', // Set dynamically in screen
        }}
      />
      {/* Section Detail screen */}
      <Stack.Screen
        name="book/[bookId]/section/[sectionId]/index" // Corresponds to app/(tabs)/library/book/[bookId]/section/[sectionId]/index.tsx
        options={{
          title: 'Section Details', // Set dynamically in screen
        }}
      />
      {/* Exercise Detail screen */}
      <Stack.Screen
        name="book/[bookId]/section/[sectionId]/exercise/[id]" // Corresponds to app/(tabs)/library/book/[bookId]/section/[sectionId]/exercise/[id].tsx
        options={{
          title: 'Exercise Details', // Set dynamically in screen
        }}
      />

      {/* Songs by an Arists */}
      <Stack.Screen
        name="artist/[id]"
        options={{
          title: 'Artist Details', // Default title
          // Example of dynamically setting title based on artist data
        }}
      />

      {/* Song Details */}
      <Stack.Screen
        name="song/[id]"
        options={{
          title: 'Song Details', // Default title
          // Example of dynamically setting title based on song data
        }}
      />
    </Stack>
  );
}
