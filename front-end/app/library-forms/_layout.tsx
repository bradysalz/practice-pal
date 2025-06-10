import { Stack } from 'expo-router';
import React from 'react';

export default function LibraryFormsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="add-book"
        options={{
          title: 'Add Book',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-song"
        options={{
          title: 'Add Song',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-book/[bookId]"
        options={{
          title: 'Edit Book',
        }}
      />
      <Stack.Screen
        name="edit-section/[sectionId]"
        options={{
          title: 'Edit Section',
        }}
      />
    </Stack>
  );
}
