import { BookWithCountsRow, useBooksStore } from '@/stores/book-store';
import { useDraftSessionsStore } from '@/stores/draft-sessions-store';
import { useDraftSetlistsStore } from '@/stores/draft-setlist-store';
import { useExercisesStore } from '@/stores/exercise-store';
import { SectionWithCountsRow, useSectionsStore } from '@/stores/section-store';
import { ExerciseRow } from '@/types/session';
import { exerciseToDraftSessionItem } from '@/utils/draft-session';
import { exerciseToDraftSetlistItem } from '@/utils/draft-setlist';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { ThemedIcon } from '../icons/ThemedIcon';
import { HighlightBar } from './HighlightBar';
import { ListItemCard } from './ListItemCard';

interface BooksTabProps {
  mode: 'session' | 'setlist';
  searchQuery?: string;
  onNavigate?: () => void;
}

export function BooksTab({ mode, searchQuery = '', onNavigate }: BooksTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'section'>('list');
  const [selectedBook, setSelectedBook] = useState<BookWithCountsRow | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionWithCountsRow | null>(null);

  // Store hooks
  const { exercisesBySectionId: exercises, fetchExercisesBySection } = useExercisesStore();
  const books = useBooksStore((state) => state.books);
  const sections = useSectionsStore((state) => state.sections);

  // Session/Setlist store hooks
  const draftSession = useDraftSessionsStore((state) => state.draftSession);
  const addSessionItem = useDraftSessionsStore((state) => state.addItemToDraft);
  const removeSessionItem = useDraftSessionsStore((state) => state.removeItemFromDraft);

  const draftSetlist = useDraftSetlistsStore((state) => state.draftSetlist);
  const addSetlistItem = useDraftSetlistsStore((state) => state.addItemToDraft);
  const removeSetlistItem = useDraftSetlistsStore((state) => state.removeItemFromDraft);

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
    if (!selectedSection || !selectedBook) return;

    if (mode === 'session' && draftSession) {
      addSessionItem(
        exerciseToDraftSessionItem(
          exercise,
          selectedSection,
          selectedBook
        )
      );
    } else if (mode === 'setlist' && draftSetlist) {
      addSetlistItem(
        exerciseToDraftSetlistItem(
          exercise,
          selectedSection,
          selectedBook
        )
      );
    }
  };

  const handleRemoveExercise = (exercise: ExerciseRow) => {
    if (mode === 'session' && draftSession) {
      const itemToRemove = draftSession.items.find(
        (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
      );
      if (itemToRemove) {
        removeSessionItem(itemToRemove.id);
      }
    } else if (mode === 'setlist' && draftSetlist) {
      const itemToRemove = draftSetlist.items.find(
        (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
      );
      if (itemToRemove) {
        removeSetlistItem(itemToRemove.id);
      }
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

  const isExerciseAdded = (exercise: ExerciseRow) => {
    if (mode === 'session' && draftSession) {
      return draftSession.items.some(
        (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
      );
    } else if (mode === 'setlist' && draftSetlist) {
      return draftSetlist.items.some(
        (item) => item.type === 'exercise' && item.exercise?.id === exercise.id
      );
    }
    return false;
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

        <HighlightBar type="book" name={selectedBook.name} />
        <HighlightBar type="section" name={selectedSection.name} />
        {filteredExercises.map((exercise) => (
          <ListItemCard
            key={exercise.id}
            title={exercise.name || 'Untitled Exercise'}
            subtitle={exercise.goal_tempo ? `Goal: ${exercise.goal_tempo} BPM` : undefined}
            isAdded={isExerciseAdded(exercise)}
            onAdd={() => handleAddExercise(exercise)}
            onRemove={() => handleRemoveExercise(exercise)}
          />
        ))}
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

        <HighlightBar type="book" name={selectedBook.name} />
        {filteredSections.map((section) => (
          <ListItemCard
            key={section.id}
            title={section.name || 'Untitled Section'}
            subtitle={`${section.exercise_count} exercises`}
            onPress={() => {
              setSelectedSection(section);
              setViewMode('section');
              onNavigate?.();
            }}
            isAdded={false}
            rightElement={<ThemedIcon name="ChevronRight" size={20} />}
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
        <ListItemCard
          key={book.id}
          title={book.name || 'Untitled Book'}
          subtitle={`${book.exercise_count} exercises`}
          onPress={() => {
            setSelectedBook(book);
            setViewMode('book');
            onNavigate?.();
          }}
          isAdded={false}
          rightElement={<ThemedIcon name="ChevronRight" size={20} />}
        />
      ))}
    </View>
  );
}
