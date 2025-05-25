import { AddRemoveButton } from '@/components/shared/AddRemoveButton';
import { exerciseToDraftSessionItem } from '@/lib/utils/draft-session';
import { BookWithCountsRow, useBooksStore } from '@/stores/book-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { SectionWithCountsRow, useSectionsStore } from '@/stores/section-store';
import { ExerciseRow } from '@/types/session';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function BooksTab() {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<BookWithCountsRow | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionWithCountsRow | null>(null);

  // Store hooks
  const { draftSession, addItemToDraft, removeItemFromDraft } = useDraftSessionsStore();
  const { exercises, fetchExercisesBySection } = useExercisesStore();
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);

  // Fetch exercises when section is selected
  useEffect(() => {
    if (selectedSection) {
      fetchExercisesBySection(selectedSection.id);
    }
  }, [selectedSection?.id, fetchExercisesBySection]);

  const handleToggleExercise = (exercise: ExerciseRow) => {
    if (!draftSession || !selectedSection || !selectedBook) return;

    const isAdded = draftSession.items.some(
      (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
    );

    if (isAdded) {
      // Find the item ID to remove
      const itemToRemove = draftSession.items.find(
        (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
      );
      if (itemToRemove) {
        removeItemFromDraft(itemToRemove.id);
      }
    } else {
      // Add the exercise with its book and section context
      addItemToDraft(
        exerciseToDraftSessionItem(
          exercise,
          selectedSection,
          selectedBook
        )
      );
    }
  };

  if (viewMode === 'section' && selectedSection) {
    const sectionExercises = exercises[selectedSection.id] || [];

    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('book')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-xl font-bold">{selectedSection.name}</Text>
        {sectionExercises.map((exercise) => {
          const isAdded = draftSession?.items.some(
            (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
          );

          return (
            <View
              key={exercise.id}
              className="flex-row items-center justify-between p-3 bg-slate-100 rounded-md"
            >
              <View>
                <Text className="font-medium">{exercise.name}</Text>
                {exercise.goal_tempo && (
                  <Text className="text-sm text-slate-500">Goal: {exercise.goal_tempo} BPM</Text>
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
    const bookSections = sections.filter(section => section.book_id === selectedBook.id);

    return (
      <View className="space-y-2 mt-4">
        <Pressable className="mb-2" onPress={() => setViewMode('list')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-xl font-bold">{selectedBook.name}</Text>
        {bookSections.map((section) => (
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
      {books.map((book) => (
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
          </View>
        </Pressable>
      ))}
    </View>
  );
}
