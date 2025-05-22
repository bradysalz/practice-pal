import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { bookData } from '@/mock/data';
import { useSessionsStore } from '@/stores/session-store';
import { Book, Exercise, Section } from '@/types/library';
import { InputLocalSessionItem } from '@/types/session';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function BooksTab() {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const { currentSession, updateLocalSession } = useSessionsStore();

  const handleToggleExercise = (exercise: Exercise) => {
    if (!currentSession || !selectedSection || !selectedBook) return;

    const isAdded = currentSession.session_items.some(
      (item) => item.exercise_id === exercise.id
    );

    if (isAdded) {
      // Remove the exercise
      updateLocalSession({
        session_items: currentSession.session_items.filter(
          (item) => item.exercise_id !== exercise.id
        ),
      });
    } else {
      // Add the exercise with its book and section context
      const newItem: InputLocalSessionItem = {
        exercise_id: exercise.id,
        song_id: null,
        notes: null,
        tempo: exercise.goalTempo ?? null,
        exercise: {
          id: exercise.id,
          name: exercise.name,
          section: {
            id: selectedSection.id,
            name: selectedSection.name,
            book: {
              id: selectedBook.id,
              name: selectedBook.name,
              author: selectedBook.author,
            },
          },
        },
      };

      updateLocalSession({
        session_items: [...currentSession.session_items, newItem],
      });
    }
  };

  if (viewMode === 'section' && selectedSection) {
    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('book')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-xl font-bold">{selectedSection.name}</Text>
        {selectedSection.exercises.map((exercise) => {
          const isAdded = currentSession?.session_items.some(
            (item) => item.exercise_id === exercise.id
          );

          return (
            <View
              key={exercise.id}
              className="flex-row items-center justify-between p-3 bg-slate-100 rounded-md"
            >
              <View>
                <Text className="font-medium">{exercise.name}</Text>
                {exercise.goalTempo && (
                  <Text className="text-sm text-slate-500">Goal: {exercise.goalTempo} BPM</Text>
                )}
              </View>
              <AddRemoveButton
                isAdded={!!isAdded}
                onPress={() => handleToggleExercise(exercise)}
              />
            </View>
          );
        })}
      </View>
    );
  }

  if (viewMode === 'book' && selectedBook) {
    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('list')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-xl font-bold">{selectedBook.name}</Text>
        {selectedBook.sections.map((section) => (
          <Pressable
            key={section.id}
            className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md active:opacity-80"
            onPress={() => {
              setSelectedSection(section);
              setViewMode('section');
            }}
          >
            <Text className="font-medium">{section.name}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View className="space-y-2 mt-4">
      {bookData.map((book) => (
        <Pressable
          key={book.id}
          className="flex-row items-center justify-between p-4 bg-slate-100 rounded-md active:opacity-80"
          onPress={() => {
            setSelectedBook(book);
            setViewMode('book');
          }}
        >
          <View>
            <Text className="font-medium">{book.name}</Text>
            <Text className="text-sm text-slate-500">{book.author}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
