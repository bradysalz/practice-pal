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
      {/*
                The index file (app/(tabs)/library/index.tsx) is the default screen
                when the user taps the Library tab icon. It's the root of this stack.
            */}
      <Stack.Screen
        name="index"
        options={{
          title: 'My Library', // Title for the header on the main Library screen
        }}
      />

      {/*
                Screen for displaying the list of Books.
                Path: /library/books
            */}
      <Stack.Screen
        name="books/index"
        options={{
          title: 'Books', // Title for the header on the Books list screen
        }}
      />

      {/*
                Screen for displaying the details of a specific Book,
                which also lists the Sections within that book.
                Path: /library/books/:id
                The header title can dynamically show the book's name.
            */}
      <Stack.Screen
        name="books/[id]"
        options={{
          // We can set a default title, or dynamically set it based on the book data
          title: 'Book Details',
          // Example of dynamically setting title (requires fetching data in the screen)
          // headerTitle: ({ route }) => {
          //   // Fetch book data based on route.params.id and return the book's name
          //   return bookName || 'Book Details';
          // },
        }}
      />

      {/*
                Screen for displaying the details of a specific Section,
                which also lists the Exercises within that section.
                Path: /library/sections/:id
                The header title can dynamically show the section's name.
            */}
      <Stack.Screen
        name="sections/[id]"
        options={{
          title: 'Section Details', // Default title
          // Example of dynamically setting title based on section data
        }}
      />

      {/*
                Screen for displaying the details of a specific Exercise.
                Path: /library/exercises/:id
                The header title can dynamically show the exercise name.
            */}
      <Stack.Screen
        name="exercises/[id]"
        options={{
          title: 'Exercise Details', // Default title
          // Example of dynamically setting title based on exercise data
        }}
      />

      {/*
                Screen for displaying the list of Artists.
                Path: /library/artists
            */}
      <Stack.Screen
        name="artists/index"
        options={{
          title: 'Artists', // Title for the header on the Artists list screen
        }}
      />

      {/*
                Screen for displaying the details of a specific Artist,
                which also lists the Songs by that artist.
                Path: /library/artists/:id
                The header title can dynamically show the artist's name.
            */}
      <Stack.Screen
        name="artists/[id]"
        options={{
          title: 'Artist Details', // Default title
          // Example of dynamically setting title based on artist data
        }}
      />

      {/*
                Screen for displaying the details of a specific Song.
                Path: /library/songs/:id
                The header title can dynamically show the song name.
            */}
      <Stack.Screen
        name="songs/[id]"
        options={{
          title: 'Song Details', // Default title
          // Example of dynamically setting title based on song data
        }}
      />

      {/*
                IMPORTANT: Do NOT list the modal screens (like book-form.tsx) here.
                Modals are typically defined in the root _layout.tsx or a separate
                (modals)/_layout.tsx group and presented over the current stack.
            */}
    </Stack>
  );
}
