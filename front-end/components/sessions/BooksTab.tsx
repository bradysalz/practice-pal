import { exerciseToDraftSessionItem } from '@/lib/utils/draft-session';
import { BookWithCountsRow, useBooksStore } from '@/stores/book-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { SectionWithCountsRow, useSectionsStore } from '@/stores/section-store';
import { ExerciseRow } from '@/types/session';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { ChevronButton } from '../shared/ChevronButton';
import { SessionItemCard } from '../shared/SessionItemCard';

interface BooksTabProps {
  searchQuery: string;
  onNavigate?: () => void;
}

export function BooksTab({ searchQuery, onNavigate }: BooksTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<BookWithCountsRow | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionWithCountsRow | null>(null);

  // Store hooks
  const { draftSession, addItemToDraft, removeItemFromDraft } = useDraftSessionsStore();
  const { exercises, fetchExercisesBySection } = useExercisesStore();
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (viewMode === 'section') {
        setViewMode('book');
        onNavigate?.();
        return true;
      }
      if (viewMode === 'book') {
        setViewMode('list');
        setSelectedBook(null);
        onNavigate?.();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [viewMode, onNavigate]);

  // Fetch exercises when section is selected
  useEffect(() => {
    if (selectedSection) {
      fetchExercisesBySection(selectedSection.id);
    }
  }, [selectedSection, fetchExercisesBySection]);

  const handleAddExercise = (exercise: ExerciseRow) => {
    if (!draftSession || !selectedSection || !selectedBook) return;
    addItemToDraft(
      exerciseToDraftSessionItem(
        exercise,
        selectedSection,
        selectedBook
      )
    );
  };

  const handleRemoveExercise = (exercise: ExerciseRow) => {
    if (!draftSession) return;
    const itemToRemove = draftSession.items.find(
      (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
    );
    if (itemToRemove) {
      removeItemFromDraft(itemToRemove.id);
    }
  };

  const handleNavigateBack = (newMode: 'list' | 'book') => {
    setViewMode(newMode);
    if (newMode === 'list') {
      setSelectedBook(null);
    }
    if (newMode === 'book') {
      setSelectedSection(null);
    }
    onNavigate?.();
  };

  if (viewMode === 'section' && selectedSection && selectedBook) {
    const sectionExercises = exercises[selectedSection.id] || [];
    const filteredExercises = sectionExercises.filter(exercise =>
      exercise.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View className="gap-y-4 mt-4">
        <Pressable className="mb-2" onPress={() => handleNavigateBack('book')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-2xl font-bold">{selectedBook.name}</Text>
        <Text className="text-xl font-bold">{selectedSection.name}</Text>
        {filteredExercises.map((exercise) => {
          const isAdded = draftSession?.items.some(
            (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
          );

          return (
            <SessionItemCard
              key={exercise.id}
              title={exercise.name || 'Untitled Exercise'}
              subtitle={exercise.goal_tempo ? `Goal: ${exercise.goal_tempo} BPM` : undefined}
              isAdded={!!isAdded}
              onAdd={() => handleAddExercise(exercise)}
              onRemove={() => handleRemoveExercise(exercise)}
            />
          );
        })}
      </View>
    );
  }

  if (viewMode === 'book' && selectedBook) {
    const bookSections = sections.filter(section => section.book_id === selectedBook.id);
    const filteredSections = bookSections.filter(section =>
      section.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View className="gap-y-4 mt-4">
        <Pressable className="mb-2" onPress={() => handleNavigateBack('list')}>
          <Text className="text-primary">{'< Back'}</Text>
        </Pressable>

        <Text className="text-2xl font-bold">{selectedBook.name}</Text>
        {filteredSections.map((section) => (
          <SessionItemCard
            key={section.id}
            title={section.name || 'Untitled Section'}
            onToggle={() => {
              setSelectedSection(section);
              setViewMode('section');
              onNavigate?.();
            }}
            isAdded={false}
            rightElement={<ChevronButton onPress={() => { }} />}
          />
        ))}
      </View>
    );
  }

  const filteredBooks = books.filter(book =>
    book.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="gap-y-4 mt-4">
      {filteredBooks.map((book) => (
        <SessionItemCard
          key={book.id}
          title={book.name || 'Untitled Book'}
          onToggle={() => {
            setSelectedBook(book);
            setViewMode('book');
            onNavigate?.();
          }}
          isAdded={false}
          rightElement={<ChevronButton onPress={() => { }} />}
        />
      ))}
    </View>
  );
}
