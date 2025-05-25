import { exerciseToDraftSetlistItem } from '@/lib/utils/draft-setlist';
import { useBooksStore } from '@/stores/book-store';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { useSectionsStore } from '@/stores/section-store';
import { ExerciseRow } from '@/types/session';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SongActionButtons } from '../shared/SongActionButtons';

export function BooksTab() {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Store data
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);
  const exercises = useExercisesStore((state) => state.exercises);
  const fetchExercisesBySection = useExercisesStore((state) => state.fetchExercisesBySection);

  // Draft setlist store
  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const addItemToDraft = useDraftSetlistsStore((state) => state.addItemToDraft);
  const removeItemFromDraft = useDraftSetlistsStore((state) => state.removeItemFromDraft);

  // Get current book and section
  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;
  const selectedSection = selectedSectionId ? sections.find(s => s.id === selectedSectionId) : null;

  // Fetch exercises when section is selected
  useEffect(() => {
    if (selectedSectionId) {
      fetchExercisesBySection(selectedSectionId);
    }
  }, [selectedSectionId, fetchExercisesBySection]);

  if (!draftSetlist) return null;

  const handleAddExercise = (exercise: ExerciseRow) => {
    if (!selectedSection || !selectedBook) return;

    const draftItem = exerciseToDraftSetlistItem(
      exercise,
      selectedSection,
      selectedBook,
    );
    addItemToDraft(draftItem);
  };

  const handleRemoveExercise = (exercise: ExerciseRow) => {
    const itemToRemove = draftSetlist.items.find(
      item => item.type === 'exercise' && item.exercise?.id === exercise.id
    );
    if (itemToRemove) {
      removeItemFromDraft(itemToRemove.id);
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
          if (!exercise.name) return null;

          const isAdded = draftSetlist.items.some(
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
                  <Text className="text-sm text-slate-500">{exercise.goal_tempo} BPM</Text>
                )}
              </View>
              <SongActionButtons
                isAdded={isAdded}
                onAddPress={() => handleAddExercise(exercise)}
                onRemovePress={() => handleRemoveExercise(exercise)}
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
              setSelectedSectionId(section.id);
              setViewMode('section');
            }}
          >
            <View>
              <Text className="font-medium">{section.name}</Text>
              <Text className="text-sm text-slate-500">{section.exercise_count} exercises</Text>
            </View>
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
            setSelectedBookId(book.id);
            setViewMode('book');
          }}
        >
          <View>
            <Text className="font-medium">{book.name || ''}</Text>
            <Text className="text-sm text-slate-500">{book.exercise_count} exercises</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
