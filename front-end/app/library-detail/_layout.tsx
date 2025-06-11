import { Stack } from 'expo-router';
import React from 'react';

export default function LibraryDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="book/[bookId]"
        options={{
          title: 'Book Details',
        }}
      />

      {/* Section Detail screen */}
      <Stack.Screen
        name="section/[sectionId]"
        options={{
          title: 'Section Details',
        }}
      />

      {/* Exercise Detail screen */}
      <Stack.Screen
        name="exercise/[exerciseId]"
        options={{
          title: 'Exercise Details',
        }}
      />


      {/* Songs by an Arists */}
      <Stack.Screen
        name="artist/[id]"
        options={{
          title: 'Artist Details',
        }}
      />

      {/* Song Details */}
      <Stack.Screen
        name="song/[id]"
        options={{
          title: 'Song Details',
        }}
      />
    </Stack>
  );
}
